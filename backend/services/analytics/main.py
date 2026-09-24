"""
Analytics ServicePackage — Port 3017
-------------------------------
Revenue, booking trends, partner KPIs, customer retention, service-wise breakdown.
All queries run against PostgreSQL (read-heavy). Add read-replica in production.

Endpoints:
  GET /analytics/dashboard           — overall KPI dashboard (admin)
  GET /analytics/revenue             — revenue over time (daily/weekly/monthly)
  GET /analytics/bookings            — booking trends and status breakdown
  GET /analytics/partners            — partner performance KPIs
  GET /analytics/customers           — customer retention + LTV
  GET /analytics/services            — per-service revenue breakdown
  GET /analytics/live                — real-time live ops snapshot
"""

from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, cast, Date, text, and_
from typing import Optional
from datetime import datetime, timedelta, date
import uuid

from shared.database import get_db
from shared.models import (
    Booking, Payment, Partner, User, Rating, Complaint, WalletTransaction,
    BookingStatusEnum, PaymentStatusEnum, RoleEnum,
    PartnerStatusEnum, PartnerWorkStatusEnum, TransactionTypeEnum
)
from shared.utils import success_response, logger
from shared.auth import require_role, CurrentUser, get_current_user
from shared.redis_client import redis_client
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi

setup_tracing("analytics-service")

from contextlib import asynccontextmanager
import asyncio
from services.analytics.consumer import start_analytics_consumer

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start consumer in background
    consumer_task = asyncio.create_task(start_analytics_consumer())
    yield
    # Stop consumer
    consumer_task.cancel()

app = FastAPI(title="Analytics ServicePackage — VisvasaHome", lifespan=lifespan)
app.add_middleware(ObservabilityMiddleware, service_name="analytics-service")

# ─── Dashboard KPIs ───────────────────────────────────────────────────────────

@app.get("/analytics/dashboard", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    """
    Admin Dashboard — core KPIs for today and all-time.
    """
    today = date.today()
    today_start = datetime.combine(today, datetime.min.time())

    # All-time metrics
    total_users     = await db.scalar(select(func.count(User.id)).where(User.role == RoleEnum.CUSTOMER))
    total_partners  = await db.scalar(select(func.count(Partner.id)))
    active_partners = await db.scalar(select(func.count(Partner.id)).where(Partner.status == PartnerStatusEnum.ACTIVE))
    total_bookings  = await db.scalar(select(func.count(Booking.id)))
    total_revenue   = await db.scalar(
        select(func.sum(Payment.amount)).where(Payment.status == PaymentStatusEnum.CAPTURED)
    )

    # Today's metrics
    today_bookings  = await db.scalar(
        select(func.count(Booking.id)).where(Booking.created_at >= today_start)
    )
    today_revenue   = await db.scalar(
        select(func.sum(Payment.amount)).where(
            Payment.status == PaymentStatusEnum.CAPTURED,
            Payment.paid_at >= today_start
        )
    )
    today_complaints = await db.scalar(
        select(func.count(Complaint.id)).where(Complaint.created_at >= today_start)
    )

    # Active bookings
    active_bookings = await db.scalar(
        select(func.count(Booking.id)).where(
            Booking.status.in_([
                BookingStatusEnum.PARTNER_ASSIGNED,
                BookingStatusEnum.PARTNER_ON_WAY,
                BookingStatusEnum.ARRIVED,
                BookingStatusEnum.JOB_STARTED,
            ])
        )
    )

    # Online partners (from Redis)
    online_partners = 0
    try:
        online_partners = await redis_client.zcard("partners_geo")
    except Exception:
        pass

    # Partner status breakdown
    pending_kyc = await db.scalar(
        select(func.count(Partner.id)).where(Partner.status == PartnerStatusEnum.KYC_SUBMITTED)
    )

    # Open complaints
    open_complaints = await db.scalar(
        select(func.count(Complaint.id)).where(
            Complaint.status.in_(["OPEN", "UNDER_REVIEW", "ESCALATED"])
        )
    )

    # Average rating (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    avg_rating = await db.scalar(
        select(func.avg(Rating.rating)).where(Rating.created_at >= thirty_days_ago)
    )

    # Cancellation rate (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    week_total = await db.scalar(
        select(func.count(Booking.id)).where(Booking.created_at >= week_ago)
    ) or 1
    week_cancelled = await db.scalar(
        select(func.count(Booking.id)).where(
            Booking.created_at >= week_ago,
            Booking.status.in_([
                BookingStatusEnum.CANCELLED_BY_CUSTOMER,
                BookingStatusEnum.CANCELLED_BY_PARTNER,
                BookingStatusEnum.CANCELLED_BY_ADMIN,
                BookingStatusEnum.CANCELLED,
            ])
        )
    )
    cancellation_rate = round((week_cancelled or 0) / week_total * 100, 2)

    return success_response({
        "all_time": {
            "total_customers": total_users or 0,
            "total_partners": total_partners or 0,
            "active_partners": active_partners or 0,
            "total_bookings": total_bookings or 0,
            "total_revenue": float(total_revenue or 0),
        },
        "today": {
            "bookings": today_bookings or 0,
            "revenue": float(today_revenue or 0),
            "complaints": today_complaints or 0,
        },
        "live": {
            "active_bookings": active_bookings or 0,
            "online_partners": online_partners,
            "open_complaints": open_complaints or 0,
        },
        "quality": {
            "avg_rating_30d": round(float(avg_rating or 0), 2),
            "cancellation_rate_7d_pct": cancellation_rate,
            "pending_kyc": pending_kyc or 0,
        },
    })


