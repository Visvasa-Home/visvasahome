"""
Complaints ServicePackage — Port 3016
--------------------------------
Customer/Partner complaints with full lifecycle: OPEN → UNDER_REVIEW → RESOLVED/ESCALATED → CLOSED

Endpoints:
  POST /complaints                      — file a complaint
  GET  /complaints/me                   — my complaints
  GET  /complaints                      — admin: all complaints (with filters)
  GET  /complaints/{id}                 — complaint detail
  PATCH /complaints/{id}/assign         — admin: assign to support agent
  PATCH /complaints/{id}/review         — admin: mark under review
  PATCH /complaints/{id}/resolve        — admin: resolve complaint
  PATCH /complaints/{id}/escalate       — admin: escalate complaint
  PATCH /complaints/{id}/close          — admin: close complaint
"""

from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime

from shared.database import get_db
from shared.models import (
    Complaint, Booking, Partner, AdminUser, User,
    ComplaintStatusEnum, ComplaintTypeEnum, RoleEnum,
    Notification, NotificationTypeEnum, NotificationStatusEnum
)
from shared.utils import success_response, logger
from shared.kafka_client import publish_event, KafkaTopics
from shared.auth import get_current_user, require_role, CurrentUser
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi

setup_tracing("complaints-service")

app = FastAPI(title="Complaints ServicePackage — VisvasaHome")
app.add_middleware(ObservabilityMiddleware, service_name="complaints-service")


# ─── Schemas ─────────────────────────────────────────────────────────────────

class FileComplaintSchema(BaseModel):
    booking_id: Optional[str] = None
    against_partner_id: Optional[str] = None
    against_customer_id: Optional[str] = None
    complaint_type: ComplaintTypeEnum
    subject: str
    description: str
    attachments: List[str] = []

class ResolveComplaintSchema(BaseModel):
    resolution_note: str

class AssignComplaintSchema(BaseModel):
    admin_user_id: str


# ─── File Complaint ───────────────────────────────────────────────────────────

