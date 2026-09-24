from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
import jwt
import random
from datetime import datetime, timedelta

from shared.database import get_db
from shared.models import User, RoleEnum
from shared.utils import success_response, error_response
from shared.redis_client import set_cache, get_cache, delete_cache
from shared.audit_log import record_audit_event
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi

setup_tracing("auth-service")

app = FastAPI(title="Auth ServicePackage")
app.add_middleware(ObservabilityMiddleware, service_name="auth-service")

JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")
JWT_REFRESH_SECRET = os.getenv("JWT_REFRESH_SECRET", "refreshsecretkey")

class SignupSchema(BaseModel):
    phone: str
    name: str
    email: Optional[EmailStr] = None
    role: RoleEnum = RoleEnum.CUSTOMER

class SendOTPSchema(BaseModel):
    phone: str

class VerifyOTPSchema(BaseModel):
    phone: str
    otp: str

class RefreshTokenSchema(BaseModel):
    refresh_token: str

def create_jwt(user_id: str, role: str):
    access_payload = {
        "sub": str(user_id),
        "role": role,
        "type": "access",
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    refresh_payload = {
        "sub": str(user_id),
        "role": role,
        "type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    access_token = jwt.encode(access_payload, JWT_SECRET, algorithm="HS256")
    refresh_token = jwt.encode(refresh_payload, JWT_REFRESH_SECRET, algorithm="HS256")
    return access_token, refresh_token

@app.post("/auth/signup")
async def signup(data: SignupSchema, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.phone == data.phone))
    if result.scalars().first():
        raise HTTPException(status_code=409, detail="User already exists")

    new_user = User(
        phone=data.phone,
        name=data.name,
        email=data.email,
        role=data.role
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    await record_audit_event(
        db=db,
        event_type="USER_SIGNUP",
        service="auth-service",
        user_id=str(new_user.id),
        ip_address=request.client.host if request.client else None,
        payload={"phone": new_user.phone, "role": new_user.role.value}
    )

    return success_response({"id": str(new_user.id), "name": new_user.name, "role": new_user.role})

@app.post("/auth/send-otp")
async def send_otp(data: SendOTPSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.phone == data.phone))
    user = result.scalars().first()
    
    # Auto-create PARTNER user if not found
    if not user:
        user = User(
            phone=data.phone,
            name="New Partner",
            role=RoleEnum.PARTNER
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    otp = str(random.randint(100000, 999999))
    await set_cache(f"otp:{data.phone}", otp, 300)

    # In reality, trigger SMS service via Kafka or direct API here
    print(f"\n🔔 [MOCK SMS GATEWAY] OTP for {data.phone} is {otp}\n")
    
    return success_response({"message": "OTP sent successfully"})

@app.post("/auth/verify-otp")
async def verify_otp(data: VerifyOTPSchema, request: Request, db: AsyncSession = Depends(get_db)):
    cached_otp = await get_cache(f"otp:{data.phone}")
    if not cached_otp or cached_otp != data.otp:
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")

    result = await db.execute(select(User).where(User.phone == data.phone))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await delete_cache(f"otp:{data.phone}")

    access_token, refresh_token = create_jwt(user.id, user.role.value)
    
    # Store refresh token in redis to allow revocation (logout)
    await set_cache(f"refresh_token:{user.id}", refresh_token, 7 * 24 * 3600)

    await record_audit_event(
        db=db,
        event_type="USER_LOGIN",
        service="auth-service",
        user_id=str(user.id),
        ip_address=request.client.host if request.client else None,
        payload={"phone": user.phone}
    )

    return success_response({
        "user": {"id": str(user.id), "name": user.name, "role": user.role.value},
        "token": access_token,
        "refresh_token": refresh_token
    })

@app.post("/auth/refresh")
async def refresh_token(data: RefreshTokenSchema):
    try:
        payload = jwt.decode(data.refresh_token, JWT_REFRESH_SECRET, algorithms=["HS256"])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
            
        user_id = payload.get("sub")
        role = payload.get("role")
        
        # Verify token matches stored token (wasn't revoked)
        stored_token = await get_cache(f"refresh_token:{user_id}")
        if not stored_token or stored_token != data.refresh_token:
            raise HTTPException(status_code=401, detail="Token revoked or expired")
            
        access_token, new_refresh_token = create_jwt(user_id, role)
        
        # Rotate refresh token
        await set_cache(f"refresh_token:{user_id}", new_refresh_token, 7 * 24 * 3600)
        
        return success_response({
            "token": access_token,
            "refresh_token": new_refresh_token
        })
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@app.post("/auth/logout")
async def logout(request: Request, db: AsyncSession = Depends(get_db)):
    user_id = request.headers.get("x-user-id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    # Revoke refresh token
    await delete_cache(f"refresh_token:{user_id}")
    
    await record_audit_event(
        db=db,
        event_type="USER_LOGOUT",
        service="auth-service",
        user_id=user_id,
        ip_address=request.client.host if request.client else None
    )
    
    return success_response({"message": "Logged out successfully"})

instrument_fastapi(app, "auth-service")
