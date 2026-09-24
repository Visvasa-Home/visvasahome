from fastapi import FastAPI, Depends, HTTPException, Request, BackgroundTasks
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

from shared.database import get_db
from shared.models import Booking, ServicePackage, Address, BookingStatusEnum, RoleEnum, User, Partner, Quote, QuoteStatusEnum, WalletTransaction, TransactionTypeEnum
from shared.utils import success_response, logger
from shared.kafka_client import publish_event, KafkaTopics
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi
from shared.redis_client import redis_client
from shared.auth import require_role, get_current_user, CurrentUser

setup_tracing("booking-service")

app = FastAPI(title="Booking ServicePackage")
app.add_middleware(ObservabilityMiddleware, service_name="booking-service")

class AddressSchema(BaseModel):
    lat: float
    lon: float

class CreateBookingSchema(BaseModel):
    servicePackageId: str
    datetime: Optional[str] = None
    address: Optional[AddressSchema] = None
    addressId: Optional[str] = None
    paymentMethodId: Optional[str] = None
    is_instant: bool = True

class ActionSchema(BaseModel):
    reason: Optional[str] = None

class QuoteSchema(BaseModel):
    quote_amount: float
    message: Optional[str] = None

@app.post("/bookings", dependencies=[Depends(require_role([RoleEnum.CUSTOMER]))])
async def create_booking(data: CreateBookingSchema, db: AsyncSession = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    customer_id = uuid.UUID(current_user.id)
    
    svc_res = await db.execute(select(ServicePackage).where(ServicePackage.id == uuid.UUID(data.service_package_id)))
    service = svc_res.scalars().first()
    if not service:
        raise HTTPException(status_code=404, detail="ServicePackage not found")
        
    addr_res = await db.execute(select(Address).where(Address.id == uuid.UUID(data.address_id)))
    address = addr_res.scalars().first()
    if not address or address.user_id != customer_id:
        raise HTTPException(status_code=404, detail="Address not found")
        
    user_res = await db.execute(select(User).where(User.id == customer_id))
    customer = user_res.scalars().first()
    
    is_prime = customer and customer.subscription_tier == "PRIME"
    discount = 0.10 if is_prime else 0.0
    
    # Surge Pricing for instant bookings
    surge_multiplier = 1.5 if data.is_instant else 1.0
    base_surge_price = service.base_price * surge_multiplier
    
    insurance_fee = 29.0
    final_amount = (base_surge_price * (1.0 - discount)) + insurance_fee

    booking = Booking(
        customer_id=customer_id,
        service_package_id=service.id,
        address_id=address.id,
        is_instant=data.is_instant,
        scheduled_time=data.scheduled_time,
        price=service.base_price,
        insurance_fee=insurance_fee,
        final_amount=final_amount,
        status=BookingStatusEnum.SEARCHING_PARTNER if data.is_instant else BookingStatusEnum.PENDING
    )
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    
    # Emit Kafka Event
    await publish_event(KafkaTopics.BOOKING_CREATED, {
        "booking_id": str(booking.id),
        "customer_id": str(customer_id),
        "service_package_id": str(service.id),
        "category_id": str(service.category_id),
        "address": {
            "latitude": address.latitude,
            "longitude": address.longitude
        },
        "is_instant": booking.is_instant,
        "price": booking.final_amount
    })
    return success_response({"booking_id": str(booking.id), "status": booking.status.value})

import os
import json
import urllib.request
from urllib.error import HTTPError

from fastapi import BackgroundTasks

async def check_booking_timeout(booking_id: uuid.UUID, timeout_seconds: int = 300):
    """Circuit Breaker / Timeout: Fails booking if provider matching takes too long"""
    await asyncio.sleep(timeout_seconds)
    from shared.database import async_session_maker
    async with async_session_maker() as db:
        res = await db.execute(select(Booking).where(Booking.id == booking_id))
        booking = res.scalars().first()
        if booking and booking.status == BookingStatusEnum.SEARCHING_PARTNER:
            logger.warning(f"Booking {booking_id} timed out waiting for provider. Failing booking.")
            booking.status = BookingStatusEnum.FAILED
            # TODO: Emit event to payment-service to trigger refund
            await db.commit()

async def process_payment_and_search_async(booking_id: uuid.UUID):
    # This runs in background to charge payment, then start the matching search
    from shared.tracing import get_tracer
    tracer = get_tracer()
    
    with tracer.start_as_current_span("process_payment_and_search_async"):
        from shared.database import async_session_maker
        async with async_session_maker() as db:
            res = await db.execute(select(Booking).where(Booking.id == booking_id))
            booking = res.scalars().first()
            if not booking: return
            
            # 1. chargeCustomer (Circuit Breaker with Timeout and Retries using httpx for non-blocking async)
            payment_url = "http://payment-service:3006/payments/charge"
            import json
            import httpx
            import asyncio
            
            payment_payload = {"booking_id": str(booking.id)}
            payment_success = False
            
            MAX_RETRIES = 2
            async with httpx.AsyncClient(timeout=2.0) as client:
                for attempt in range(MAX_RETRIES + 1):
                    try:
                        response = await client.post(payment_url, json=payment_payload)
                        response.raise_for_status()
                        pay_data = response.json()
                        payment_success = True
                        break
                    except Exception as e:
                        logger.error(f"Payment attempt {attempt+1} failed for {booking_id}: {e}")
                        if attempt < MAX_RETRIES:
                            await asyncio.sleep(0.5) # Fast retry for instant services
                
            if not payment_success:
                booking.status = BookingStatusEnum.FAILED
                await db.commit()
                return
                
            # 2. Payment Success -> Begin Search
            booking.status = BookingStatusEnum.SEARCHING_PARTNER
            await db.commit()
            
            # 3. Emit BOOKING_CREATED to trigger matching-service
            addr_res = await db.execute(select(Address).where(Address.id == booking.address_id))
            address = addr_res.scalars().first()
            
            svc_res = await db.execute(select(ServicePackage).where(ServicePackage.id == booking.service_package_id))
            service = svc_res.scalars().first()
            
            try:
                await publish_event(KafkaTopics.BOOKING_CREATED, {
                    "booking_id": str(booking.id),
                    "customer_id": str(booking.customer_id),
                    "service_package_id": str(booking.service_package_id),
                    "category_id": str(service.category_id) if service else None,
                    "address": {
                        "latitude": address.latitude if address else 0.0,
                        "longitude": address.longitude if address else 0.0
                    },
                    "is_instant": booking.is_instant,
                    "price": booking.final_amount
                })
                # Dispatch timeout monitor (5 minutes for instant services)
                asyncio.create_task(check_booking_timeout(booking.id, timeout_seconds=300))
            except Exception as e:
                logger.error(f"Graceful Degradation: Failed to publish BOOKING_CREATED for {booking.id}: {e}")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/bookings", dependencies=[Depends(require_role([RoleEnum.CUSTOMER]))], status_code=201)
async def create_booking(
    data: CreateBookingSchema, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db), 
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Create a new booking (instant or scheduled).
    Returns PENDING immediately. Background task handles matching & payment for instant.
    """
    customer_id = uuid.UUID(current_user.id)
    
    svc_res = await db.execute(select(ServicePackage).where(ServicePackage.id == uuid.UUID(data.servicePackageId)))
    service = svc_res.scalars().first()
    if not service:
        raise HTTPException(status_code=404, detail="ServicePackage not found")
        
    # Handle Address
    if data.addressId:
        addr_res = await db.execute(select(Address).where(Address.id == uuid.UUID(data.addressId)))
        address = addr_res.scalars().first()
        if not address or address.user_id != customer_id:
            raise HTTPException(status_code=404, detail="Address not found")
    elif data.address:
        address = Address(
            user_id=customer_id,
            label="Instant Location",
            address_line="Current Location",
            city="Unknown",
            state="Unknown",
            pincode="000000",
            latitude=data.address.lat,
            longitude=data.address.lon,
            is_default=False
        )
        db.add(address)
        await db.flush()
    else:
        raise HTTPException(status_code=400, detail="Either addressId or address must be provided")
        
    # 1. Create Booking (PENDING)
    scheduled_dt = datetime.fromisoformat(data.datetime) if data.datetime else None
    
    # Calculate prime discount
    user_res = await db.execute(select(User).where(User.id == customer_id))
    customer = user_res.scalars().first()
    is_prime = customer and customer.subscription_tier == "PRIME"
    discount = 0.10 if is_prime else 0.0
    
    is_instant = data.is_instant if data.datetime is None else False
    # Surge Pricing for instant bookings
    surge_multiplier = 1.5 if is_instant else 1.0
    base_surge_price = service.base_price * surge_multiplier
    
    insurance_fee = 29.0
    final_amount = (base_surge_price * (1.0 - discount)) + insurance_fee

    booking = Booking(
        customer_id=customer_id,
        service_package_id=service.id,
        address_id=address.id,
        is_instant=is_instant,
        scheduled_time=scheduled_dt,
        required_skill=service.skill_tag,
        price=service.base_price,
        insurance_fee=insurance_fee,
        final_amount=final_amount,
        status=BookingStatusEnum.PENDING
    )
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    
    if booking.is_instant:
        # Dispatch background payment and search
        background_tasks.add_task(process_payment_and_search_async, booking.id)
    else:
        # For scheduled bookings, we can just emit BOOKING_CREATED immediately or schedule it
        background_tasks.add_task(process_payment_and_search_async, booking.id)
    
    return success_response({
        "bookingId": str(booking.id), 
        "status": booking.status.value,
        "assignedProviderId": None
    })


@app.get("/bookings")
async def list_bookings(db: AsyncSession = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    user_id = uuid.UUID(current_user.id)
    role = current_user.role.value
    
    query = select(Booking).options(
        selectinload(Booking.service),
        selectinload(Booking.partner)
    )
    if role == "PARTNER":
        # For partners, show bookings assigned to them OR bookings looking for a partner
        from sqlalchemy import or_
        query = query.where(
            or_(
                Booking.partner_id == user_id,
                Booking.status == BookingStatusEnum.SEARCHING_PARTNER
            )
        )
    elif role == "ADMIN":
        # Admins see all bookings
        pass
    else:
        query = query.where(Booking.customer_id == user_id)
        
    query = query.order_by(Booking.created_at.desc())
    
    result = await db.execute(query)
    bookings = result.scalars().all()
    
    data = []
    for b in bookings:
        data.append({
            "id": str(b.id),
            "service": b.service.name if b.service else None,
            "status": b.status.value,
            "final_amount": b.final_amount,
            "created_at": b.created_at.isoformat(),
            "partner_name": b.partner.name if b.partner else None
        })
        
    return success_response(data)

@app.post("/bookings/{booking_id}/accept", dependencies=[Depends(require_role([RoleEnum.PARTNER]))])
async def accept_booking(booking_id: str, db: AsyncSession = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    partner_id = uuid.UUID(current_user.id)
        
    lock_key = f"booking_lock_{booking_id}"
    try:
        # Acquire distributed lock
        lock = redis_client.lock(lock_key, timeout=10.0, blocking_timeout=2.0)
        acquired = await lock.acquire()
        if not acquired:
            raise HTTPException(status_code=429, detail="ALREADY_ASSIGNED")
            
        try:
            res = await db.execute(select(Booking).where(Booking.id == uuid.UUID(booking_id)))
            booking = res.scalars().first()
            
            if not booking:
                raise HTTPException(status_code=404, detail="Booking not found")
            if booking.status != BookingStatusEnum.SEARCHING_PARTNER:
                raise HTTPException(status_code=400, detail="ALREADY_ASSIGNED")
                
            # Double check skill validity
            partner_res = await db.execute(select(Partner).where(Partner.id == partner_id))
            partner = partner_res.scalars().first()
            if not partner:
                raise HTTPException(status_code=404, detail="Partner not found")
                
            if booking.required_skill and booking.required_skill not in (partner.skill_tags or []):
                raise HTTPException(status_code=400, detail="INVALID_SKILL")
                
            booking.status = BookingStatusEnum.PARTNER_ASSIGNED
            booking.partner_id = partner_id
            booking.partner_assigned_at = datetime.utcnow()
            
            if booking.is_instant:
                partner.work_status = "ON_JOB"
                
            await db.commit()
            
            # Needs fetching partner details to enrich event in production
            try:
                await publish_event(KafkaTopics.BOOKING_ASSIGNED, {
                    "booking_id": str(booking.id),
                    "customer_id": str(booking.customer_id),
                    "partner_id": str(partner_id)
                })
            except Exception as e:
                logger.error(f"Graceful Degradation: Failed to publish BOOKING_ASSIGNED for {booking.id}: {e}")
            
            # UNLOCK FULL DETAILS for the partner
            from sqlalchemy.orm import selectinload
            full_booking_res = await db.execute(
                select(Booking).options(selectinload(Booking.address), selectinload(Booking.customer)).where(Booking.id == booking.id)
            )
            full_booking = full_booking_res.scalars().first()
            
            unmasked_details = {
                "customer_name": full_booking.customer.name if full_booking.customer else "Customer",
                "customer_phone": full_booking.customer.phone if full_booking.customer else "",
                "full_address": full_booking.address.address_line if full_booking.address else "",
                "latitude": full_booking.address.latitude if full_booking.address else 0.0,
                "longitude": full_booking.address.longitude if full_booking.address else 0.0
            }
            
            return success_response({
                "message": "Booking accepted. Full details unlocked.",
                "details": unmasked_details
            })
        finally:
            await lock.release()
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        logger.error(f"Error acquiring lock: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/bookings/{booking_id}/quote", dependencies=[Depends(require_role([RoleEnum.PARTNER]))])
async def submit_quote(booking_id: str, data: QuoteSchema, db: AsyncSession = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    partner_id = uuid.UUID(current_user.id)
        
    res = await db.execute(select(Booking).where(Booking.id == uuid.UUID(booking_id)))
    booking = res.scalars().first()
    if not booking or booking.status != BookingStatusEnum.SEARCHING_PARTNER:
        raise HTTPException(status_code=400, detail="Lead is no longer accepting quotes")
        
    partner_res = await db.execute(select(Partner).where(Partner.id == partner_id))
    partner = partner_res.scalars().first()
    
    QUOTE_FEE = 50.0 # Pay-per-quote fee
    
    if partner.wallet_balance < QUOTE_FEE:
        raise HTTPException(status_code=400, detail="Insufficient wallet balance")
        
    partner.wallet_balance -= QUOTE_FEE
    
    transaction = WalletTransaction(
        partner_id=partner_id,
        booking_id=booking.id,
        amount=-QUOTE_FEE,
        transaction_type=TransactionTypeEnum.LEAD_QUOTE_FEE,
        description=f"Fee for quoting on lead {booking.id}"
    )
    db.add(transaction)
    
    quote = Quote(
        booking_id=booking.id,
        partner_id=partner_id,
        quote_amount=data.quote_amount,
        message=data.message,
        status=QuoteStatusEnum.PENDING
    )
    db.add(quote)
    
    await db.commit()
    return success_response({"message": "Quote submitted", "deducted": QUOTE_FEE, "remaining_balance": partner.wallet_balance})

@app.post("/bookings/{booking_id}/call")
async def proxy_call(booking_id: str, db: AsyncSession = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    user_id = uuid.UUID(current_user.id)
    role = current_user.role.value
    
    query = select(Booking).where(Booking.id == uuid.UUID(booking_id)).options(
        selectinload(Booking.customer),
        selectinload(Booking.partner)
    )
    res = await db.execute(query)
    booking = res.scalars().first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if role == "PARTNER" and booking.partner_id != user_id:
        raise HTTPException(status_code=403, detail="Not assigned to this booking")
    if role == "CUSTOMER" and booking.customer_id != user_id:
        raise HTTPException(status_code=403, detail="Not your booking")
        
    if not booking.partner:
        raise HTTPException(status_code=400, detail="No partner assigned yet")
        
    customer_phone = booking.customer.phone
    partner_phone = booking.partner.phone
    
    # === MOCK TELEPHONY INTEGRATION (Exotel / Twilio) ===
    # In production, we would make an HTTP POST request to our Telephony Provider here,
    # passing `customer_phone` and `partner_phone`. The provider would call the caller first,
    # and when picked up, call the receiver, masking both behind a Virtual Number.
    
    caller_role = "Partner" if role == "PARTNER" else "Customer"
    logger.info(f"[CALL PROXY] Bridging call from {caller_role} for Booking {booking_id}")
    logger.info(f"   Customer Phone: {customer_phone} <---> Partner Phone: {partner_phone}")
    
    return success_response({
        "message": "Call initiated via proxy. You will receive an incoming call from our Virtual Number shortly."
    })

class ArrivalOTPSchema(BaseModel):
    otp: str

@app.post("/bookings/{booking_id}/arrive", dependencies=[Depends(require_role([RoleEnum.PARTNER]))])
async def mark_arrived(booking_id: str, data: ArrivalOTPSchema, db: AsyncSession = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    partner_id = uuid.UUID(current_user.id)
    
    res = await db.execute(select(Booking).where(Booking.id == uuid.UUID(booking_id)))
    booking = res.scalars().first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if booking.partner_id != partner_id:
        raise HTTPException(status_code=403, detail="Not your booking")
        
    if booking.status != BookingStatusEnum.PARTNER_ASSIGNED and booking.status != BookingStatusEnum.PARTNER_EN_ROUTE:
        raise HTTPException(status_code=400, detail="Booking is not in the correct state to arrive")
        
    # MOCK OTP VERIFICATION (In reality, fetch from Redis generated for this booking)
    # The PRD says: "customer se 4-digit OTP lo — proof of arrival"
    if data.otp != "1234":
        raise HTTPException(status_code=400, detail="Invalid Arrival OTP")
        
    booking.status = BookingStatusEnum.IN_PROGRESS
    booking.service_started_at = datetime.utcnow()
    await db.commit()
    
    return success_response({"message": "Arrival verified. ServicePackage started."})

@app.post("/bookings/{booking_id}/complete", dependencies=[Depends(require_role([RoleEnum.PARTNER]))])
async def mark_completed(booking_id: str, db: AsyncSession = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    partner_id = uuid.UUID(current_user.id)
    
    res = await db.execute(select(Booking).where(Booking.id == uuid.UUID(booking_id)))
    booking = res.scalars().first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if booking.partner_id != partner_id:
        raise HTTPException(status_code=403, detail="Not your booking")
        
    booking.status = BookingStatusEnum.COMPLETED
    booking.service_completed_at = datetime.utcnow()
    await db.commit()
    
    # Notify customer to make payment
    return success_response({"message": "ServicePackage completed. Waiting for payment."})

@app.post("/bookings/{booking_id}/sos")
async def trigger_sos(booking_id: str, request: Request, db: AsyncSession = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    user_id = uuid.UUID(current_user.id)
    role = current_user.role.value
    
    res = await db.execute(select(Booking).where(Booking.id == uuid.UUID(booking_id)))
    booking = res.scalars().first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if role == "PARTNER" and booking.partner_id != user_id:
        raise HTTPException(status_code=403, detail="Not assigned to this booking")
    if role == "CUSTOMER" and booking.customer_id != user_id:
        raise HTTPException(status_code=403, detail="Not your booking")
        
    await publish_event(KafkaTopics.SOS_TRIGGERED, {
        "booking_id": str(booking.id),
        "triggered_by": str(user_id),
        "role": role,
        "location": {
            "latitude": 0.0, # In production, accept lat/lng from mobile payload
            "longitude": 0.0
        },
        "timestamp": datetime.utcnow().isoformat()
    })
    
    # Audit log
    from shared.audit_log import record_audit_event
    await record_audit_event(
        db=db, event_type="SOS_TRIGGERED", service="booking-service",
        user_id=str(user_id), ip_address=request.client.host if request.client else None,
        payload={"booking_id": booking_id, "role": role}
    )
    
    return success_response({"message": "Trust & Safety team has been notified. They will call you immediately."})

instrument_fastapi(app, "booking-service")
