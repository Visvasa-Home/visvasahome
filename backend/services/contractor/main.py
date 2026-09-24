"""
Contractor ServicePackage — Port 3014
-------------------------------
Large-job leads, quotations, contracts, milestones.

Endpoints:
  POST /contractor/leads                          — customer: create lead
  GET  /contractor/leads                          — list leads
  GET  /contractor/leads/{id}                     — lead detail
  POST /contractor/leads/{id}/quotations          — contractor: submit quote
  GET  /contractor/leads/{id}/quotations          — view quotes on a lead
  POST /contractor/quotations/{id}/accept         — customer: accept quote
  POST /contractor/quotations/{id}/reject         — customer: reject quote
  GET  /contractor/contracts                      — list contracts
  GET  /contractor/contracts/{id}                 — contract detail
  PATCH /contractor/contracts/{id}/milestones/{mid} — update milestone status
  POST /contractor/profile                        — partner: create contractor profile
  GET  /contractor/profile/me                     — partner: my contractor profile
"""

from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime, date

from shared.database import get_db
from shared.models import (
    ContractorProfile, ContractorLead, Quotation, Contract,
    ContractMilestone, User, Partner, Address,
    QuoteStatusEnum, ContractStatusEnum, MilestoneStatusEnum, RoleEnum
)
from shared.utils import success_response, logger
from shared.kafka_client import publish_event, KafkaTopics
from shared.auth import get_current_user, require_role, CurrentUser
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi

setup_tracing("contractor-service")

app = FastAPI(title="Contractor ServicePackage — VisvasaHome")
app.add_middleware(ObservabilityMiddleware, service_name="contractor-service")


# ─── Schemas ─────────────────────────────────────────────────────────────────

