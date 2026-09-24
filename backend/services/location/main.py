"""
Location ServicePackage — Port 3015
-----------------------------
Real-time GPS, ETA calculation, partner proximity.

Architecture:
  - Partner GPS updates → Redis GEO (NOT PostgreSQL every second)
  - ETA calculation uses Haversine distance + average speed estimate
  - Periodic persistence to partner_locations table (every N updates or on job events)
  - Admin live map uses get_nearby endpoint

Endpoints:
  PUT  /location/update                     — partner: push GPS update
  GET  /location/partner/{partner_id}       — get partner live location
  GET  /location/eta/{booking_id}           — customer: ETA for active booking
  GET  /location/nearby                     — admin: all online partners (map view)
  POST /location/geofence/check             — internal: check if partner arrived
"""

import os
import math
from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

from shared.database import get_db
from shared.models import Partner, PartnerLocation, Booking, BookingStatusEnum, RoleEnum
from shared.utils import success_response, logger
from shared.kafka_client import publish_event, KafkaTopics
from shared.redis_client import redis_client, set_partner_online
from shared.auth import get_current_user, require_role, CurrentUser
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi

setup_tracing("location-service")

app = FastAPI(title="Location ServicePackage — VisvasaHome")
app.add_middleware(ObservabilityMiddleware, service_name="location-service")

# Average partner travel speed for ETA (km/h)
AVG_SPEED_KMH = float(os.getenv("PARTNER_AVG_SPEED_KMH", "25"))
# Persist to DB every N Redis updates
PERSIST_EVERY_N = int(os.getenv("LOCATION_PERSIST_EVERY_N", "10"))

# In-memory counter per partner (resets on restart — acceptable for counters)
_update_counters: dict = {}


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance between two points in km (Haversine formula)."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def eta_minutes(distance_km: float, speed_kmh: float = AVG_SPEED_KMH) -> int:
    """Convert km distance to ETA in minutes."""
    return max(1, int((distance_km / speed_kmh) * 60))


# ─── Schemas ─────────────────────────────────────────────────────────────────

class LocationUpdateSchema(BaseModel):
    latitude: float
    longitude: float
    accuracy: Optional[float] = None      # GPS accuracy in meters
    heading: Optional[float] = None       # degrees 0-360
    speed: Optional[float] = None         # m/s


class GeofenceCheckSchema(BaseModel):
    partner_id: str
    booking_id: str
    target_latitude: float
    target_longitude: float
    radius_meters: float = 100.0


# ─── Partner GPS Update ───────────────────────────────────────────────────────

