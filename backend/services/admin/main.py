"""
Admin ServicePackage — Port 3009
---------------------------
Operations Control Center with full RBAC.

Admin Roles:
  SUPER_ADMIN        — full access to everything
  OPERATIONS_ADMIN   — bookings, dispatch, live ops
  PARTNER_ADMIN      — partner KYC, verification, training
  CUSTOMER_SUPPORT   — complaints, customer profiles
  FINANCE_ADMIN      — payments, refunds, settlements, commission
  SERVICE_ADMIN      — catalog, service areas, pricing
  ANALYTICS_ADMIN    — reports, dashboards

Modules:
  /admin/analytics           — dashboard KPIs (alias from analytics service)
  /admin/bookings            — booking management
  /admin/partners            — partner management + KYC
  /admin/customers           — customer management
  /admin/services            — service catalog management
  /admin/finance             — payments, refunds, invoices
  /admin/coupons             — coupon CRUD
  /admin/service-areas       — service area CRUD
  /admin/commission/rules    — commission rule management
  /admin/users               — admin user management (SUPER_ADMIN only)
"""

from fastapi import FastAPI, Depends, HTTPException, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime

from shared.database import get_db
from shared.models import (
    Booking, Partner, Payment, User, Rating, Complaint,
    AdminUser, AdminPermissionEntry, AdminRoleEnum, AdminPermissionEnum,
    Coupon, CouponTypeEnum, ServiceArea,
    BookingStatusEnum, PartnerStatusEnum, PaymentStatusEnum, RoleEnum,
    Refund, RefundStatusEnum, Settlement, SettlementStatusEnum,
    Notification, NotificationTypeEnum, NotificationStatusEnum,
    PartnerDocument, DocumentStatusEnum
)
from shared.utils import success_response, logger
from shared.kafka_client import publish_event, KafkaTopics
from shared.audit_log import record_audit_event
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi
from shared.auth import require_role, get_current_user, CurrentUser

setup_tracing("admin-service")

app = FastAPI(title="Admin ServicePackage — VisvasaHome Operations Control Center")
app.add_middleware(ObservabilityMiddleware, service_name="admin-service")


# ─── RBAC: Role-Based Permission Defaults ────────────────────────────────────

ROLE_PERMISSIONS = {
    AdminRoleEnum.SUPER_ADMIN: list(AdminPermissionEnum),
    AdminRoleEnum.OPERATIONS_ADMIN: [
        AdminPermissionEnum.VIEW, AdminPermissionEnum.ASSIGN,
        AdminPermissionEnum.UPDATE,
    ],
    AdminRoleEnum.PARTNER_ADMIN: [
        AdminPermissionEnum.VIEW, AdminPermissionEnum.APPROVE,
        AdminPermissionEnum.UPDATE,
    ],
    AdminRoleEnum.CUSTOMER_SUPPORT: [
        AdminPermissionEnum.VIEW, AdminPermissionEnum.UPDATE,
    ],
    AdminRoleEnum.FINANCE_ADMIN: [
        AdminPermissionEnum.VIEW, AdminPermissionEnum.REFUND,
        AdminPermissionEnum.EXPORT,
    ],
    AdminRoleEnum.SERVICE_ADMIN: [
        AdminPermissionEnum.VIEW, AdminPermissionEnum.CREATE,
        AdminPermissionEnum.UPDATE, AdminPermissionEnum.DELETE,
    ],
    AdminRoleEnum.ANALYTICS_ADMIN: [
        AdminPermissionEnum.VIEW, AdminPermissionEnum.EXPORT,
    ],
}


# ─── Schemas ─────────────────────────────────────────────────────────────────

class PartnerStatusUpdateSchema(BaseModel):
    status: Optional[str] = None

class KycActionSchema(BaseModel):
    action: str   # 'approve' or 'reject'
    reason: Optional[str] = None

class AssignPartnerSchema(BaseModel):
    partner_id: str