@app.post("/complaints")
async def file_complaint(
    data: FileComplaintSchema,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Customer or Partner: File a complaint."""
    role = current_user.role.value

    # If linked to a booking, verify the filer is part of it
    booking = None
    if data.booking_id:
        b_res = await db.execute(select(Booking).where(Booking.id == uuid.UUID(data.booking_id)))
        booking = b_res.scalars().first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")

        user_id = uuid.UUID(current_user.id)
        if role == "CUSTOMER" and booking.customer_id != user_id:
            raise HTTPException(status_code=403, detail="Not your booking")
        if role == "PARTNER" and booking.partner_id != user_id:
            raise HTTPException(status_code=403, detail="Not your booking")

        # Check for duplicate complaint on same booking
        dup_res = await db.execute(
            select(Complaint).where(Complaint.booking_id == booking.id)
        )
        if dup_res.scalars().first():
            raise HTTPException(status_code=400, detail="A complaint already exists for this booking")

    complaint = Complaint(
        booking_id=uuid.UUID(data.booking_id) if data.booking_id else None,
        filed_by_id=uuid.UUID(current_user.id),
        filed_by_role=role,
        against_partner_id=uuid.UUID(data.against_partner_id) if data.against_partner_id else None,
        against_customer_id=uuid.UUID(data.against_customer_id) if data.against_customer_id else None,
        complaint_type=data.complaint_type,
        subject=data.subject,
        description=data.description,
        attachments=data.attachments,
        status=ComplaintStatusEnum.OPEN,
    )
    db.add(complaint)
    await db.commit()
    await db.refresh(complaint)

    # Notify customer
    notif = Notification(
        user_id=uuid.UUID(current_user.id),
        title="Complaint Registered",
        body=f"Your complaint '{data.subject}' has been registered. We will review it shortly.",
        notif_type=NotificationTypeEnum.IN_APP,
        status=NotificationStatusEnum.PENDING,
        data={"complaint_id": str(complaint.id)},
    )
    db.add(notif)
    await db.commit()

    await publish_event(KafkaTopics.COMPLAINT_FILED, {
        "complaint_id": str(complaint.id),
        "filed_by": str(current_user.id),
        "role": role,
        "type": data.complaint_type.value,
        "booking_id": data.booking_id,
    })

    return success_response({
        "complaint_id": str(complaint.id),
        "status": ComplaintStatusEnum.OPEN.value,
        "message": "Complaint filed successfully. Our team will review it within 24 hours.",
    })


# ─── My Complaints ────────────────────────────────────────────────────────────

@app.get("/complaints/me")
async def my_complaints(
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get complaints filed by the current user."""
    res = await db.execute(
        select(Complaint)
        .where(Complaint.filed_by_id == uuid.UUID(current_user.id))
        .order_by(Complaint.created_at.desc())
    )
    complaints = res.scalars().all()
    return success_response([_serialize_complaint(c) for c in complaints])


# ─── Admin: All Complaints ────────────────────────────────────────────────────

@app.get("/complaints", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def list_complaints(
    status: Optional[str] = None,
    complaint_type: Optional[str] = None,
    page: int = 1,
    per_page: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """Admin: List all complaints with optional filters."""
    query = select(Complaint).options(
        selectinload(Complaint.filed_by),
        selectinload(Complaint.against_partner),
    )
    if status:
        query = query.where(Complaint.status == ComplaintStatusEnum(status.upper()))
    if complaint_type:
        query = query.where(Complaint.complaint_type == ComplaintTypeEnum(complaint_type.upper()))

    query = query.order_by(Complaint.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    res = await db.execute(query)
    complaints = res.scalars().all()
    return success_response([_serialize_complaint_admin(c) for c in complaints])


@app.get("/complaints/{complaint_id}")
async def get_complaint(
    complaint_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get complaint detail."""
    res = await db.execute(
        select(Complaint)
        .options(
            selectinload(Complaint.filed_by),
            selectinload(Complaint.against_partner),
            selectinload(Complaint.booking),
        )
        .where(Complaint.id == uuid.UUID(complaint_id))
    )
    complaint = res.scalars().first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    role = current_user.role.value
    if role != "ADMIN" and complaint.filed_by_id != uuid.UUID(current_user.id):
        raise HTTPException(status_code=403, detail="Not your complaint")

    return success_response(_serialize_complaint_admin(complaint))


# ─── Admin Workflow Actions ───────────────────────────────────────────────────

@app.patch("/complaints/{complaint_id}/assign", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def assign_complaint(
    complaint_id: str,
    data: AssignComplaintSchema,
    db: AsyncSession = Depends(get_db)
):
    """Admin: Assign complaint to a support agent."""
    complaint = await _get_complaint_or_404(complaint_id, db)
    complaint.assigned_to = uuid.UUID(data.admin_user_id)
    complaint.status = ComplaintStatusEnum.UNDER_REVIEW
    await db.commit()
    return success_response({"message": "Complaint assigned and set to UNDER_REVIEW"})


@app.patch("/complaints/{complaint_id}/review", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def mark_under_review(complaint_id: str, db: AsyncSession = Depends(get_db)):
    """Admin: Mark complaint as under review."""
    complaint = await _get_complaint_or_404(complaint_id, db)
    complaint.status = ComplaintStatusEnum.UNDER_REVIEW
    await db.commit()
    return success_response({"message": "Complaint is now UNDER_REVIEW"})


@app.patch("/complaints/{complaint_id}/resolve", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def resolve_complaint(
    complaint_id: str,
    data: ResolveComplaintSchema,
    db: AsyncSession = Depends(get_db)
):
    """Admin: Resolve a complaint with a resolution note."""
    complaint = await _get_complaint_or_404(complaint_id, db)
    complaint.status = ComplaintStatusEnum.RESOLVED
    complaint.resolution_note = data.resolution_note
    complaint.resolved_at = datetime.utcnow()
    await db.commit()

    # Notify the filer
    notif = Notification(
        user_id=complaint.filed_by_id,
        title="Complaint Resolved",
        body=f"Your complaint has been resolved. Note: {data.resolution_note[:100]}",
        notif_type=NotificationTypeEnum.IN_APP,
        status=NotificationStatusEnum.PENDING,
        data={"complaint_id": str(complaint.id)},
    )
    db.add(notif)
    await db.commit()

    await publish_event(KafkaTopics.COMPLAINT_RESOLVED, {
        "complaint_id": complaint_id,
        "resolved_by": "admin",
        "resolution_note": data.resolution_note,
    })

    return success_response({"message": "Complaint resolved"})


@app.patch("/complaints/{complaint_id}/escalate", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def escalate_complaint(
    complaint_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Admin: Escalate a complaint to senior team."""
    complaint = await _get_complaint_or_404(complaint_id, db)
    complaint.status = ComplaintStatusEnum.ESCALATED
    await db.commit()

    # Notify filer of escalation
    notif = Notification(
        user_id=complaint.filed_by_id,
        title="Complaint Escalated",
        body="Your complaint has been escalated to our senior team. We will resolve it on priority.",
        notif_type=NotificationTypeEnum.IN_APP,
        status=NotificationStatusEnum.PENDING,
        data={"complaint_id": str(complaint.id)},
    )
    db.add(notif)
    await db.commit()

    return success_response({"message": "Complaint escalated"})


@app.patch("/complaints/{complaint_id}/close", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def close_complaint(complaint_id: str, db: AsyncSession = Depends(get_db)):
    """Admin: Close a complaint (final state)."""
    complaint = await _get_complaint_or_404(complaint_id, db)
    complaint.status = ComplaintStatusEnum.CLOSED
    await db.commit()
    return success_response({"message": "Complaint closed"})


# ─── Helpers ─────────────────────────────────────────────────────────────────

async def _get_complaint_or_404(complaint_id: str, db: AsyncSession) -> Complaint:
    res = await db.execute(select(Complaint).where(Complaint.id == uuid.UUID(complaint_id)))
    complaint = res.scalars().first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint


def _serialize_complaint(c: Complaint) -> dict:
    return {
        "id": str(c.id),
        "complaint_type": c.complaint_type.value,
        "subject": c.subject,
        "status": c.status.value,
        "created_at": c.created_at.isoformat(),
        "resolved_at": c.resolved_at.isoformat() if c.resolved_at else None,
        "resolution_note": c.resolution_note,
    }


def _serialize_complaint_admin(c: Complaint) -> dict:
    return {
        **_serialize_complaint(c),
        "description": c.description,
        "filed_by_role": c.filed_by_role,
        "filed_by": c.filed_by.name if c.filed_by else None,
        "against_partner": c.against_partner.name if c.against_partner else None,
        "booking_id": str(c.booking_id) if c.booking_id else None,
        "attachments": c.attachments,
    }


instrument_fastapi(app, "complaints-service")
