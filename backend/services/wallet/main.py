"""
Wallet & Settlement ServicePackage — Port 3018
-----------------------------------------
Partner wallet management, payout requests, and admin-processed settlements.

Endpoints:
  GET  /wallet/balance                      — partner: current balance
  GET  /wallet/transactions                 — partner: paginated transaction history
  POST /wallet/payout-request               — partner: request payout
  GET  /wallet/payouts                      — partner: payout history

  GET  /wallet/admin/settlements            — admin: all pending settlements
  POST /wallet/admin/settlements/{id}/process — admin: process settlement (mark paid)
  POST /wallet/admin/settlements/{id}/fail  — admin: mark settlement as failed
  GET  /wallet/admin/commission             — admin: commission ledger
  GET  /wallet/admin/overview               — admin: platform wallet overview
"""

from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

from shared.database import get_db
from shared.models import (
    Partner, WalletTransaction, Settlement, Commission, Payment,
    SettlementStatusEnum, TransactionTypeEnum, PaymentStatusEnum, RoleEnum
)
from shared.utils import success_response, logger
from shared.kafka_client import publish_event, KafkaTopics
from shared.audit_log import record_audit_event
from shared.auth import get_current_user, require_role, CurrentUser
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi

setup_tracing("wallet-service")

app = FastAPI(title="Wallet & Settlement ServicePackage — VisvasaHome")
app.add_middleware(ObservabilityMiddleware, service_name="wallet-service")

MIN_PAYOUT_AMOUNT = 100.0  # Minimum ₹100 payout


# ─── Schemas ─────────────────────────────────────────────────────────────────

class PayoutRequestSchema(BaseModel):
    amount: float
    payout_method: str = "UPI"   # UPI / BANK
    notes: Optional[str] = None

class ProcessSettlementSchema(BaseModel):
    utr_number: str
    notes: Optional[str] = None

class FailSettlementSchema(BaseModel):
    reason: str


# ─── Partner Wallet ───────────────────────────────────────────────────────────