@app.put("/location/update", dependencies=[Depends(require_role([RoleEnum.PARTNER]))])
async def update_location(
    data: LocationUpdateSchema,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Partner: Push GPS update.
    - Primary write goes to Redis GEO (fast, real-time)
    - DB write happens every PERSIST_EVERY_N updates (batched)
    - Publishes PARTNER_LOCATION_UPDATE Kafka event for real-time dispatch
    """
    partner_id = current_user.id

    # 1. Write to Redis GEO (always)
    await set_partner_online(partner_id, data.latitude, data.longitude)

    # 2. Cache rich location payload for ETA queries
    location_key = f"partner_location:{partner_id}"
    await redis_client.hset(location_key, mapping={
        "lat": data.latitude,
        "lng": data.longitude,
        "accuracy": data.accuracy or 0,
        "heading": data.heading or 0,
        "speed": data.speed or 0,
        "updated_at": datetime.utcnow().isoformat(),
    })
    await redis_client.expire(location_key, 300)  # 5 min TTL

    # 3. Periodic DB persistence
    counter_key = f"loc_counter:{partner_id}"
    count = await redis_client.incr(counter_key)
    if count >= PERSIST_EVERY_N:
        await redis_client.delete(counter_key)
        try:
            p_loc_res = await db.execute(
                select(PartnerLocation).where(PartnerLocation.partner_id == uuid.UUID(partner_id))
            )
            p_loc = p_loc_res.scalars().first()
            if p_loc:
                p_loc.latitude = data.latitude
                p_loc.longitude = data.longitude
                p_loc.accuracy = data.accuracy
            else:
                p_loc = PartnerLocation(
                    partner_id=uuid.UUID(partner_id),
                    latitude=data.latitude,
                    longitude=data.longitude,
                    accuracy=data.accuracy,
                )
                db.add(p_loc)
            await db.commit()
        except Exception as e:
            logger.error(f"[location] DB persist error for {partner_id}: {e}")

    # 4. Publish Kafka event for dispatch engine / notification service
    await publish_event(KafkaTopics.PARTNER_LOCATION_UPDATE, {
        "partner_id": partner_id,
        "latitude": data.latitude,
        "longitude": data.longitude,
        "speed": data.speed,
        "heading": data.heading,
        "timestamp": datetime.utcnow().isoformat(),
    })

    return success_response({"message": "Location updated"})


# ─── Partner Live Location ────────────────────────────────────────────────────

@app.get("/location/partner/{partner_id}")
async def get_partner_location(partner_id: str, db: AsyncSession = Depends(get_db)):
    """
    Get a partner's current live location from Redis.
    Used by customer app to show partner on map.
    """
    location_key = f"partner_location:{partner_id}"
    cached = await redis_client.hgetall(location_key)

    if cached:
        return success_response({
            "partner_id": partner_id,
            "latitude": float(cached.get("lat", 0)),
            "longitude": float(cached.get("lng", 0)),
            "heading": float(cached.get("heading", 0)),
            "speed": float(cached.get("speed", 0)),
            "updated_at": cached.get("updated_at"),
            "source": "realtime",
        })

    # Fallback to DB
    res = await db.execute(
        select(PartnerLocation).where(PartnerLocation.partner_id == uuid.UUID(partner_id))
    )
    p_loc = res.scalars().first()
    if not p_loc:
        raise HTTPException(status_code=404, detail="Partner location not available")

    return success_response({
        "partner_id": partner_id,
        "latitude": p_loc.latitude,
        "longitude": p_loc.longitude,
        "updated_at": p_loc.updated_at.isoformat() if p_loc.updated_at else None,
        "source": "database",
    })


# ─── ETA Calculation ─────────────────────────────────────────────────────────

@app.get("/location/eta/{booking_id}")
async def get_eta(booking_id: str, db: AsyncSession = Depends(get_db)):
    """
    Get ETA for a booking (partner → customer address).
    Used by customer app during PARTNER_ON_WAY status.
    """
    # 1. Fetch booking + address
    from sqlalchemy.orm import selectinload
    b_res = await db.execute(
        select(Booking)
        .options(selectinload(Booking.address))
        .where(Booking.id == uuid.UUID(booking_id))
    )
    booking = b_res.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if not booking.partner_id:
        raise HTTPException(status_code=400, detail="No partner assigned yet")

    if not booking.address or not booking.address.latitude:
        raise HTTPException(status_code=400, detail="Customer address has no coordinates")

    dest_lat = booking.address.latitude
    dest_lng = booking.address.longitude

    # 2. Get partner location from Redis
    location_key = f"partner_location:{str(booking.partner_id)}"
    cached = await redis_client.hgetall(location_key)

    if cached:
        partner_lat = float(cached.get("lat", 0))
        partner_lng = float(cached.get("lng", 0))
        partner_speed = float(cached.get("speed", 0))  # m/s
    else:
        # Fallback to DB
        p_loc_res = await db.execute(
            select(PartnerLocation).where(PartnerLocation.partner_id == booking.partner_id)
        )
        p_loc = p_loc_res.scalars().first()
        if not p_loc:
            raise HTTPException(status_code=404, detail="Partner location unavailable")
        partner_lat = p_loc.latitude
        partner_lng = p_loc.longitude
        partner_speed = 0

    # 3. Calculate ETA
    distance_km = haversine_km(partner_lat, partner_lng, dest_lat, dest_lng)

    # Use live speed if available, else default
    if partner_speed > 1.0:  # m/s — min threshold to use live speed
        speed_kmh = partner_speed * 3.6
    else:
        speed_kmh = AVG_SPEED_KMH

    eta_mins = eta_minutes(distance_km, speed_kmh)

    return success_response({
        "booking_id": booking_id,
        "partner_id": str(booking.partner_id),
        "distance_km": round(distance_km, 2),
        "eta_minutes": eta_mins,
        "partner_location": {
            "latitude": partner_lat,
            "longitude": partner_lng,
        },
        "destination": {
            "latitude": dest_lat,
            "longitude": dest_lng,
        },
    })


# ─── Admin Map View ───────────────────────────────────────────────────────────

@app.get("/location/nearby", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def get_nearby_partners(
    latitude: float,
    longitude: float,
    radius_km: float = 50.0,
):
    """
    Admin: Get all online partners within radius (for live operations map).
    Returns from Redis GEO.
    """
    try:
        # GEORADIUS returns list of member names
        results = await redis_client.georadius(
            "partners_geo", longitude, latitude, radius_km, unit="km",
            withcoord=True, withdist=True, sort="ASC"
        )
        partners_list = []
        for item in results:
            if isinstance(item, (list, tuple)) and len(item) >= 3:
                partner_id, dist, coords = item[0], item[1], item[2]
                loc_key = f"partner_location:{partner_id}"
                cached = await redis_client.hgetall(loc_key)
                partners_list.append({
                    "partner_id": partner_id,
                    "distance_km": round(float(dist), 2),
                    "latitude": float(coords[1]) if coords else None,
                    "longitude": float(coords[0]) if coords else None,
                    "heading": float(cached.get("heading", 0)) if cached else 0,
                    "last_seen": cached.get("updated_at") if cached else None,
                })
        return success_response({"count": len(partners_list), "partners": partners_list})
    except Exception as e:
        logger.error(f"[location] georadius error: {e}")
        return success_response({"count": 0, "partners": []})


# ─── Internal Geofence Check ─────────────────────────────────────────────────

@app.post("/location/geofence/check")
async def check_geofence(data: GeofenceCheckSchema, db: AsyncSession = Depends(get_db)):
    """
    Internal: Check if a partner is within radius of a target (arrival check).
    Called by booking service before verifying OTP.
    """
    location_key = f"partner_location:{data.partner_id}"
    cached = await redis_client.hgetall(location_key)

    if not cached:
        return success_response({"within_radius": False, "reason": "Location not available"})

    partner_lat = float(cached.get("lat", 0))
    partner_lng = float(cached.get("lng", 0))

    dist_km = haversine_km(partner_lat, partner_lng, data.target_latitude, data.target_longitude)
    dist_m = dist_km * 1000

    within = dist_m <= data.radius_meters

    return success_response({
        "within_radius": within,
        "distance_meters": round(dist_m, 1),
        "radius_meters": data.radius_meters,
        "partner_location": {"latitude": partner_lat, "longitude": partner_lng},
    })


instrument_fastapi(app, "location-service")
