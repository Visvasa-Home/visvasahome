from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from pydantic import BaseModel
import uuid

from shared.database import get_db
from shared.models import Booking, Partner, BookingStatusEnum, Rating, User
from typing import Optional
from shared.utils import success_response
from shared.kafka_client import publish_event, KafkaTopics
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi

setup_tracing("rating-service")

app = FastAPI(title="Rating ServicePackage")
app.add_middleware(ObservabilityMiddleware, service_name="rating-service")

class SubmitRatingSchema(BaseModel):
    booking_id: str
    rating: int
    comment: Optional[str] = None

def get_current_user_id(request: Request):
    user_id = request.headers.get("x-user-id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return uuid.UUID(user_id)

@app.post("/ratings")
async def submit_rating(data: SubmitRatingSchema, request: Request, db: AsyncSession = Depends(get_db)):
    customer_id = get_current_user_id(request)
    if request.headers.get("x-user-role") != "CUSTOMER":
        raise HTTPException(status_code=403, detail="Only customers can rate")
        
    res = await db.execute(select(Booking).where(Booking.id == uuid.UUID(data.booking_id)))
    booking = res.scalars().first()
    
    if not booking or booking.customer_id != customer_id:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if booking.status != BookingStatusEnum.COMPLETED:
        raise HTTPException(status_code=400, detail="Only completed bookings can be rated")
        
    p_res = await db.execute(select(Partner).where(Partner.id == booking.partner_id))
    partner = p_res.scalars().first()
    
    if partner:
        # Simple moving average for MVP
        total = partner.total_ratings
        curr_rating = partner.rating
        
        new_total = total + 1
        new_rating = ((curr_rating * total) + data.rating) / new_total
        
        partner.rating = new_rating
        partner.total_ratings = new_total
        
        # Save the actual review text
        review = Rating(
            booking_id=booking.id,
            customer_id=customer_id,
            partner_id=partner.id,
            service_package_id=booking.service_package_id,
            rating=data.rating,
            comment=data.comment
        )
        db.add(review)
        
        await db.commit()
        
        await publish_event(KafkaTopics.RATING_SUBMITTED, {
            "booking_id": str(booking.id),
            "partner_id": str(partner.id),
            "rating": data.rating
        })
        
    return success_response({"message": "Rating submitted"})

@app.get("/services/{service_package_id}/reviews")
async def get_service_reviews(service_package_id: str, db: AsyncSession = Depends(get_db)):
    query = select(Rating).where(Rating.service_package_id == uuid.UUID(service_package_id)).order_by(Rating.created_at.desc())
    result = await db.execute(query)
    reviews = result.scalars().all()
    
    # We should also join user to get customer name. Doing it simple here.
    data = []
    for r in reviews:
        c_res = await db.execute(select(User).where(User.id == r.customer_id))
        customer = c_res.scalars().first()
        data.append({
            "id": str(r.id),
            "rating": r.rating,
            "comment": r.comment,
            "customer_name": customer.name if customer else "Anonymous",
            "created_at": r.created_at.isoformat()
        })
        
    return success_response(data)

@app.get("/partners/{partner_id}/reviews")
async def get_partner_reviews(partner_id: str, db: AsyncSession = Depends(get_db)):
    query = select(Rating).where(Rating.partner_id == uuid.UUID(partner_id)).order_by(Rating.created_at.desc())
    result = await db.execute(query)
    reviews = result.scalars().all()
    
    data = []
    for r in reviews:
        c_res = await db.execute(select(User).where(User.id == r.customer_id))
        customer = c_res.scalars().first()
        data.append({
            "id": str(r.id),
            "rating": r.rating,
            "comment": r.comment,
            "customer_name": customer.name if customer else "Anonymous",
            "created_at": r.created_at.isoformat()
        })
        
    return success_response(data)

instrument_fastapi(app, "rating-service")
