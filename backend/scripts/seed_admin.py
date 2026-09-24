"""
Seed Script: Create Initial SUPER_ADMIN User
---------------------------------------------
Usage:
  python scripts/seed_admin.py

This script:
  1. Creates a User record with ADMIN role
  2. Creates an AdminUser record with SUPER_ADMIN role
  3. Prints the login credentials

Run this ONCE after first `alembic upgrade head`.
"""

import asyncio
import os
import sys
import uuid
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select

# Load .env
from dotenv import load_dotenv
load_dotenv()

from shared.models import User, AdminUser, AdminRoleEnum, RoleEnum

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://visvasahome:visvasahome123@localhost:5432/visvasahome")

# ─── Super Admin Details ──────────────────────────────────────────────────────
SUPER_ADMIN_NAME  = os.getenv("SEED_ADMIN_NAME",  "Kunal Sharma")
SUPER_ADMIN_PHONE = os.getenv("SEED_ADMIN_PHONE", "9999999990")
SUPER_ADMIN_EMAIL = os.getenv("SEED_ADMIN_EMAIL", "admin@visvasahome.com")


async def seed():
    engine = create_async_engine(DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # Check if admin already exists
        existing = await session.execute(
            select(User).where(User.phone == SUPER_ADMIN_PHONE)
        )
        user = existing.scalars().first()

        if user:
            print(f"⚠️  User with phone {SUPER_ADMIN_PHONE} already exists.")
            # Check if AdminUser exists
            admin_check = await session.execute(
                select(AdminUser).where(AdminUser.user_id == user.id)
            )
            admin_user = admin_check.scalars().first()
            if admin_user:
                print(f"✅  AdminUser (SUPER_ADMIN) already exists: {user.name}")
                print(f"    Phone: {user.phone}")
                print(f"    Role: {admin_user.admin_role.value}")
            else:
                # Create AdminUser for existing User
                admin_user = AdminUser(
                    user_id=user.id,
                    admin_role=AdminRoleEnum.SUPER_ADMIN,
                    is_active=True,
                )
                session.add(admin_user)
                await session.commit()
                print(f"✅  AdminUser (SUPER_ADMIN) created for existing user: {user.name}")
            return

        # Create User
        user = User(
            id=uuid.uuid4(),
            phone=SUPER_ADMIN_PHONE,
            email=SUPER_ADMIN_EMAIL,
            name=SUPER_ADMIN_NAME,
            role=RoleEnum.ADMIN,
            is_active=True,
        )
        session.add(user)
        await session.flush()  # get the ID

        # Create AdminUser
        admin_user = AdminUser(
            user_id=user.id,
            admin_role=AdminRoleEnum.SUPER_ADMIN,
            is_active=True,
        )
        session.add(admin_user)
        await session.commit()

        print("\n" + "=" * 55)
        print("  ✅ SUPER_ADMIN Created Successfully!")
        print("=" * 55)
        print(f"  Name  : {SUPER_ADMIN_NAME}")
        print(f"  Phone : {SUPER_ADMIN_PHONE}")
        print(f"  Email : {SUPER_ADMIN_EMAIL}")
        print(f"  Role  : SUPER_ADMIN")
        print(f"  ID    : {user.id}")
        print("\n  → Login via OTP using the phone number above.")
        print("=" * 55 + "\n")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
