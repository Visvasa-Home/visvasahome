import asyncio
import uuid
import sys
import os

# Add backend directory to path so we can import shared
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set local fallback for testing if not provided
if "DATABASE_URL" not in os.environ:
    os.environ["DATABASE_URL"] = "postgresql+asyncpg://postgres:postgres@localhost:5432/visvasahome"

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from shared.database import engine, AsyncSessionLocal, Base
from shared.models import (
    User, RoleEnum, ServiceCategory, ServicePackage, 
    Partner, PartnerStatusEnum, PartnerLocation, Address
)

async def seed_data():
    # First create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Create categories
        cat_cleaning = ServiceCategory(
            id=uuid.uuid4(), name="Cleaning", slug="cleaning", 
            icon_url="icon-cleaning.png", is_active=True
        )
        cat_plumbing = ServiceCategory(
            id=uuid.uuid4(), name="Plumbing", slug="plumbing", 
            icon_url="icon-plumbing.png", is_active=True
        )
        db.add_all([cat_cleaning, cat_plumbing])
        await db.flush()

        # Create service packages
        pkg_deep_clean = ServicePackage(
            id=uuid.uuid4(), category_id=cat_cleaning.id,
            name="Deep Home Cleaning", slug="deep-home-cleaning", description="Complete home deep cleaning",
            base_price=2499.0, duration_mins=180, skill_tag="CLEANING_EXPERT",
            is_active=True
        )
        pkg_ac_repair = ServicePackage(
            id=uuid.uuid4(), category_id=cat_plumbing.id,
            name="AC Repair (Instant)", slug="ac-repair-instant", description="Emergency AC repair within 30 mins",
            base_price=599.0, duration_mins=60, skill_tag="AC_TECHNICIAN",
            is_active=True
        )
        db.add_all([pkg_deep_clean, pkg_ac_repair])
        await db.flush()

        # Create dummy Customer
        customer = User(
            id=str(uuid.uuid4()), phone="+919876543210", 
            role=RoleEnum.CUSTOMER, name="Ravi Kumar",
            preferred_language="en", tenant_id="IN-BLR"
        )
        db.add(customer)
        await db.flush()

        # Create Address for Customer
        address = Address(
            id=uuid.uuid4(), user_id=uuid.UUID(customer.id),
            label="Home", address_line="123 MG Road",
            city="Bangalore", state="Karnataka", pincode="560001",
            latitude=12.9716, longitude=77.5946, is_default=True
        )
        db.add(address)
        
        # Create dummy Provider (Partner)
        partner_user = User(
            id=str(uuid.uuid4()), phone="+919876543211",
            role=RoleEnum.PARTNER, name="Suresh Sharma",
            preferred_language="hi", tenant_id="IN-BLR"
        )
        db.add(partner_user)
        await db.flush()
        
        partner = Partner(
            id=uuid.UUID(partner_user.id),
            name="Suresh Sharma", phone="+919876543211",
            status=PartnerStatusEnum.ACTIVE,
            rating=4.8, jobs_completed=120
        )
        db.add(partner)
        await db.flush()
        
        # Set Partner Location
        partner_loc = PartnerLocation(
            partner_id=partner.id,
            latitude=12.9720, longitude=77.5950 # Nearby
        )
        db.add(partner_loc)
        
        await db.commit()
        print("SUCCESS: Database successfully seeded with dummy data for MVP Phase!")

if __name__ == "__main__":
    asyncio.run(seed_data())