class CreateCouponSchema(BaseModel):
    code: str
    description: Optional[str] = None
    coupon_type: CouponTypeEnum
    discount_value: float
    min_order_value: float = 0
    max_discount_cap: Optional[float] = None
    valid_from: datetime
    valid_until: datetime
    max_uses: Optional[int] = None
    uses_per_user: int = 1
    applicable_services: List[str] = []

class UpdateCouponSchema(BaseModel):
    is_active: Optional[bool] = None
    valid_until: Optional[datetime] = None
    max_uses: Optional[int] = None

class CreateServiceAreaSchema(BaseModel):
    name: str
    city: str
    state: str
    pincodes: List[str]

class UpdateServiceAreaSchema(BaseModel):
    name: Optional[str] = None
    pincodes: Optional[List[str]] = None
    is_active: Optional[bool] = None

class CreateAdminUserSchema(BaseModel):
    user_id: str
    admin_role: AdminRoleEnum

class RefundSchema(BaseModel):
    payment_id: str
    amount: float
    reason: str

class DocumentActionSchema(BaseModel):
    action: str       # approve / reject
    rejection_reason: Optional[str] = None


# ─── Analytics / Dashboard ────────────────────────────────────────────────────

@app.get("/admin/analytics", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def get_analytics(request: Request, db: AsyncSession = Depends(get_db)):
    """Admin: Core KPI dashboard."""
    admin_id = request.headers.get("x-user-id")
    users_count     = await db.scalar(select(func.count(User.id)).where(User.role == RoleEnum.CUSTOMER))
    partners_count  = await db.scalar(select(func.count(Partner.id)))
    bookings_count  = await db.scalar(select(func.count(Booking.id)))
    revenue         = await db.scalar(select(func.sum(Payment.amount)).where(Payment.status == PaymentStatusEnum.CAPTURED))
    active_bookings = await db.scalar(
        select(func.count(Booking.id)).where(
            Booking.status.in_([BookingStatusEnum.JOB_STARTED, BookingStatusEnum.PARTNER_ON_WAY, BookingStatusEnum.ARRIVED])
        )
    )
    open_complaints = await db.scalar(
        select(func.count(Complaint.id)).where(Complaint.status.in_(["OPEN", "ESCALATED"]))
    )
    pending_kyc     = await db.scalar(
        select(func.count(Partner.id)).where(Partner.status == PartnerStatusEnum.KYC_SUBMITTED)
    )

    await record_audit_event(
        db=db, event_type="ADMIN_VIEWED_ANALYTICS", service="admin-service",
        user_id=admin_id, ip_address=request.client.host if request.client else None
    )

    return success_response({
        "total_customers": users_count or 0,
        "total_partners": partners_count or 0,
        "total_bookings": bookings_count or 0,
        "total_revenue": float(revenue or 0),
        "active_bookings": active_bookings or 0,
        "open_complaints": open_complaints or 0,
        "pending_kyc_partners": pending_kyc or 0,
    })


# ─── Bookings Management ──────────────────────────────────────────────────────

@app.get("/admin/bookings", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def get_all_bookings(
    status: Optional[str] = None,
    is_instant: Optional[bool] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=5, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Admin: List all bookings with filters."""
    query = select(Booking).options(
        selectinload(Booking.customer),
        selectinload(Booking.partner),
        selectinload(Booking.service),
    )
    if status:
        query = query.where(Booking.status == BookingStatusEnum(status.upper()))
    if is_instant is not None:
        query = query.where(Booking.is_instant == is_instant)
    query = query.order_by(Booking.created_at.desc()).offset((page - 1) * per_page).limit(per_page)

    res = await db.execute(query)
    bookings = res.scalars().all()

    return success_response([
        {
            "id": str(b.id),
            "customer": b.customer.name if b.customer else None,
            "partner": b.partner.name if b.partner else None,
            "service": b.service.name if b.service else None,
            "status": b.status.value,
            "is_instant": b.is_instant,
            "final_amount": float(b.final_amount) if b.final_amount else None,
            "created_at": b.created_at.isoformat(),
            "scheduled_time": b.scheduled_time.isoformat() if b.scheduled_time else None,
        }
        for b in bookings
    ])


@app.post("/admin/bookings/{booking_id}/assign", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def assign_partner(
    booking_id: str, data: AssignPartnerSchema, request: Request, db: AsyncSession = Depends(get_db)
):
    """Admin: Manually assign a partner to a booking."""
    admin_id = request.headers.get("x-user-id")
    b_res = await db.execute(select(Booking).where(Booking.id == uuid.UUID(booking_id)))
    booking = b_res.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.partner_id = uuid.UUID(data.partner_id)
    booking.status = BookingStatusEnum.PARTNER_ASSIGNED
    booking.partner_assigned_at = datetime.utcnow()
    await db.commit()

    await publish_event(KafkaTopics.BOOKING_ASSIGNED, {
        "booking_id": str(booking.id),
        "partner_id": data.partner_id,
        "admin_assigned": True
    })
    await record_audit_event(
        db=db, event_type="ADMIN_ASSIGNED_PARTNER", service="admin-service",
        user_id=admin_id, ip_address=request.client.host if request.client else None,
        payload={"booking_id": booking_id, "partner_id": data.partner_id}
    )
    return success_response({"message": "Partner assigned successfully"})


@app.post("/admin/bookings/{booking_id}/cancel", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def cancel_booking_admin(
    booking_id: str, request: Request,
    data: Optional[dict] = None,
    db: AsyncSession = Depends(get_db)
):
    """Admin: Cancel a booking."""
    admin_id = request.headers.get("x-user-id")
    b_res = await db.execute(select(Booking).where(Booking.id == uuid.UUID(booking_id)))
    booking = b_res.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = BookingStatusEnum.CANCELLED_BY_ADMIN
    booking.cancellation_by = "ADMIN"
    booking.cancellation_reason = (data or {}).get("reason", "Admin cancellation")
    await db.commit()

    await publish_event(KafkaTopics.BOOKING_CANCELLED, {
        "booking_id": booking_id, "cancelled_by": "ADMIN"
    })
    await record_audit_event(
        db=db, event_type="ADMIN_CANCELLED_BOOKING", service="admin-service",
        user_id=admin_id, ip_address=request.client.host if request.client else None,
        payload={"booking_id": booking_id}
    )
    return success_response({"message": "Booking cancelled by admin"})


# ─── Partner Management ───────────────────────────────────────────────────────

@app.get("/admin/partners", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def get_all_partners(
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=5, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Admin: List all partners with status filter."""
    query = select(Partner)
    if status:
        query = query.where(Partner.status == PartnerStatusEnum(status.upper()))
    query = query.order_by(Partner.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    res = await db.execute(query)
    partners = res.scalars().all()
    return success_response([
        {
            "id": str(p.id),
            "name": p.name, "phone": p.phone,
            "status": p.status.value,
            "rating": p.rating,
            "jobs_completed": p.jobs_completed,
            "service_areas": p.service_areas,
            "career_level": p.career_level.value,
            "wallet_balance": float(p.wallet_balance or 0),
        }
        for p in partners
    ])


@app.get("/admin/partners/{partner_id}", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def get_partner_detail(partner_id: str, db: AsyncSession = Depends(get_db)):
    """Admin: Get full partner details including documents."""
    res = await db.execute(
        select(Partner)
        .options(selectinload(Partner.documents), selectinload(Partner.services))
        .where(Partner.id == uuid.UUID(partner_id))
    )
    partner = res.scalars().first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    return success_response({
        "id": str(partner.id),
        "name": partner.name,
        "phone": partner.phone,
        "email": partner.email,
        "status": partner.status.value,
        "rating": partner.rating,
        "total_ratings": partner.total_ratings,
        "jobs_completed": partner.jobs_completed,
        "career_level": partner.career_level.value,
        "wallet_balance": float(partner.wallet_balance or 0),
        "skill_tags": partner.skill_tags,
        "service_areas": partner.service_areas,
        "background_check_passed": partner.background_check_passed,
        "documents": [
            {
                "id": str(d.id),
                "type": d.document_type.value,
                "status": d.status.value,
                "file_url": d.file_url,
                "rejection_reason": d.rejection_reason,
            }
            for d in partner.documents
        ],
        "service_packages": [{"id": str(s.id), "name": s.name} for s in partner.services],
    })


@app.get("/admin/kyc-pending", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def get_pending_kyc(db: AsyncSession = Depends(get_db)):
    """Admin: List partners with pending KYC."""
    res = await db.execute(
        select(Partner)
        .options(selectinload(Partner.documents))
        .where(Partner.status == PartnerStatusEnum.KYC_SUBMITTED)
    )
    partners = res.scalars().all()
    return success_response([
        {
            "id": str(p.id),
            "name": p.name,
            "phone": p.phone,
            "status": p.status.value,
            "documents": [
                {"type": d.document_type.value, "doc_status": d.status.value}
                for d in p.documents
            ],
        }
        for p in partners
    ])


@app.patch("/admin/partners/{partner_id}/kyc", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def kyc_action(
    partner_id: str, data: KycActionSchema, request: Request, db: AsyncSession = Depends(get_db)
):
    """Admin: Approve or reject partner KYC."""
    admin_id = request.headers.get("x-user-id")
    res = await db.execute(select(Partner).where(Partner.id == uuid.UUID(partner_id)))
    partner = res.scalars().first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")

    if data.action == "approve":
        partner.status = PartnerStatusEnum.ACTIVE
        msg = "KYC Approved. Partner is now active."
        await publish_event(KafkaTopics.PARTNER_APPROVED, {
            "partner_id": partner_id, "name": partner.name
        })
    elif data.action == "reject":
        partner.status = PartnerStatusEnum.REJECTED
        msg = "KYC Rejected."
    else:
        raise HTTPException(status_code=400, detail="action must be 'approve' or 'reject'")

    await db.commit()
    await record_audit_event(
        db=db, event_type=f"ADMIN_KYC_{data.action.upper()}", service="admin-service",
        user_id=admin_id, ip_address=request.client.host if request.client else None,
        payload={"partner_id": partner_id, "reason": data.reason}
    )
    return success_response({"message": msg})


@app.patch("/admin/partners/{partner_id}/status", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def update_partner_status(
    partner_id: str, data: PartnerStatusUpdateSchema, request: Request, db: AsyncSession = Depends(get_db)
):
    """Admin: Update partner status (suspend/block/activate)."""
    admin_id = request.headers.get("x-user-id")
    res = await db.execute(select(Partner).where(Partner.id == uuid.UUID(partner_id)))
    partner = res.scalars().first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")

    old_status = partner.status
    if data.status:
        partner.status = PartnerStatusEnum(data.status.upper())
    await db.commit()

    await record_audit_event(
        db=db, event_type="ADMIN_UPDATED_PARTNER_STATUS", service="admin-service",
        user_id=admin_id, ip_address=request.client.host if request.client else None,
        payload={"partner_id": partner_id, "old": old_status.value, "new": data.status}
    )
    return success_response({"message": f"Partner status updated to {data.status}"})


@app.patch("/admin/documents/{document_id}/action", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def action_document(
    document_id: str, data: DocumentActionSchema, request: Request, db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Admin: Approve or reject a partner document."""
    # Get AdminUser record
    admin_user_res = await db.execute(
        select(AdminUser).where(AdminUser.user_id == uuid.UUID(current_user.id))
    )
    admin_user = admin_user_res.scalars().first()

    res = await db.execute(select(PartnerDocument).where(PartnerDocument.id == uuid.UUID(document_id)))
    doc = res.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if data.action == "approve":
        doc.status = DocumentStatusEnum.APPROVED
    elif data.action == "reject":
        doc.status = DocumentStatusEnum.REJECTED
        doc.rejection_reason = data.rejection_reason
    else:
        raise HTTPException(status_code=400, detail="action must be 'approve' or 'reject'")

    doc.reviewed_by = admin_user.id if admin_user else None
    doc.reviewed_at = datetime.utcnow()
    await db.commit()
    return success_response({"message": f"Document {data.action}d"})


# ─── Customer Management ──────────────────────────────────────────────────────

@app.get("/admin/customers", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def get_customers(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=5, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Admin: List all customers."""
    query = select(User).where(User.role == RoleEnum.CUSTOMER)
    query = query.order_by(User.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    res = await db.execute(query)
    customers = res.scalars().all()

    data = []
    for c in customers:
        booking_count = await db.scalar(
            select(func.count(Booking.id)).where(Booking.customer_id == c.id)
        )
        total_spent = await db.scalar(
            select(func.sum(Payment.amount))
            .join(Booking, Payment.booking_id == Booking.id)
            .where(Booking.customer_id == c.id, Payment.status == PaymentStatusEnum.CAPTURED)
        )
        data.append({
            "id": str(c.id),
            "name": c.name,
            "phone": c.phone,
            "email": c.email,
            "is_active": c.is_active,
            "total_bookings": booking_count or 0,
            "total_spent": float(total_spent or 0),
            "joined": c.created_at.isoformat() if c.created_at else None,
        })
    return success_response(data)


@app.patch("/admin/customers/{user_id}/block", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def block_customer(
    user_id: str, request: Request, db: AsyncSession = Depends(get_db)
):
    """Admin: Block/unblock a customer account."""
    admin_id = request.headers.get("x-user-id")
    res = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    action = "blocked" if not user.is_active else "unblocked"
    await db.commit()
    await record_audit_event(
        db=db, event_type=f"ADMIN_CUSTOMER_{action.upper()}", service="admin-service",
        user_id=admin_id, ip_address=request.client.host if request.client else None,
        payload={"user_id": user_id}
    )
    return success_response({"message": f"Customer {action}"})


# ─── Finance Module ───────────────────────────────────────────────────────────

@app.get("/admin/finance/payments", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def get_payments(
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=5, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Admin: List all payments."""
    query = select(Payment)
    if status:
        query = query.where(Payment.status == PaymentStatusEnum(status.upper()))
    query = query.order_by(Payment.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    res = await db.execute(query)
    payments = res.scalars().all()
    return success_response([
        {
            "id": str(p.id),
            "booking_id": str(p.booking_id),
            "amount": float(p.amount),
            "status": p.status.value,
            "method": p.method.value if p.method else None,
            "razorpay_order_id": p.razorpay_order_id,
            "paid_at": p.paid_at.isoformat() if p.paid_at else None,
        }
        for p in payments
    ])


@app.post("/admin/finance/refunds", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def initiate_refund(
    data: RefundSchema, request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Admin: Initiate a refund for a payment."""
    admin_id = request.headers.get("x-user-id")
    p_res = await db.execute(select(Payment).where(Payment.id == uuid.UUID(data.payment_id)))
    payment = p_res.scalars().first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    if payment.status != PaymentStatusEnum.CAPTURED:
        raise HTTPException(status_code=400, detail="Only CAPTURED payments can be refunded")
    if data.amount > float(payment.amount):
        raise HTTPException(status_code=400, detail="Refund amount exceeds payment amount")

    # Get AdminUser record
    admin_user_res = await db.execute(
        select(AdminUser).where(AdminUser.user_id == uuid.UUID(current_user.id))
    )
    admin_user = admin_user_res.scalars().first()

    refund = Refund(
        payment_id=payment.id,
        amount=data.amount,
        reason=data.reason,
        status=RefundStatusEnum.INITIATED,
        initiated_by_id=admin_user.id if admin_user else None,
    )
    db.add(refund)
    await db.commit()
    await db.refresh(refund)

    await publish_event(KafkaTopics.REFUND_INITIATED, {
        "refund_id": str(refund.id),
        "payment_id": data.payment_id,
        "amount": data.amount,
        "reason": data.reason,
    })
    await record_audit_event(
        db=db, event_type="ADMIN_INITIATED_REFUND", service="admin-service",
        user_id=admin_id, ip_address=request.client.host if request.client else None,
        payload={"refund_id": str(refund.id), "payment_id": data.payment_id, "amount": data.amount}
    )
    return success_response({"refund_id": str(refund.id), "status": RefundStatusEnum.INITIATED.value})


@app.get("/admin/finance/refunds", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def get_refunds(
    page: int = Query(1, ge=1), per_page: int = Query(20, ge=5, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Admin: List all refunds."""
    query = select(Refund).order_by(Refund.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    res = await db.execute(query)
    refunds = res.scalars().all()
    return success_response([
        {
            "id": str(r.id),
            "payment_id": str(r.payment_id),
            "amount": float(r.amount),
            "reason": r.reason,
            "status": r.status.value,
            "created_at": r.created_at.isoformat(),
        }
        for r in refunds
    ])


# ─── Coupon Management ────────────────────────────────────────────────────────

@app.post("/admin/coupons", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def create_coupon(data: CreateCouponSchema, db: AsyncSession = Depends(get_db)):
    """Admin: Create a discount coupon."""
    # Check unique code
    existing = await db.scalar(select(func.count(Coupon.id)).where(Coupon.code == data.code.upper()))
    if existing:
        raise HTTPException(status_code=400, detail="Coupon code already exists")

    coupon = Coupon(
        code=data.code.upper(),
        description=data.description,
        coupon_type=data.coupon_type,
        discount_value=data.discount_value,
        min_order_value=data.min_order_value,
        max_discount_cap=data.max_discount_cap,
        valid_from=data.valid_from,
        valid_until=data.valid_until,
        max_uses=data.max_uses,
        uses_per_user=data.uses_per_user,
        applicable_services=data.applicable_services,
        is_active=True,
    )
    db.add(coupon)
    await db.commit()
    await db.refresh(coupon)
    return success_response({"coupon_id": str(coupon.id), "code": coupon.code})


@app.get("/admin/coupons", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def list_coupons(
    is_active: Optional[bool] = None, db: AsyncSession = Depends(get_db)
):
    """Admin: List all coupons."""
    query = select(Coupon)
    if is_active is not None:
        query = query.where(Coupon.is_active == is_active)
    query = query.order_by(Coupon.created_at.desc())
    res = await db.execute(query)
    coupons = res.scalars().all()
    return success_response([
        {
            "id": str(c.id),
            "code": c.code,
            "coupon_type": c.coupon_type.value,
            "discount_value": float(c.discount_value),
            "min_order_value": float(c.min_order_value),
            "valid_from": c.valid_from.isoformat(),
            "valid_until": c.valid_until.isoformat(),
            "total_used": c.total_used,
            "max_uses": c.max_uses,
            "is_active": c.is_active,
        }
        for c in coupons
    ])


@app.patch("/admin/coupons/{coupon_id}", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def update_coupon(
    coupon_id: str, data: UpdateCouponSchema, db: AsyncSession = Depends(get_db)
):
    """Admin: Update coupon."""
    res = await db.execute(select(Coupon).where(Coupon.id == uuid.UUID(coupon_id)))
    coupon = res.scalars().first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    if data.is_active is not None:
        coupon.is_active = data.is_active
    if data.valid_until is not None:
        coupon.valid_until = data.valid_until
    if data.max_uses is not None:
        coupon.max_uses = data.max_uses
    await db.commit()
    return success_response({"message": "Coupon updated"})


@app.get("/admin/coupons/validate/{code}")
async def validate_coupon(code: str, service_package_id: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """Public: Validate a coupon code (used by booking service)."""
    from datetime import datetime as dt
    res = await db.execute(select(Coupon).where(Coupon.code == code.upper()))
    coupon = res.scalars().first()
    if not coupon or not coupon.is_active:
        return success_response({"valid": False, "reason": "Coupon not found or inactive"})
    now = dt.utcnow()
    if coupon.valid_from > now or coupon.valid_until < now:
        return success_response({"valid": False, "reason": "Coupon expired or not yet active"})
    if coupon.max_uses and coupon.total_used >= coupon.max_uses:
        return success_response({"valid": False, "reason": "Coupon usage limit reached"})
    if service_package_id and coupon.applicable_services and service_package_id not in coupon.applicable_services:
        return success_response({"valid": False, "reason": "Coupon not applicable for this service"})

    return success_response({
        "valid": True,
        "coupon_id": str(coupon.id),
        "coupon_type": coupon.coupon_type.value,
        "discount_value": float(coupon.discount_value),
        "min_order_value": float(coupon.min_order_value),
        "max_discount_cap": float(coupon.max_discount_cap) if coupon.max_discount_cap else None,
    })


# ─── ServicePackage Areas ────────────────────────────────────────────────────────────

@app.post("/admin/service-areas", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def create_service_area(data: CreateServiceAreaSchema, db: AsyncSession = Depends(get_db)):
    """Admin: Create a service area."""
    area = ServiceArea(
        name=data.name, city=data.city, state=data.state, pincodes=data.pincodes
    )
    db.add(area)
    await db.commit()
    await db.refresh(area)
    return success_response({"id": str(area.id), "name": area.name})


@app.get("/admin/service-areas")
async def list_service_areas(db: AsyncSession = Depends(get_db)):
    """List all service areas (public for partner onboarding)."""
    res = await db.execute(select(ServiceArea).where(ServiceArea.is_active == True))
    areas = res.scalars().all()
    return success_response([
        {
            "id": str(a.id),
            "name": a.name,
            "city": a.city,
            "state": a.state,
            "pincodes": a.pincodes,
        }
        for a in areas
    ])


@app.patch("/admin/service-areas/{area_id}", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def update_service_area(
    area_id: str, data: UpdateServiceAreaSchema, db: AsyncSession = Depends(get_db)
):
    """Admin: Update a service area."""
    res = await db.execute(select(ServiceArea).where(ServiceArea.id == uuid.UUID(area_id)))
    area = res.scalars().first()
    if not area:
        raise HTTPException(status_code=404, detail="ServicePackage area not found")
    if data.name is not None:
        area.name = data.name
    if data.pincodes is not None:
        area.pincodes = data.pincodes
    if data.is_active is not None:
        area.is_active = data.is_active
    await db.commit()
    return success_response({"message": "ServicePackage area updated"})


# ─── Admin User Management (SUPER_ADMIN only) ─────────────────────────────────

@app.post("/admin/users", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def create_admin_user(
    data: CreateAdminUserSchema,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """SUPER_ADMIN: Create a new admin user."""
    # Check current user is SUPER_ADMIN
    admin_res = await db.execute(
        select(AdminUser).where(AdminUser.user_id == uuid.UUID(current_user.id))
    )
    caller = admin_res.scalars().first()
    if not caller or caller.admin_role != AdminRoleEnum.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Only SUPER_ADMIN can create admin users")

    # Check target user exists
    u_res = await db.execute(select(User).where(User.id == uuid.UUID(data.user_id)))
    user = u_res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_admin = AdminUser(
        user_id=uuid.UUID(data.user_id),
        admin_role=data.admin_role,
        created_by=caller.id,
    )
    db.add(new_admin)
    await db.commit()
    await db.refresh(new_admin)
    return success_response({"admin_user_id": str(new_admin.id), "role": data.admin_role.value})


@app.get("/admin/users", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def list_admin_users(db: AsyncSession = Depends(get_db)):
    """Admin: List all admin users with their roles."""
    res = await db.execute(
        select(AdminUser).options(selectinload(AdminUser.user))
    )
    admins = res.scalars().all()
    return success_response([
        {
            "id": str(a.id),
            "name": a.user.name if a.user else None,
            "email": a.user.email if a.user else None,
            "admin_role": a.admin_role.value,
            "is_active": a.is_active,
            "created_at": a.created_at.isoformat(),
        }
        for a in admins
    ])


instrument_fastapi(app, "admin-service")
