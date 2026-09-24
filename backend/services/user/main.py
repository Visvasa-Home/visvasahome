from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
import uuid

from shared.database import get_db
from shared.models import User, Address
from shared.utils import success_response, error_response
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi

setup_tracing("user-service")

app = FastAPI(title="User ServicePackage")
app.add_middleware(ObservabilityMiddleware, service_name="user-service")

class AddressSchema(BaseModel):
    label: str
    address_line: str
    city: str
    state: str
    pincode: str
    latitude: float
    longitude: float

def get_current_user_id(request: Request):
    user_id = request.headers.get("x-user-id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user_id

@app.get("/users/me")
async def get_profile(request: Request, db: AsyncSession = Depends(get_db)):
    user_id = get_current_user_id(request)
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return success_response({
        "id": str(user.id),
        "name": user.name,
        "phone": user.phone,
        "email": user.email,
        "role": user.role.value
    })

@app.post("/users/addresses")
async def add_address(data: AddressSchema, request: Request, db: AsyncSession = Depends(get_db)):
    user_id = get_current_user_id(request)
    
    address = Address(
        user_id=uuid.UUID(user_id),
        **data.dict()
    )
    db.add(address)
    await db.commit()
    await db.refresh(address)
    
    return success_response({"id": str(address.id), "label": address.label})

@app.get("/users/addresses")
async def list_addresses(request: Request, db: AsyncSession = Depends(get_db)):
    user_id = get_current_user_id(request)
    result = await db.execute(select(Address).where(Address.user_id == uuid.UUID(user_id)))
    addresses = result.scalars().all()
    
    return success_response([
        {
            "id": str(a.id), 
            "label": a.label,
            "address_line": a.address_line,
            "city": a.city
        } for a in addresses
    ])

@app.get("/localization/strings")
async def get_localization_strings(locale: str = "en"):
    from shared.localization import TRANSLATIONS
    if locale not in TRANSLATIONS:
        locale = "en"
    return success_response({
        "locale": locale,
        "strings": TRANSLATIONS[locale]
    })

instrument_fastapi(app, "user-service")
