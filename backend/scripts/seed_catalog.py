import asyncio
import uuid
import sys
import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

# Add parent path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from shared.database import AsyncSessionLocal
from shared.models import ServiceCategory, ServicePackage

TAXONOMY = {
    "Cleaning & Pest Control": {
        "icon_url": "https://example.com/icons/cleaning.png",
        "sub": {
            "Home Cleaning": [
                "Full home deep cleaning",
                "Kitchen deep cleaning",
                "Bathroom deep cleaning",
                "Sofa cleaning",
                "Carpet/rug cleaning",
                "Mattress cleaning"
            ],
            "Water Tank Cleaning": [
                "Overhead tank cleaning",
                "Underground tank cleaning"
            ],
            "Pest Control": [
                "Cockroach control",
                "Termite control",
                "Bed bug control",
                "Mosquito control",
                "Rodent control"
            ]
        }
    },
    "AC & Appliance Repair": {
        "icon_url": "https://example.com/icons/ac.png",
        "sub": {
            "AC ServicePackage & Repair": [
                "AC foam jet service",
                "AC power jet service",
                "Split AC repair",
                "Window AC repair",
                "AC gas filling",
                "AC installation/uninstallation"
            ],
            "Refrigerator Repair": [
                "Cooling issue repair",
                "Gas filling",
                "Part replacement"
            ],
            "Washing Machine Repair": [
                "Front load repair",
                "Top load repair"
            ],
            "Water Purifier (RO) ServicePackage": [
                "Installation",
                "Filter change",
                "Repair"
            ],
            "Chimney Repair": [
                "Cleaning",
                "Motor/filter repair"
            ],
            "Microwave Repair": [
                "Microwave repair"
            ],
            "Geyser Repair": [
                "Geyser repair"
            ]
        }
    },
    "Electrician": {
        "icon_url": "https://example.com/icons/electrician.png",
        "sub": {
            "Wiring & Fitting": [
                "Switchboard repair/installation",
                "Fan installation",
                "Light/tube light fitting"
            ],
            "Power Backup": [
                "Inverter installation",
                "Stabilizer installation"
            ],
            "Safety Devices": [
                "MCB installation",
                "Camera/doorbell installation"
            ]
        }
    },
    "Plumber": {
        "icon_url": "https://example.com/icons/plumber.png",
        "sub": {
            "Tap & Pipe": [
                "Tap repair/replacement",
                "Pipe leakage fixing"
            ],
            "Bathroom Fittings": [
                "Toilet/flush repair",
                "Wash basin installation",
                "Shower installation"
            ],
            "Water Motor": [
                "Motor installation/repair"
            ]
        }
    },
    "Carpenter": {
        "icon_url": "https://example.com/icons/carpenter.png",
        "sub": {
            "Furniture": [
                "Furniture repair",
                "Furniture assembly"
            ],
            "Doors & Windows": [
                "Door repair",
                "Window repair"
            ],
            "Fittings": [
                "Drilling & hanging",
                "Lock repair/installation"
            ]
        }
    },
    "Painting & Home Decor": {
        "icon_url": "https://example.com/icons/painting.png",
        "sub": {
            "Wall Painting": [
                "Interior painting",
                "Exterior painting",
                "Texture painting"
            ],
            "Waterproofing": [
                "Roof waterproofing",
                "Wall waterproofing"
            ],
            "Wall Decor": [
                "Wallpaper installation",
                "Wood panelling",
                "PVC panels",
                "Decorative wall panels"
            ]
        }
    },
    "Women's Salon & Spa": {
        "icon_url": "https://example.com/icons/salon_women.png",
        "sub": {
            "Skin Care": ["Facial", "Cleanup", "Bleach"],
            "Hair Removal": ["Waxing (full body/parts)", "Threading"],
            "Nail Care": ["Manicure", "Pedicure"],
            "Hair Care": ["Haircut", "Hair spa", "Hair coloring", "Keratin/smoothening"],
            "Makeup": ["Party makeup", "Bridal makeup"],
            "Massage & Spa": ["Body massage", "Head massage"]
        }
    },
    "Men's Grooming": {
        "icon_url": "https://example.com/icons/salon_men.png",
        "sub": {
            "Hair": ["Haircut & styling", "Beard trim/shave"],
            "Skin": ["Facial", "Cleanup"],
            "Massage & Spa": ["Body massage"]
        }
    },
    "Health & Wellness": {
        "icon_url": "https://example.com/icons/health.png",
        "sub": {
            "Medical Assistance": ["Compounding"]
        }
    },
    "Home Construction & Contracting": {
        "icon_url": "https://example.com/icons/contractor.png",
        "sub": {
            "Construction & Renovation": [
                "Full home construction",
                "Home renovation",
                "Masonry work",
                "Tile fitting & flooring",
                "Roofing & ceiling",
                "Contractor of house"
            ]
        }
    }
}

def to_slug(name: str) -> str:
    return name.lower().replace(" ", "-").replace("&", "and").replace("/", "-").replace("(", "").replace(")", "").replace(",", "")

async def seed():
    async with AsyncSessionLocal() as db:
        print("Seeding Categories and Services...")
        
        for cat_name, cat_data in TAXONOMY.items():
            # 1. Create Top-level ServiceCategory
            cat_slug = to_slug(cat_name)
            res = await db.execute(select(ServiceCategory).where(ServiceCategory.slug == cat_slug))
            category = res.scalars().first()
            if not category:
                category = ServiceCategory(name=cat_name, slug=cat_slug, icon_url=cat_data["icon_url"])
                db.add(category)
                await db.commit()
                await db.refresh(category)
                print(f"Created ServiceCategory: {cat_name}")
                
            for sub_name, services_list in cat_data["sub"].items():
                # 2. Create Sub-category
                sub_slug = to_slug(cat_name + " " + sub_name)
                res = await db.execute(select(ServiceCategory).where(ServiceCategory.slug == sub_slug))
                sub_category = res.scalars().first()
                if not sub_category:
                    sub_category = ServiceCategory(name=sub_name, slug=sub_slug, parent_id=category.id)
                    db.add(sub_category)
                    await db.commit()
                    await db.refresh(sub_category)
                    print(f"  Created Sub-category: {sub_name}")
                    
                # 3. Create Services (Sub-sub-category)
                for svc_name in services_list:
                    svc_slug = to_slug(cat_name + " " + sub_name + " " + svc_name)
                    res = await db.execute(select(ServicePackage).where(ServicePackage.slug == svc_slug))
                    service = res.scalars().first()
                    if not service:
                        service = ServicePackage(
                            name=svc_name,
                            slug=svc_slug,
                            category_id=sub_category.id,
                            description=f"Professional {svc_name} service.",
                            base_price=499.0, # Default flat rate for MVP
                            duration_mins=60,
                            estimated_arrival_mins=30 # Instant booking SLA
                        )
                        db.add(service)
                        print(f"    Created ServicePackage: {svc_name}")
                await db.commit()
        
        print("Seeding Complete!")

if __name__ == "__main__":
    asyncio.run(seed())
