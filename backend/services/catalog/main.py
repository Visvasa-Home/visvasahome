from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from shared.database import get_db
from shared.models import ServiceCategory, ServicePackage
from shared.utils import success_response
from shared.redis_client import get_cache, set_cache
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi

setup_tracing("catalog-service")

app = FastAPI(title="Catalog ServicePackage")
app.add_middleware(ObservabilityMiddleware, service_name="catalog-service")

@app.get("/catalog/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    cache_key = "catalog:categories"
    cached = await get_cache(cache_key)
    if cached:
        return success_response(cached)

    result = await db.execute(select(ServiceCategory).where(ServiceCategory.is_active == True))
    categories = result.scalars().all()
    
    data = [{"id": str(c.id), "name": c.name, "slug": c.slug, "icon": c.icon_url} for c in categories]
    await set_cache(cache_key, data, 3600)
    
    return success_response(data)

@app.get("/catalog/services")
async def get_services(category_id: str = None, db: AsyncSession = Depends(get_db)):
    cache_key = f"catalog:services:{category_id or 'all'}"
    cached = await get_cache(cache_key)
    if cached:
        return success_response(cached)

    query = select(ServicePackage).where(ServicePackage.is_active == True)
    if category_id:
        query = query.where(ServicePackage.category_id == category_id)
        
    result = await db.execute(query.options(selectinload(ServicePackage.category)))
    services = result.scalars().all()
    
    data = [{
        "id": str(s.id), 
        "name": s.name, 
        "price": s.base_price, 
        "duration": s.duration_mins,
        "category_name": s.category.name if s.category else None
    } for s in services]
    
    await set_cache(cache_key, data, 3600)
    return success_response(data)

@app.get("/catalog/tree")
async def get_catalog_tree(db: AsyncSession = Depends(get_db)):
    cache_key = "catalog:tree"
    cached = await get_cache(cache_key)
    if cached:
        return success_response(cached)
        
    # Get all categories
    cat_res = await db.execute(select(ServiceCategory).where(ServiceCategory.is_active == True))
    all_categories = cat_res.scalars().all()
    
    # Get all services
    svc_res = await db.execute(select(ServicePackage).where(ServicePackage.is_active == True))
    all_services = svc_res.scalars().all()
    
    category_map = {str(c.id): {"id": str(c.id), "name": c.name, "slug": c.slug, "icon": c.icon_url, "sub_categories": []} for c in all_categories}
    
    service_map = {}
    for s in all_services:
        cid = str(s.category_id)
        if cid not in service_map:
            service_map[cid] = []
        service_map[cid].append({
            "id": str(s.id),
            "name": s.name,
            "slug": s.slug,
            "description": s.description,
            "price": s.base_price,
            "duration": s.duration_mins,
            "estimated_arrival_mins": s.estimated_arrival_mins
        })
    
    top_categories = []
    for c in all_categories:
        cid = str(c.id)
        cat_dict = category_map[cid]
        
        if cid in service_map:
            cat_dict["service_packages"] = service_map[cid]
            
        if c.parent_id:
            parent_id = str(c.parent_id)
            if parent_id in category_map:
                category_map[parent_id]["sub_categories"].append(cat_dict)
        else:
            top_categories.append(cat_dict)
            
    await set_cache(cache_key, top_categories, 3600)
    return success_response(top_categories)

@app.get("/catalog/recommendations")
async def get_recommendations(user_id: str = None, db: AsyncSession = Depends(get_db)):
    """
    Mock AI Recommendations. 
    In production, this would call an ML model inferencing service.
    For now, it returns 3 popular services.
    """
    # Simply fetch 3 random active services as a mock for AI recommendations
    query = select(ServicePackage).where(ServicePackage.is_active == True).limit(3)
    result = await db.execute(query.options(selectinload(ServicePackage.category)))
    services = result.scalars().all()
    
    data = [{
        "id": str(s.id), 
        "name": s.name, 
        "price": s.base_price, 
        "category_name": s.category.name if s.category else None,
        "recommendation_reason": "Popular in your area"
    } for s in services]
    
    return success_response(data)

instrument_fastapi(app, "catalog-service")