@app.get("/wallet/balance", dependencies=[Depends(require_role([RoleEnum.PARTNER]))])
async def get_balance(
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Partner: Get current wallet balance + pending settlement amount."""
    partner_id = uuid.UUID(current_user.id)

    p_res = await db.execute(select(Partner).where(Partner.id == partner_id))
    partner = p_res.scalars().first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")

    # Pending settlement amount
    pending_settlement = await db.scalar(
        select(func.sum(Settlement.amount)).where(
            Settlement.partner_id == partner_id,
            Settlement.status == SettlementStatusEnum.PENDING
        )
    )

    # Total earnings (all time)
    total_earned = await db.scalar(
        select(func.sum(WalletTransaction.amount)).where(
            WalletTransaction.partner_id == partner_id,
            WalletTransaction.transaction_type == TransactionTypeEnum.EARNING
        )
    )

    # Total payouts
    total_paid_out = await db.scalar(
        select(func.sum(WalletTransaction.amount)).where(
            WalletTransaction.partner_id == partner_id,
            WalletTransaction.transaction_type == TransactionTypeEnum.PAYOUT
        )
    )

    return success_response({
        "wallet_balance": float(partner.wallet_balance or 0),
        "pending_settlement": float(pending_settlement or 0),
        "available_for_payout": max(0.0, float(partner.wallet_balance or 0) - float(pending_settlement or 0)),
        "total_earned_all_time": float(total_earned or 0),
        "total_paid_out": abs(float(total_paid_out or 0)),
    })


@app.get("/wallet/transactions", dependencies=[Depends(require_role([RoleEnum.PARTNER]))])
async def get_transactions(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=5, le=100),
    transaction_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Partner: Paginated wallet transaction history."""
    partner_id = uuid.UUID(current_user.id)

    query = select(WalletTransaction).where(WalletTransaction.partner_id == partner_id)
    if transaction_type:
        query = query.where(WalletTransaction.transaction_type == TransactionTypeEnum(transaction_type.upper()))
    query = query.order_by(WalletTransaction.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    res = await db.execute(query)
    txns = res.scalars().all()

    # Total count for pagination
    total_count = await db.scalar(
        select(func.count(WalletTransaction.id)).where(WalletTransaction.partner_id == partner_id)
    )

    return success_response({
        "page": page,
        "per_page": per_page,
        "total": total_count or 0,
        "transactions": [
            {
                "id": str(t.id),
                "amount": float(t.amount),
                "balance_after": float(t.balance_after) if t.balance_after else None,
                "type": t.transaction_type.value,
                "description": t.description,
                "booking_id": str(t.booking_id) if t.booking_id else None,
                "created_at": t.created_at.isoformat(),
            }
            for t in txns
        ],
    })


@app.post("/wallet/payout-request", dependencies=[Depends(require_role([RoleEnum.PARTNER]))])
async def request_payout(
    data: PayoutRequestSchema,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Partner: Request a payout from their wallet."""
    partner_id = uuid.UUID(current_user.id)

    if data.amount < MIN_PAYOUT_AMOUNT:
        raise HTTPException(status_code=400, detail=f"Minimum payout amount is ₹{MIN_PAYOUT_AMOUNT}")

    p_res = await db.execute(select(Partner).where(Partner.id == partner_id))
    partner = p_res.scalars().first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")

    # Check if pending settlement already exists
    pending_res = await db.execute(
        select(Settlement).where(
            Settlement.partner_id == partner_id,
            Settlement.status == SettlementStatusEnum.PENDING
        )
    )
    if pending_res.scalars().first():
        raise HTTPException(status_code=400, detail="You already have a pending payout request")

    available = float(partner.wallet_balance or 0)
    if data.amount > available:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient balance. Available: ₹{available:.2f}"
        )

    # Create settlement record
    settlement = Settlement(
        partner_id=partner_id,
        amount=data.amount,
        status=SettlementStatusEnum.PENDING,
        payout_method=data.payout_method.upper(),
        notes=data.notes,
    )
    db.add(settlement)

    # Debit wallet (reserve amount)
    partner.wallet_balance = float(partner.wallet_balance or 0) - data.amount

    # Log wallet transaction
    txn = WalletTransaction(
        partner_id=partner_id,
        amount=-data.amount,
        balance_after=partner.wallet_balance,
        transaction_type=TransactionTypeEnum.PAYOUT,
        description=f"Payout request via {data.payout_method.upper()}",
    )
    db.add(txn)
    await db.commit()
    await db.refresh(settlement)

    return success_response({
        "settlement_id": str(settlement.id),
        "amount": data.amount,
        "status": SettlementStatusEnum.PENDING.value,
        "message": "Payout request submitted. Processing within 1-2 business days.",
    })


@app.get("/wallet/payouts", dependencies=[Depends(require_role([RoleEnum.PARTNER]))])
async def get_payouts(
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Partner: Payout history."""
    res = await db.execute(
        select(Settlement)
        .where(Settlement.partner_id == uuid.UUID(current_user.id))
        .order_by(Settlement.requested_at.desc())
    )
    settlements = res.scalars().all()
    return success_response([
        {
            "id": str(s.id),
            "amount": float(s.amount),
            "status": s.status.value,
            "payout_method": s.payout_method,
            "utr_number": s.utr_number,
            "requested_at": s.requested_at.isoformat(),
            "processed_at": s.processed_at.isoformat() if s.processed_at else None,
        }
        for s in settlements
    ])


# ─── Admin: Settlements ───────────────────────────────────────────────────────

@app.get("/wallet/admin/settlements", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def admin_list_settlements(
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=5, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Admin: List all settlements with optional status filter."""
    query = select(Settlement).options(selectinload(Settlement.partner))
    if status:
        query = query.where(Settlement.status == SettlementStatusEnum(status.upper()))
    query = query.order_by(Settlement.requested_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    res = await db.execute(query)
    settlements = res.scalars().all()

    total_pending = await db.scalar(
        select(func.sum(Settlement.amount)).where(Settlement.status == SettlementStatusEnum.PENDING)
    )

    return success_response({
        "total_pending_amount": float(total_pending or 0),
        "settlements": [
            {
                "id": str(s.id),
                "partner": s.partner.name if s.partner else None,
                "partner_id": str(s.partner_id),
                "amount": float(s.amount),
                "status": s.status.value,
                "payout_method": s.payout_method,
                "requested_at": s.requested_at.isoformat(),
            }
            for s in settlements
        ],
    })


@app.post(
    "/wallet/admin/settlements/{settlement_id}/process",
    dependencies=[Depends(require_role([RoleEnum.ADMIN]))]
)
async def process_settlement(
    settlement_id: str,
    data: ProcessSettlementSchema,
    request=None,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Admin: Mark a settlement as processed (paid out)."""
    res = await db.execute(select(Settlement).where(Settlement.id == uuid.UUID(settlement_id)))
    settlement = res.scalars().first()
    if not settlement:
        raise HTTPException(status_code=404, detail="Settlement not found")
    if settlement.status != SettlementStatusEnum.PENDING:
        raise HTTPException(status_code=400, detail=f"Settlement is already {settlement.status.value}")

    settlement.status = SettlementStatusEnum.COMPLETED
    settlement.utr_number = data.utr_number
    settlement.notes = data.notes
    settlement.processed_at = datetime.utcnow()
    settlement.initiated_by = uuid.UUID(current_user.id)
    await db.commit()

    await publish_event(KafkaTopics.SETTLEMENT_PROCESSED, {
        "settlement_id": settlement_id,
        "partner_id": str(settlement.partner_id),
        "amount": float(settlement.amount),
        "utr_number": data.utr_number,
    })

    # Audit log
    await record_audit_event(
        db=db,
        event_type="SETTLEMENT_PROCESSED",
        service="wallet-service",
        user_id=str(current_user.id),
        payload={
            "settlement_id": settlement_id,
            "partner_id": str(settlement.partner_id),
            "amount": float(settlement.amount),
            "utr": data.utr_number,
        }
    )

    return success_response({"message": "Settlement marked as completed", "utr": data.utr_number})


@app.post(
    "/wallet/admin/settlements/{settlement_id}/fail",
    dependencies=[Depends(require_role([RoleEnum.ADMIN]))]
)
async def fail_settlement(
    settlement_id: str,
    data: FailSettlementSchema,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Admin: Mark a settlement as failed and refund wallet."""
    res = await db.execute(
        select(Settlement).options(selectinload(Settlement.partner)).where(
            Settlement.id == uuid.UUID(settlement_id)
        )
    )
    settlement = res.scalars().first()
    if not settlement:
        raise HTTPException(status_code=404, detail="Settlement not found")
    if settlement.status != SettlementStatusEnum.PENDING:
        raise HTTPException(status_code=400, detail="Settlement not in PENDING state")

    settlement.status = SettlementStatusEnum.FAILED
    settlement.notes = data.reason

    # Refund back to wallet
    partner = settlement.partner
    if partner:
        partner.wallet_balance = float(partner.wallet_balance or 0) + float(settlement.amount)
        refund_txn = WalletTransaction(
            partner_id=partner.id,
            settlement_id=settlement.id,
            amount=float(settlement.amount),
            balance_after=partner.wallet_balance,
            transaction_type=TransactionTypeEnum.REFUND,
            description=f"Settlement failed — refunded: {data.reason}",
        )
        db.add(refund_txn)

    await db.commit()
    return success_response({"message": "Settlement marked as failed. Amount refunded to wallet."})


# ─── Admin: Commission Ledger ─────────────────────────────────────────────────

@app.get("/wallet/admin/commission", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def commission_ledger(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=5, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Admin: View platform commission records."""
    query = select(Commission).options(
        selectinload(Commission.partner),
        selectinload(Commission.booking),
    ).order_by(Commission.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    res = await db.execute(query)
    commissions = res.scalars().all()

    total_commission = await db.scalar(
        select(func.sum(Commission.commission_amount))
    )

    return success_response({
        "total_platform_commission": float(total_commission or 0),
        "data": [
            {
                "id": str(c.id),
                "booking_id": str(c.booking_id),
                "partner": c.partner.name if c.partner else None,
                "gross_amount": float(c.gross_amount),
                "commission_pct": c.commission_pct,
                "commission_amount": float(c.commission_amount),
                "partner_earning": float(c.partner_earning),
                "created_at": c.created_at.isoformat(),
            }
            for c in commissions
        ],
    })


@app.get("/wallet/admin/overview", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def platform_wallet_overview(db: AsyncSession = Depends(get_db)):
    """Admin: Platform-wide wallet and financial overview."""
    total_partner_balances = await db.scalar(
        select(func.sum(Partner.wallet_balance))
    )
    total_pending_settlements = await db.scalar(
        select(func.sum(Settlement.amount)).where(Settlement.status == SettlementStatusEnum.PENDING)
    )
    total_commission = await db.scalar(
        select(func.sum(Commission.commission_amount))
    )
    total_revenue = await db.scalar(
        select(func.sum(Payment.amount)).where(Payment.status == PaymentStatusEnum.CAPTURED)
    )

    return success_response({
        "total_partner_balances": float(total_partner_balances or 0),
        "pending_settlement_amount": float(total_pending_settlements or 0),
        "total_platform_commission": float(total_commission or 0),
        "total_gross_revenue": float(total_revenue or 0),
        "platform_net": float((total_commission or 0)),
    })


instrument_fastapi(app, "wallet-service")
