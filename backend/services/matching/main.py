import asyncio
from shared.kafka_client import create_consumer, KafkaTopics, publish_event
from shared.redis_client import get_nearby_partners
from shared.database import AsyncSessionLocal
from sqlalchemy.future import select
from shared.models import Partner, Booking, BookingStatusEnum, ServicePackage
from shared.utils import logger, setup_logger
from shared.tracing import setup_tracing
import uuid

setup_logger("matching-service")
setup_tracing("matching-service")
from shared.middleware import ObservabilityMiddleware

async def process_booking(event):
    booking_id = uuid.UUID(event["booking_id"])
    
    async with AsyncSessionLocal() as db:
        # Fetch full booking details
        from shared.models import Address
        from sqlalchemy.orm import selectinload
        
        b_res = await db.execute(select(Booking).options(selectinload(Booking.address)).where(Booking.id == booking_id))
        booking = b_res.scalars().first()
        
        if not booking or booking.status != BookingStatusEnum.SEARCHING_PARTNER:
            logger.warning(f"Booking {booking_id} not valid for matching.")
            return

        lat = booking.address.latitude
        lng = booking.address.longitude
        pincode = booking.address.pincode
        required_skill = booking.required_skill
        
        from datetime import datetime
        # 1. HARD FILTERS (Eligibility)
        # Get nearby partners from Redis (handles distance < MAX_RADIUS)
        nearby_partner_ids_str = await get_nearby_partners(lat, lng, 10.0)
        if not nearby_partner_ids_str:
            logger.warning(f"No nearby partners for booking {booking_id}")
            return
            
        nearby_partner_ids = [uuid.UUID(pid) for pid in nearby_partner_ids_str]
        
        # Filter in PostgreSQL
        from sqlalchemy.orm import selectinload
        query = select(Partner).options(selectinload(Partner.user)).where(
            Partner.id.in_(nearby_partner_ids),
            Partner.status == "ACTIVE",
            Partner.work_status == "AVAILABLE",
            Partner.is_available == True
        )
        
        result = await db.execute(query)
        potential_partners = result.scalars().all()
        
        eligible_partners = []
        for pro in potential_partners:
            # Skill Match (Leaf-level)
            if required_skill and required_skill not in (pro.skill_tags or []):
                continue
                
            # ServicePackage Area Match
            if pincode and pro.service_areas and pincode not in pro.service_areas:
                continue
                
            # Working Hours Match
            if booking.is_instant and pro.working_hours_start and pro.working_hours_end:
                now_time = datetime.utcnow().time()
                if not (pro.working_hours_start <= now_time <= pro.working_hours_end):
                    continue
                    
            # Calendar Slot Free (simplified)
            # if not isSlotFree(pro.calendar, booking.slot_start, booking.slot_end): continue
            
            eligible_partners.append(pro)
            
        if not eligible_partners:
            logger.warning(f"No eligible partners after HARD filters for booking {booking_id}")
            return
            
        # 2. SOFT RANKING (Scoring)
        ranked_pros = []
        for pro in eligible_partners:
            # Scale all metrics to 100 for proper weighting
            proximity_score = 90.0 # Placeholder for 10.0km calculation
            rating_score = (pro.rating or 4.0) * 20 # 5.0 -> 100
            acceptance_rate = (pro.completion_rate or 0.8) * 100
            skill_proficiency = min((pro.jobs_completed or 0), 100.0)
            fairness_score = 100.0 # Boost if jobs today < average
            
            # score = 0.30×proximity + 0.25×rating + 0.20×skill_proficiency + 0.15×acceptance_rate + 0.10×fairness_score
            score = (0.30 * proximity_score) + (0.25 * rating_score) + (0.20 * skill_proficiency) + (0.15 * acceptance_rate) + (0.10 * fairness_score)
            ranked_pros.append((score, pro))
            
        # Sort descending by score
        ranked_pros.sort(key=lambda x: x[0], reverse=True)
        top_pros = [p[1] for p in ranked_pros]
        
        # 3. DISPATCH OFFER (Masked Payload)
        # IMPORTANT: No exact address, no phone number, no customer name in this payload!
        from shared.models import ServicePackage
        from shared.localization import translate, format_currency, format_datetime
        
        svc_res = await db.execute(select(ServicePackage).where(ServicePackage.id == booking.service_package_id))
        service_obj = svc_res.scalars().first()
        
        platform_fee_percent = 0.085
        net_payout = booking.final_amount * (1.0 - platform_fee_percent)
        
        if booking.is_instant:
            # Batch broadcast to top 5
            batch = top_pros[:5]
            for pro in batch:
                lang = pro.user.preferred_language if (pro.user and pro.user.preferred_language) else "en"
                
                offer_payload = {
                    "booking_id": str(booking.id),
                    "service": translate(service_obj.name if service_obj else "ServicePackage", lang),
                    "area": translate(f"{booking.address.label or 'Local'} Area - Pincode {booking.address.pincode}", lang),
                    "distance": translate("approx 2.4 km", lang),
                    "slot": translate("Instant", lang) if booking.is_instant else booking.scheduled_time.strftime("%A, %I:%M %p"),
                    "payout": format_currency(net_payout, lang),
                    "expires_in": 20
                }
                
                try:
                    await publish_event("BOOKING_OFFERED", {
                        "partner_id": str(pro.id),
                        "payload": offer_payload
                    })
                    logger.info(f"Offered instant booking {booking_id} to partner {pro.id} (Lang: {lang})")
                except Exception as e:
                    logger.error(f"Graceful Degradation: Failed to offer to partner {pro.id}: {e}")
        else:
            # Sequential to top 1
            best_pro = top_pros[0]
            lang = best_pro.user.preferred_language if (best_pro.user and best_pro.user.preferred_language) else "en"
            
            offer_payload = {
                "booking_id": str(booking.id),
                "service": translate(service_obj.name if service_obj else "ServicePackage", lang),
                "area": translate(f"{booking.address.label or 'Local'} Area - Pincode {booking.address.pincode}", lang),
                "distance": translate("approx 2.4 km", lang),
                "slot": booking.scheduled_time.strftime("%A, %I:%M %p"),
                "payout": format_currency(net_payout, lang),
                "expires_in": 30
            }
            
            try:
                await publish_event("BOOKING_OFFERED", {
                    "partner_id": str(best_pro.id),
                    "payload": offer_payload
                })
                logger.info(f"Offered scheduled booking {booking_id} to partner {best_pro.id} (Lang: {lang})")
            except Exception as e:
                logger.error(f"Graceful Degradation: Failed to offer to partner {best_pro.id}: {e}")

