"""
AMC (Annual Maintenance Contract) ServicePackage — Port 3013
------------------------------------------------------
Endpoints:
  GET  /amc/plans                         — list all active plans
  POST /amc/plans                         — admin: create plan
  PATCH /amc/plans/{id}                   — admin: update plan
  DELETE /amc/plans/{id}                  — admin: deactivate plan

  POST /amc/subscribe                     — customer: subscribe
  GET  /amc/subscriptions/me              — customer: my subscriptions
  GET  /amc/subscriptions                 — admin: all subscriptions
  POST /amc/subscriptions/{id}/renew      — renew subscription
  POST /amc/subscriptions/{id}/use-visit  — use a visit (triggers booking)
"""

from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime, date, timedelta

from shared.database import get_db
from shared.models import (
    AmcPlan, AmcSubscription, User, Address, Payment,
    AmcPlanTypeEnum, AmcSubscriptionStatusEnum,
    RoleEnum, PaymentStatusEnum, Notification, NotificationTypeEnum, NotificationStatusEnum
)
from shared.utils import success_response, logger
from shared.kafka_client import publish_event, KafkaTopics
from shared.auth import get_current_user, require_role, CurrentUser
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi

setup_tracing("amc-service")

app = FastAPI(title="AMC ServicePackage — VisvasaHome")
app.add_middleware(ObservabilityMiddleware, service_name="amc-service")


# ─── Schemas ─────────────────────────────────────────────────────────────────

class CreateAmcPlanSchema(BaseModel):
    name: str
    description: Optional[str] = None
    plan_type: AmcPlanTypeEnum
    price: float
    validity_months: int
    total_visits: int
    applicable_services: List[str] = []
    benefits: List[str] = []

class UpdateAmcPlanSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    is_active: Optional[bool] = None
    benefits: Optional[List[str]] = None

class SubscribeSchema(BaseModel):
    plan_id: str
    address_id: Optional[str] = None
    auto_renew: bool = False

class UseVisitSchema(BaseModel):
    address_id: str
    notes: Optional[str] = None


# ─── Plan Endpoints ───────────────────────────────────────────────────────────

@app.get("/amc/plans")
async def list_plans(db: AsyncSession = Depends(get_db)):
    """List all active AMC plans — public endpoint."""
    result = await db.execute(select(AmcPlan).where(AmcPlan.is_active == True))
    plans = result.scalars().all()
    return success_response([
        {
            "id": str(p.id),
            "name": p.name,
            "plan_type": p.plan_type.value,
            "price": float(p.price),
            "validity_months": p.validity_months,
            "total_visits": p.total_visits,
            "benefits": p.benefits,
            "applicable_services": p.applicable_services,
        }
        for p in plans
    ])