# ─── Revenue Analytics ────────────────────────────────────────────────────────

@app.get("/analytics/revenue", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def revenue_analytics(
    granularity: str = Query("daily", enum=["daily", "weekly", "monthly"]),
    days: int = Query(30, ge=7, le=365),
    db: AsyncSession = Depends(get_db)
):
    """
    Revenue over time.
    granularity: daily / weekly / monthly
    days: look-back window
    """
    start_date = datetime.utcnow() - timedelta(days=days)

    if granularity == "daily":
        trunc = "day"
    elif granularity == "weekly":
        trunc = "week"
    else:
        trunc = "month"

    # Raw SQL using date_trunc (PostgreSQL)
    query = text("""
        SELECT
            date_trunc(:trunc, paid_at) AS period,
            COUNT(*) AS transactions,
            SUM(amount) AS revenue,
            AVG(amount) AS avg_transaction
        FROM payments
        WHERE status = 'CAPTURED'
          AND paid_at >= :start_date
        GROUP BY period
        ORDER BY period ASC
    """)
    result = await db.execute(query, {"trunc": trunc, "start_date": start_date})
    rows = result.fetchall()

    data = [
        {
            "period": row.period.isoformat() if row.period else None,
            "transactions": int(row.transactions),
            "revenue": float(row.revenue),
            "avg_transaction": round(float(row.avg_transaction), 2),
        }
        for row in rows
    ]

    total = sum(r["revenue"] for r in data)

    return success_response({
        "granularity": granularity,
        "look_back_days": days,
        "total_revenue": round(total, 2),
        "data": data,
    })


# ─── Booking Analytics ────────────────────────────────────────────────────────

@app.get("/analytics/bookings", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def bookings_analytics(
    days: int = Query(30, ge=1, le=365),
    db: AsyncSession = Depends(get_db)
):
    """
    Booking trends + status breakdown.
    """
    start_date = datetime.utcnow() - timedelta(days=days)

    # Status breakdown
    status_res = await db.execute(
        select(Booking.status, func.count(Booking.id).label("count"))
        .where(Booking.created_at >= start_date)
        .group_by(Booking.status)
    )
    status_breakdown = {row.status.value: row.count for row in status_res.fetchall()}

    # Daily booking trend
    query = text("""
        SELECT
            date_trunc('day', created_at) AS day,
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE is_instant = true) AS instant,
            COUNT(*) FILTER (WHERE is_instant = false) AS scheduled
        FROM bookings
        WHERE created_at >= :start_date
        GROUP BY day
        ORDER BY day ASC
    """)
    result = await db.execute(query, {"start_date": start_date})
    rows = result.fetchall()

    daily_trend = [
        {
            "date": row.day.date().isoformat() if row.day else None,
            "total": int(row.total),
            "instant": int(row.instant),
            "scheduled": int(row.scheduled),
        }
        for row in rows
    ]

    # Completion rate
    total = sum(status_breakdown.values()) or 1
    completed = status_breakdown.get("COMPLETED", 0) + status_breakdown.get("PAYMENT_COMPLETED", 0) + status_breakdown.get("REVIEWED", 0)
    completion_rate = round(completed / total * 100, 2)

    return success_response({
        "look_back_days": days,
        "total_bookings": total,
        "completion_rate_pct": completion_rate,
        "status_breakdown": status_breakdown,
        "daily_trend": daily_trend,
    })


# ─── Partner Analytics ────────────────────────────────────────────────────────

@app.get("/analytics/partners", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def partner_analytics(
    limit: int = Query(20, ge=5, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Partner performance KPIs — top earners, ratings, completion rate.
    """
    # Top earners
    top_earners_res = await db.execute(
        select(
            WalletTransaction.partner_id,
            func.sum(WalletTransaction.amount).label("total_earned"),
            func.count(WalletTransaction.id).label("job_count")
        )
        .where(WalletTransaction.transaction_type == TransactionTypeEnum.EARNING)
        .group_by(WalletTransaction.partner_id)
        .order_by(func.sum(WalletTransaction.amount).desc())
        .limit(limit)
    )
    top_earners = top_earners_res.fetchall()

    # Enrich with partner names
    partner_ids = [str(r.partner_id) for r in top_earners]
    top_earner_list = []
    for row in top_earners:
        p_res = await db.execute(select(Partner).where(Partner.id == row.partner_id))
        p = p_res.scalars().first()
        top_earner_list.append({
            "partner_id": str(row.partner_id),
            "name": p.name if p else "Unknown",
            "total_earned": float(row.total_earned),
            "jobs_completed": int(row.job_count),
            "rating": p.rating if p else 0,
        })

    # Status breakdown
    status_res = await db.execute(
        select(Partner.status, func.count(Partner.id).label("count"))
        .group_by(Partner.status)
    )
    status_breakdown = {row.status.value: row.count for row in status_res.fetchall()}

    # Average rating
    avg_rating = await db.scalar(select(func.avg(Partner.rating)).where(Partner.rating > 0))

    return success_response({
        "status_breakdown": status_breakdown,
        "avg_platform_rating": round(float(avg_rating or 0), 2),
        "top_earners": top_earner_list,
    })


# ─── Customer Analytics ───────────────────────────────────────────────────────

@app.get("/analytics/customers", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def customer_analytics(
    days: int = Query(30, ge=1, le=365),
    db: AsyncSession = Depends(get_db)
):
    """
    Customer retention + acquisition + LTV.
    """
    start_date = datetime.utcnow() - timedelta(days=days)
    total_customers = await db.scalar(
        select(func.count(User.id)).where(User.role == RoleEnum.CUSTOMER)
    )
    new_customers = await db.scalar(
        select(func.count(User.id)).where(
            User.role == RoleEnum.CUSTOMER,
            User.created_at >= start_date
        )
    )

    # Repeat customers — customers with > 1 booking
    repeat_res = await db.execute(
        select(func.count(func.distinct(Booking.customer_id))).where(
            Booking.customer_id.in_(
                select(Booking.customer_id)
                .group_by(Booking.customer_id)
                .having(func.count(Booking.id) > 1)
            )
        )
    )
    repeat_customers = repeat_res.scalar() or 0

    # Avg bookings per customer
    avg_bookings = await db.scalar(
        select(func.avg(
            select(func.count(Booking.id))
            .where(Booking.customer_id == User.id)
            .correlate(User)
            .scalar_subquery()
        )).where(User.role == RoleEnum.CUSTOMER)
    )

    # Average LTV (avg total spend per customer)
    ltv_res = await db.execute(text("""
        SELECT AVG(customer_spend) as avg_ltv
        FROM (
            SELECT b.customer_id, SUM(p.amount) as customer_spend
            FROM bookings b
            JOIN payments p ON p.booking_id = b.id
            WHERE p.status = 'CAPTURED'
            GROUP BY b.customer_id
        ) customer_totals
    """))
    ltv_row = ltv_res.fetchone()
    avg_ltv = float(ltv_row.avg_ltv) if ltv_row and ltv_row.avg_ltv else 0

    # Retention rate
    retention_rate = round((repeat_customers or 0) / max(total_customers or 1, 1) * 100, 2)

    return success_response({
        "look_back_days": days,
        "total_customers": total_customers or 0,
        "new_customers": new_customers or 0,
        "repeat_customers": repeat_customers,
        "retention_rate_pct": retention_rate,
        "avg_bookings_per_customer": round(float(avg_bookings or 0), 2),
        "avg_customer_ltv": round(avg_ltv, 2),
    })


# ─── ServicePackage Analytics ────────────────────────────────────────────────────────

@app.get("/analytics/services", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def service_analytics(
    days: int = Query(30, ge=1, le=365),
    db: AsyncSession = Depends(get_db)
):
    """
    Per-service booking count and revenue breakdown.
    """
    from shared.models import ServicePackage
    start_date = datetime.utcnow() - timedelta(days=days)

    query = text("""
        SELECT
            s.name as service_name,
            s.id as service_package_id,
            COUNT(b.id) as booking_count,
            SUM(p.amount) as revenue,
            AVG(r.rating) as avg_rating
        FROM services s
        LEFT JOIN bookings b ON b.service_package_id = s.id AND b.created_at >= :start_date
        LEFT JOIN payments p ON p.booking_id = b.id AND p.status = 'CAPTURED'
        LEFT JOIN reviews r ON r.service_package_id = s.id AND r.created_at >= :start_date
        GROUP BY s.id, s.name
        ORDER BY revenue DESC NULLS LAST
    """)
    result = await db.execute(query, {"start_date": start_date})
    rows = result.fetchall()

    return success_response([
        {
            "service_package_id": str(row.service_package_id),
            "service_name": row.service_name,
            "booking_count": int(row.booking_count or 0),
            "revenue": float(row.revenue or 0),
            "avg_rating": round(float(row.avg_rating or 0), 2),
        }
        for row in rows
    ])


# ─── Live Ops Snapshot ────────────────────────────────────────────────────────

@app.get("/analytics/live", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
async def live_snapshot(db: AsyncSession = Depends(get_db)):
    """
    Real-time live operations snapshot.
    Combines Redis (partner locations) + DB (active bookings).
    """
    active_statuses = [
        BookingStatusEnum.SEARCHING_PARTNER,
        BookingStatusEnum.PARTNER_ASSIGNED,
        BookingStatusEnum.PARTNER_ON_WAY,
        BookingStatusEnum.ARRIVED,
        BookingStatusEnum.JOB_STARTED,
    ]

    active_bookings = await db.scalar(
        select(func.count(Booking.id)).where(Booking.status.in_(active_statuses))
    )
    searching = await db.scalar(
        select(func.count(Booking.id)).where(Booking.status == BookingStatusEnum.SEARCHING_PARTNER)
    )

    online_partners = 0
    try:
        online_partners = await redis_client.zcard("partners_geo")
    except Exception:
        pass

    return success_response({
        "timestamp": datetime.utcnow().isoformat(),
        "active_bookings": active_bookings or 0,
        "searching_partner": searching or 0,
        "online_partners": online_partners,
    })


instrument_fastapi(app, "analytics-service")