from fastapi import FastAPI, HTTPException
import uuid
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Matching ServicePackage")
app.add_middleware(ObservabilityMiddleware, service_name="matching-service")

class BestProviderResponse(BaseModel):
    partner_id: str
    score: float

@app.get("/matching/best-provider", response_model=BestProviderResponse)
async def get_best_provider(lat: float, lng: float, pincode: str = "", required_skill: Optional[str] = None):
    async with AsyncSessionLocal() as db:
        # 1. HARD FILTERS (Eligibility)
        nearby_partner_ids_str = await get_nearby_partners(lat, lng, 10.0)
        if not nearby_partner_ids_str:
            raise HTTPException(status_code=404, detail="No nearby partners")
            
        nearby_partner_ids = [uuid.UUID(pid) for pid in nearby_partner_ids_str]
        
        query = select(Partner).where(
            Partner.id.in_(nearby_partner_ids),
            Partner.status == "ACTIVE",
            Partner.work_status == "AVAILABLE",
            Partner.is_available == True
        )
        
        result = await db.execute(query)
        potential_partners = result.scalars().all()
        
        eligible_partners = []
        for pro in potential_partners:
            if required_skill and required_skill not in (pro.skill_tags or []):
                continue
            if pincode and pro.service_areas and pincode not in pro.service_areas:
                continue
            eligible_partners.append(pro)
            
        if not eligible_partners:
            raise HTTPException(status_code=404, detail="No eligible partners found")
            
        # 2. SOFT RANKING
        ranked_pros = []
        for pro in eligible_partners:
            proximity_score = 90.0
            rating_score = (pro.rating or 4.0) * 20
            acceptance_rate = (pro.completion_rate or 0.8) * 100
            skill_proficiency = min((pro.jobs_completed or 0), 100.0)
            fairness_score = 100.0
            
            score = (0.30 * proximity_score) + (0.25 * rating_score) + (0.20 * skill_proficiency) + (0.15 * acceptance_rate) + (0.10 * fairness_score)
            ranked_pros.append((score, pro))
            
        ranked_pros.sort(key=lambda x: x[0], reverse=True)
        best_score, best_pro = ranked_pros[0]
        
        return {"partner_id": str(best_pro.id), "score": best_score}

# Maintain the existing background consumer for non-instant bookings
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    consumer_task = asyncio.create_task(main_consumer())
    yield
    consumer_task.cancel()

app.router.lifespan_context = lifespan

async def main_consumer():
    from shared.kafka_client import create_consumer, extract_trace_context
    from shared.tracing import get_tracer
    tracer = get_tracer()
    
    consumer = await create_consumer("matching-service-group", [KafkaTopics.BOOKING_CREATED])
    await consumer.start()
    try:
        logger.info("Matching Consumer started...")
        async for msg in consumer:
            if msg.topic == KafkaTopics.BOOKING_CREATED:
                context = extract_trace_context(msg)
                with tracer.start_as_current_span("process_booking_consumer", context=context):
                    await process_booking(msg.value)
    except asyncio.CancelledError:
        pass
    finally:
        await consumer.stop()

instrument_fastapi(app, "matching-service")