@app.post("/amc/plans", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def create_plan(data: CreateAmcPlanSchema, db: AsyncSession = Depends(get_db)):
    """Admin: Create a new AMC plan."""
    plan = AmcPlan(
        name=data.name,
        description=data.description,
        plan_type=data.plan_type,
        price=data.price,
        validity_months=data.validity_months,
        total_visits=data.total_visits,
        applicable_services=data.applicable_services,
        benefits=data.benefits,
    )
    db.add(plan)
    await db.commit()
    await db.refresh(plan)
    return success_response({"id": str(plan.id), "name": plan.name})


@app.patch("/amc/plans/{plan_id}", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def update_plan(plan_id: str, data: UpdateAmcPlanSchema, db: AsyncSession = Depends(get_db)):
    """Admin: Update an AMC plan."""
    res = await db.execute(select(AmcPlan).where(AmcPlan.id == uuid.UUID(plan_id)))
    plan = res.scalars().first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    if data.name is not None:
        plan.name = data.name
    if data.description is not None:
        plan.description = data.description
    if data.price is not None:
        plan.price = data.price
    if data.is_active is not None:
        plan.is_active = data.is_active
    if data.benefits is not None:
        plan.benefits = data.benefits
    await db.commit()
    return success_response({"message": "Plan updated"})


@app.delete("/amc/plans/{plan_id}", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def deactivate_plan(plan_id: str, db: AsyncSession = Depends(get_db)):
    """Admin: Deactivate a plan (soft delete)."""
    res = await db.execute(select(AmcPlan).where(AmcPlan.id == uuid.UUID(plan_id)))
    plan = res.scalars().first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    plan.is_active = False
    await db.commit()
    return success_response({"message": "Plan deactivated"})


# ─── Subscription Endpoints ───────────────────────────────────────────────────

@app.post("/amc/subscribe", dependencies=[Depends(require_role([RoleEnum.CUSTOMER]))])
async def subscribe(
    data: SubscribeSchema,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Customer: Subscribe to an AMC plan."""
    plan_res = await db.execute(select(AmcPlan).where(AmcPlan.id == uuid.UUID(data.plan_id)))
    plan = plan_res.scalars().first()
    if not plan or not plan.is_active:
        raise HTTPException(status_code=404, detail="Plan not found or inactive")

    # Check for existing active subscription to same plan
    existing_res = await db.execute(
        select(AmcSubscription).where(
            AmcSubscription.customer_id == uuid.UUID(current_user.id),
            AmcSubscription.plan_id == plan.id,
            AmcSubscription.status == AmcSubscriptionStatusEnum.ACTIVE
        )
    )
    if existing_res.scalars().first():
        raise HTTPException(status_code=400, detail="You already have an active subscription to this plan")

    start = date.today()
    end = date(start.year, start.month + plan.validity_months, start.day) if (start.month + plan.validity_months) <= 12 else \
          date(start.year + ((start.month + plan.validity_months - 1) // 12),
               (start.month + plan.validity_months - 1) % 12 + 1, start.day)

    subscription = AmcSubscription(
        customer_id=uuid.UUID(current_user.id),
        plan_id=plan.id,
        address_id=uuid.UUID(data.address_id) if data.address_id else None,
        status=AmcSubscriptionStatusEnum.PENDING,   # changes to ACTIVE after payment
        start_date=start,
        end_date=end,
        visits_used=0,
        visits_remaining=plan.total_visits,
        auto_renew=data.auto_renew,
    )
    db.add(subscription)
    await db.commit()
    await db.refresh(subscription)

    # Notify customer
    notif = Notification(
        user_id=uuid.UUID(current_user.id),
        title="AMC Subscription Created",
        body=f"Your {plan.name} subscription has been created. Complete payment to activate.",
        notif_type=NotificationTypeEnum.IN_APP,
        status=NotificationStatusEnum.PENDING,
        data={"subscription_id": str(subscription.id), "plan": plan.name},
    )
    db.add(notif)
    await db.commit()

    await publish_event(KafkaTopics.AMC_SUBSCRIBED, {
        "subscription_id": str(subscription.id),
        "customer_id": str(current_user.id),
        "plan_id": str(plan.id),
        "plan_name": plan.name,
        "amount": float(plan.price),
    })

    return success_response({
        "subscription_id": str(subscription.id),
        "plan": plan.name,
        "status": subscription.status.value,
        "start_date": str(start),
        "end_date": str(end),
        "visits": plan.total_visits,
        "message": "Complete payment to activate your AMC subscription.",
    })


@app.get("/amc/subscriptions/me", dependencies=[Depends(require_role([RoleEnum.CUSTOMER]))])
async def my_subscriptions(
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Customer: Get my AMC subscriptions."""
    from sqlalchemy.orm import selectinload
    res = await db.execute(
        select(AmcSubscription)
        .options(selectinload(AmcSubscription.plan))
        .where(AmcSubscription.customer_id == uuid.UUID(current_user.id))
        .order_by(AmcSubscription.created_at.desc())
    )
    subs = res.scalars().all()
    return success_response([
        {
            "id": str(s.id),
            "plan": s.plan.name if s.plan else None,
            "status": s.status.value,
            "start_date": str(s.start_date),
            "end_date": str(s.end_date),
            "visits_used": s.visits_used,
            "visits_remaining": s.visits_remaining,
            "auto_renew": s.auto_renew,
        }
        for s in subs
    ])


@app.get("/amc/subscriptions", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def all_subscriptions(
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Admin: List all AMC subscriptions, optionally filtered by status."""
    from sqlalchemy.orm import selectinload
    query = select(AmcSubscription).options(
        selectinload(AmcSubscription.plan),
        selectinload(AmcSubscription.customer)
    )
    if status:
        query = query.where(AmcSubscription.status == AmcSubscriptionStatusEnum(status.upper()))
    query = query.order_by(AmcSubscription.created_at.desc())
    res = await db.execute(query)
    subs = res.scalars().all()
    return success_response([
        {
            "id": str(s.id),
            "customer": s.customer.name if s.customer else None,
            "plan": s.plan.name if s.plan else None,
            "status": s.status.value,
            "start_date": str(s.start_date),
            "end_date": str(s.end_date),
            "visits_used": s.visits_used,
            "visits_remaining": s.visits_remaining,
        }
        for s in subs
    ])


@app.post("/amc/subscriptions/{subscription_id}/renew", dependencies=[Depends(require_role([RoleEnum.CUSTOMER]))])
async def renew_subscription(
    subscription_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Customer: Renew an expiring/expired AMC subscription."""
    from sqlalchemy.orm import selectinload
    res = await db.execute(
        select(AmcSubscription)
        .options(selectinload(AmcSubscription.plan))
        .where(AmcSubscription.id == uuid.UUID(subscription_id))
    )
    sub = res.scalars().first()
    if not sub or sub.customer_id != uuid.UUID(current_user.id):
        raise HTTPException(status_code=404, detail="Subscription not found")
    if sub.status == AmcSubscriptionStatusEnum.ACTIVE:
        raise HTTPException(status_code=400, detail="Subscription is already active")

    plan = sub.plan
    today = date.today()
    months = plan.validity_months

    # Extend from today if expired, else from current end_date
    base = sub.end_date if sub.status != AmcSubscriptionStatusEnum.EXPIRED else today
    new_end = date(base.year + ((base.month + months - 1) // 12),
                   (base.month + months - 1) % 12 + 1, base.day)

    sub.status = AmcSubscriptionStatusEnum.PENDING  # pending payment
    sub.end_date = new_end
    sub.visits_remaining += plan.total_visits
    sub.renewed_at = datetime.utcnow()
    await db.commit()

    await publish_event(KafkaTopics.AMC_RENEWED, {
        "subscription_id": str(sub.id),
        "customer_id": str(current_user.id),
        "plan_name": plan.name,
        "new_end_date": str(new_end),
    })

    return success_response({
        "message": "Renewal initiated. Complete payment to reactivate.",
        "new_end_date": str(new_end),
        "visits_added": plan.total_visits,
    })


@app.post("/amc/subscriptions/{subscription_id}/use-visit", dependencies=[Depends(require_role([RoleEnum.CUSTOMER]))])
async def use_visit(
    subscription_id: str,
    data: UseVisitSchema,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Customer: Use one AMC visit — creates a booking under this subscription."""
    from sqlalchemy.orm import selectinload
    res = await db.execute(
        select(AmcSubscription)
        .options(selectinload(AmcSubscription.plan))
        .where(AmcSubscription.id == uuid.UUID(subscription_id))
    )
    sub = res.scalars().first()
    if not sub or sub.customer_id != uuid.UUID(current_user.id):
        raise HTTPException(status_code=404, detail="Subscription not found")
    if sub.status != AmcSubscriptionStatusEnum.ACTIVE:
        raise HTTPException(status_code=400, detail="Subscription is not active")
    if sub.visits_remaining <= 0:
        raise HTTPException(status_code=400, detail="No visits remaining in this subscription")
    if sub.end_date < date.today():
        sub.status = AmcSubscriptionStatusEnum.EXPIRED
        await db.commit()
        raise HTTPException(status_code=400, detail="Subscription has expired")

    sub.visits_used += 1
    sub.visits_remaining -= 1
    await db.commit()

    return success_response({
        "message": "Visit used. Book your service using this subscription.",
        "subscription_id": str(sub.id),
        "visits_remaining": sub.visits_remaining,
        "hint": "Pass subscription_id when creating a booking.",
    })


instrument_fastapi(app, "amc-service")