class CreateLeadSchema(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    estimated_budget: Optional[float] = None
    preferred_start_date: Optional[date] = None
    address_id: Optional[str] = None
    photos: List[str] = []

class SubmitQuotationSchema(BaseModel):
    quote_amount: float
    timeline_days: int
    description: Optional[str] = None
    attachments: List[str] = []

class CreateContractorProfileSchema(BaseModel):
    company_name: Optional[str] = None
    gst_number: Optional[str] = None
    specializations: List[str] = []
    team_size: int = 1
    min_project_value: Optional[float] = None

class CreateMilestoneSchema(BaseModel):
    title: str
    description: Optional[str] = None
    amount: float
    due_date: Optional[date] = None

class UpdateMilestoneSchema(BaseModel):
    status: MilestoneStatusEnum


# ─── Contractor Profile ───────────────────────────────────────────────────────

@app.post("/contractor/profile", dependencies=[Depends(require_role([RoleEnum.PARTNER]))])
async def create_contractor_profile(
    data: CreateContractorProfileSchema,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Partner: Register as a contractor for large jobs."""
    partner_id = uuid.UUID(current_user.id)

    # Verify partner exists
    p_res = await db.execute(select(Partner).where(Partner.id == partner_id))
    partner = p_res.scalars().first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner profile not found")

    # Check if already has a contractor profile
    existing = await db.execute(
        select(ContractorProfile).where(ContractorProfile.partner_id == partner_id)
    )
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Contractor profile already exists")

    profile = ContractorProfile(
        partner_id=partner_id,
        company_name=data.company_name,
        gst_number=data.gst_number,
        specializations=data.specializations,
        team_size=data.team_size,
        min_project_value=data.min_project_value,
    )
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return success_response({"id": str(profile.id), "message": "Contractor profile created"})


@app.get("/contractor/profile/me", dependencies=[Depends(require_role([RoleEnum.PARTNER]))])
async def get_my_contractor_profile(
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Partner: Get my contractor profile."""
    res = await db.execute(
        select(ContractorProfile).where(ContractorProfile.partner_id == uuid.UUID(current_user.id))
    )
    profile = res.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="No contractor profile found. Please register first.")
    return success_response({
        "id": str(profile.id),
        "company_name": profile.company_name,
        "gst_number": profile.gst_number,
        "specializations": profile.specializations,
        "team_size": profile.team_size,
        "min_project_value": float(profile.min_project_value) if profile.min_project_value else None,
        "is_verified": profile.is_verified,
    })


# ─── Leads ───────────────────────────────────────────────────────────────────

@app.post("/contractor/leads", dependencies=[Depends(require_role([RoleEnum.CUSTOMER]))])
async def create_lead(
    data: CreateLeadSchema,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Customer: Post a large-job lead."""
    lead = ContractorLead(
        customer_id=uuid.UUID(current_user.id),
        address_id=uuid.UUID(data.address_id) if data.address_id else None,
        title=data.title,
        description=data.description,
        category=data.category,
        estimated_budget=data.estimated_budget,
        preferred_start_date=data.preferred_start_date,
        photos=data.photos,
        status="OPEN",
        expires_at=datetime(
            datetime.utcnow().year,
            datetime.utcnow().month,
            datetime.utcnow().day + 30
        ),
    )
    db.add(lead)
    await db.commit()
    await db.refresh(lead)

    await publish_event(KafkaTopics.CONTRACTOR_LEAD_CREATED, {
        "lead_id": str(lead.id),
        "customer_id": str(current_user.id),
        "title": lead.title,
        "category": lead.category,
    })

    return success_response({"lead_id": str(lead.id), "status": "OPEN"})


@app.get("/contractor/leads")
async def list_leads(
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List leads — customers see their own; partners see open leads; admins see all."""
    query = select(ContractorLead).options(selectinload(ContractorLead.customer))
    role = current_user.role.value

    if role == "CUSTOMER":
        query = query.where(ContractorLead.customer_id == uuid.UUID(current_user.id))
    elif role == "PARTNER":
        query = query.where(ContractorLead.status == "OPEN")
    # ADMIN sees all

    if status:
        query = query.where(ContractorLead.status == status.upper())
    if category:
        query = query.where(ContractorLead.category == category)

    query = query.order_by(ContractorLead.created_at.desc())
    res = await db.execute(query)
    leads = res.scalars().all()

    return success_response([
        {
            "id": str(l.id),
            "title": l.title,
            "category": l.category,
            "estimated_budget": float(l.estimated_budget) if l.estimated_budget else None,
            "preferred_start_date": str(l.preferred_start_date) if l.preferred_start_date else None,
            "status": l.status,
            "customer_name": l.customer.name if l.customer else None,
            "created_at": l.created_at.isoformat(),
        }
        for l in leads
    ])


@app.get("/contractor/leads/{lead_id}")
async def get_lead(
    lead_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get lead detail with all quotations."""
    res = await db.execute(
        select(ContractorLead)
        .options(
            selectinload(ContractorLead.customer),
            selectinload(ContractorLead.quotations).selectinload(Quotation.contractor)
        )
        .where(ContractorLead.id == uuid.UUID(lead_id))
    )
    lead = res.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Customers only see their own leads; partners see open leads only
    role = current_user.role.value
    if role == "CUSTOMER" and lead.customer_id != uuid.UUID(current_user.id):
        raise HTTPException(status_code=403, detail="Not your lead")

    return success_response({
        "id": str(lead.id),
        "title": lead.title,
        "description": lead.description,
        "category": lead.category,
        "estimated_budget": float(lead.estimated_budget) if lead.estimated_budget else None,
        "preferred_start_date": str(lead.preferred_start_date) if lead.preferred_start_date else None,
        "photos": lead.photos,
        "status": lead.status,
        "quotation_count": len(lead.quotations),
        "quotations": [
            {
                "id": str(q.id),
                "contractor": q.contractor.company_name if q.contractor else None,
                "amount": float(q.quote_amount),
                "timeline_days": q.timeline_days,
                "status": q.status.value,
            }
            for q in lead.quotations
        ] if role in ["CUSTOMER", "ADMIN"] else [],
    })


# ─── Quotations ───────────────────────────────────────────────────────────────

@app.post("/contractor/leads/{lead_id}/quotations", dependencies=[Depends(require_role([RoleEnum.PARTNER]))])
async def submit_quotation(
    lead_id: str,
    data: SubmitQuotationSchema,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Partner/Contractor: Submit a quotation on an open lead."""
    # Verify contractor profile
    profile_res = await db.execute(
        select(ContractorProfile).where(ContractorProfile.partner_id == uuid.UUID(current_user.id))
    )
    profile = profile_res.scalars().first()
    if not profile:
        raise HTTPException(status_code=400, detail="You must have a contractor profile to quote. POST /contractor/profile first.")

    lead_res = await db.execute(select(ContractorLead).where(ContractorLead.id == uuid.UUID(lead_id)))
    lead = lead_res.scalars().first()
    if not lead or lead.status != "OPEN":
        raise HTTPException(status_code=400, detail="Lead is not accepting quotations")

    # Check for duplicate quote
    dup_res = await db.execute(
        select(Quotation).where(
            Quotation.lead_id == lead.id,
            Quotation.contractor_id == profile.id,
            Quotation.status == QuoteStatusEnum.PENDING
        )
    )
    if dup_res.scalars().first():
        raise HTTPException(status_code=400, detail="You already have a pending quotation on this lead")

    quote = Quotation(
        lead_id=lead.id,
        contractor_id=profile.id,
        quote_amount=data.quote_amount,
        timeline_days=data.timeline_days,
        description=data.description,
        attachments=data.attachments,
        status=QuoteStatusEnum.PENDING,
    )
    db.add(quote)
    await db.commit()
    await db.refresh(quote)

    await publish_event(KafkaTopics.QUOTATION_SUBMITTED, {
        "quotation_id": str(quote.id),
        "lead_id": lead_id,
        "contractor_id": str(current_user.id),
        "amount": float(quote.quote_amount),
    })

    return success_response({"quotation_id": str(quote.id), "message": "Quotation submitted"})


@app.post("/contractor/quotations/{quotation_id}/accept", dependencies=[Depends(require_role([RoleEnum.CUSTOMER]))])
async def accept_quotation(
    quotation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Customer: Accept a quotation — creates a contract."""
    q_res = await db.execute(
        select(Quotation)
        .options(selectinload(Quotation.lead))
        .where(Quotation.id == uuid.UUID(quotation_id))
    )
    quote = q_res.scalars().first()
    if not quote or quote.status != QuoteStatusEnum.PENDING:
        raise HTTPException(status_code=404, detail="Quotation not found or already processed")

    # Verify customer owns the lead
    if quote.lead.customer_id != uuid.UUID(current_user.id):
        raise HTTPException(status_code=403, detail="Not your lead")

    # Accept this quote, reject all others
    quote.status = QuoteStatusEnum.ACCEPTED
    quote.lead.status = "AWARDED"

    other_quotes_res = await db.execute(
        select(Quotation).where(
            Quotation.lead_id == quote.lead_id,
            Quotation.id != quote.id
        )
    )
    for other in other_quotes_res.scalars().all():
        other.status = QuoteStatusEnum.REJECTED

    # Create contract
    contract = Contract(
        quotation_id=quote.id,
        customer_id=quote.lead.customer_id,
        contractor_id=quote.contractor_id,
        total_amount=quote.quote_amount,
        status=ContractStatusEnum.ACTIVE,
        start_date=date.today(),
    )
    db.add(contract)
    await db.commit()
    await db.refresh(contract)

    await publish_event(KafkaTopics.CONTRACT_AWARDED, {
        "contract_id": str(contract.id),
        "quotation_id": quotation_id,
        "customer_id": str(current_user.id),
        "amount": float(quote.quote_amount),
    })

    return success_response({"contract_id": str(contract.id), "message": "Quotation accepted. Contract created."})


@app.post("/contractor/quotations/{quotation_id}/reject", dependencies=[Depends(require_role([RoleEnum.CUSTOMER]))])
async def reject_quotation(
    quotation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Customer: Reject a quotation."""
    q_res = await db.execute(
        select(Quotation).options(selectinload(Quotation.lead)).where(Quotation.id == uuid.UUID(quotation_id))
    )
    quote = q_res.scalars().first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found")
    if quote.lead.customer_id != uuid.UUID(current_user.id):
        raise HTTPException(status_code=403, detail="Not your lead")
    quote.status = QuoteStatusEnum.REJECTED
    await db.commit()
    return success_response({"message": "Quotation rejected"})


# ─── Contracts ────────────────────────────────────────────────────────────────

@app.get("/contractor/contracts")
async def list_contracts(
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List contracts for the current user."""
    query = select(Contract).options(
        selectinload(Contract.milestones),
        selectinload(Contract.customer),
        selectinload(Contract.contractor)
    )
    role = current_user.role.value
    if role == "CUSTOMER":
        query = query.where(Contract.customer_id == uuid.UUID(current_user.id))
    elif role == "PARTNER":
        profile_res = await db.execute(
            select(ContractorProfile).where(ContractorProfile.partner_id == uuid.UUID(current_user.id))
        )
        profile = profile_res.scalars().first()
        if profile:
            query = query.where(Contract.contractor_id == profile.id)
    query = query.order_by(Contract.created_at.desc())
    res = await db.execute(query)
    contracts = res.scalars().all()

    return success_response([
        {
            "id": str(c.id),
            "status": c.status.value,
            "total_amount": float(c.total_amount),
            "start_date": str(c.start_date) if c.start_date else None,
            "end_date": str(c.end_date) if c.end_date else None,
            "milestones_total": len(c.milestones),
            "milestones_completed": sum(1 for m in c.milestones if m.status == MilestoneStatusEnum.COMPLETED),
            "customer": c.customer.name if c.customer else None,
        }
        for c in contracts
    ])


@app.get("/contractor/contracts/{contract_id}")
async def get_contract(
    contract_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get contract detail with milestones."""
    res = await db.execute(
        select(Contract)
        .options(
            selectinload(Contract.milestones),
            selectinload(Contract.customer),
            selectinload(Contract.contractor)
        )
        .where(Contract.id == uuid.UUID(contract_id))
    )
    contract = res.scalars().first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    return success_response({
        "id": str(contract.id),
        "status": contract.status.value,
        "total_amount": float(contract.total_amount),
        "start_date": str(contract.start_date) if contract.start_date else None,
        "end_date": str(contract.end_date) if contract.end_date else None,
        "contract_doc_url": contract.contract_doc_url,
        "milestones": [
            {
                "id": str(m.id),
                "title": m.title,
                "description": m.description,
                "amount": float(m.amount),
                "status": m.status.value,
                "due_date": str(m.due_date) if m.due_date else None,
                "completed_at": m.completed_at.isoformat() if m.completed_at else None,
            }
            for m in contract.milestones
        ],
    })


@app.patch(
    "/contractor/contracts/{contract_id}/milestones/{milestone_id}",
    dependencies=[Depends(require_role([RoleEnum.PARTNER, RoleEnum.ADMIN]))]
)
async def update_milestone(
    contract_id: str,
    milestone_id: str,
    data: UpdateMilestoneSchema,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Partner/Admin: Update a milestone status."""
    res = await db.execute(
        select(ContractMilestone).where(
            ContractMilestone.id == uuid.UUID(milestone_id),
            ContractMilestone.contract_id == uuid.UUID(contract_id)
        )
    )
    milestone = res.scalars().first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    milestone.status = data.status
    if data.status == MilestoneStatusEnum.COMPLETED:
        milestone.completed_at = datetime.utcnow()

    await db.commit()

    await publish_event(KafkaTopics.MILESTONE_COMPLETED, {
        "contract_id": contract_id,
        "milestone_id": milestone_id,
        "status": data.status.value,
    })

    return success_response({"message": f"Milestone updated to {data.status.value}"})


# ─── Admin: Contractor Management ─────────────────────────────────────────────

@app.patch(
    "/contractor/profiles/{profile_id}/verify",
    dependencies=[Depends(require_role([RoleEnum.ADMIN]))]
)
async def verify_contractor(
    profile_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Admin: Verify a contractor profile."""
    res = await db.execute(select(ContractorProfile).where(ContractorProfile.id == uuid.UUID(profile_id)))
    profile = res.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile.is_verified = True
    await db.commit()
    return success_response({"message": "Contractor profile verified"})


instrument_fastapi(app, "contractor-service")
