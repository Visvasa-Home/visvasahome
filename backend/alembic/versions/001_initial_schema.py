"""
Migration: 001_initial_schema — Create all VisvasaHome tables
Generated: 2026-09-17

This creates the complete database schema for:
  - Users, Addresses
  - Admin Users + RBAC
  - Partners, PartnerLocations, PartnerDocuments, PartnerAvailabilitySlots
  - Categories, Services, ServiceAddons, ServiceAreas, Coupons
  - Bookings, BookingItems, BookingStatusHistory
  - Payments, Refunds, Invoices, Commissions
  - WalletTransactions, Settlements
  - AMC Plans + Subscriptions
  - Contractor Profiles, Leads, Quotations, Contracts, Milestones
  - Reviews, Complaints
  - Notifications, AuditLogs, ChatMessages
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid


revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ─── ENUMS ─────────────────────────────────────────────────────────────────
    role_enum = sa.Enum('CUSTOMER', 'PARTNER', 'ADMIN', name='roleenum')
    admin_role_enum = sa.Enum(
        'SUPER_ADMIN', 'OPERATIONS_ADMIN', 'PARTNER_ADMIN',
        'CUSTOMER_SUPPORT', 'FINANCE_ADMIN', 'SERVICE_ADMIN', 'ANALYTICS_ADMIN',
        name='adminroleenum'
    )
    admin_permission_enum = sa.Enum(
        'VIEW', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REFUND', 'ASSIGN', 'EXPORT',
        name='adminpermissionenum'
    )
    partner_status_enum = sa.Enum(
        'PENDING', 'KYC_SUBMITTED', 'ACTIVE', 'SUSPENDED', 'BLOCKED', 'REJECTED',
        name='partnerstatusenum'
    )
    career_level_enum = sa.Enum('ONBOARDING', 'SME', 'TRAINER', name='careerlevelenum')
    partner_work_status_enum = sa.Enum('AVAILABLE', 'ON_JOB', 'OFFLINE', name='partnerworkstatusenum')
    document_type_enum = sa.Enum(
        'AADHAAR', 'PAN', 'DRIVING_LICENSE', 'BANK_PASSBOOK', 'PROFILE_PHOTO', 'POLICE_CLEARANCE',
        name='documenttypeenum'
    )
    document_status_enum = sa.Enum('PENDING', 'APPROVED', 'REJECTED', name='documentstatusenum')
    booking_status_enum = sa.Enum(
        'CREATED', 'PAYMENT_PENDING', 'CONFIRMED', 'SEARCHING_PARTNER',
        'PARTNER_ASSIGNED', 'PARTNER_ON_WAY', 'ARRIVED', 'JOB_STARTED',
        'JOB_COMPLETED', 'PAYMENT_COMPLETED', 'REVIEWED',
        'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_PARTNER', 'CANCELLED_BY_ADMIN',
        'PENDING', 'PARTNER_EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FAILED',
        name='bookingstatusenum'
    )
    payment_status_enum = sa.Enum('PENDING', 'CAPTURED', 'FAILED', 'REFUNDED', name='paymentstatusenum')
    payment_method_enum = sa.Enum('UPI', 'CARD', 'NET_BANKING', 'WALLET', 'CASH', name='paymentmethodenum')
    refund_status_enum = sa.Enum('INITIATED', 'PROCESSING', 'COMPLETED', 'FAILED', name='refundstatusenum')
    transaction_type_enum = sa.Enum(
        'EARNING', 'PAYOUT', 'LEAD_QUOTE_FEE', 'PENALTY', 'BONUS', 'REFUND',
        name='transactiontypeenum'
    )
    settlement_status_enum = sa.Enum('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', name='settlementstatusenum')
    quote_status_enum = sa.Enum('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', name='quotestatusenum')
    contract_status_enum = sa.Enum('ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED', name='contractstatusenum')
    milestone_status_enum = sa.Enum('PENDING', 'IN_PROGRESS', 'COMPLETED', name='milestonestatusenum')
    amc_plan_type_enum = sa.Enum('BASIC', 'STANDARD', 'PREMIUM', name='amcplantypeenum')
    amc_sub_status_enum = sa.Enum('ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING', name='amcsubscriptionstatusenum')
    complaint_status_enum = sa.Enum(
        'OPEN', 'UNDER_REVIEW', 'RESOLVED', 'ESCALATED', 'CLOSED',
        name='complaintstatusenum'
    )
    complaint_type_enum = sa.Enum(
        'BEHAVIOUR', 'SERVICE_QUALITY', 'PAYMENT', 'DELAY', 'SAFETY', 'OTHER',
        name='complainttypeenum'
    )
    coupon_type_enum = sa.Enum('FLAT_DISCOUNT', 'PERCENTAGE_DISCOUNT', 'FREE_SERVICE', name='coupontypeenum')
    notification_type_enum = sa.Enum('PUSH', 'SMS', 'EMAIL', 'IN_APP', name='notificationtypeenum')
    notification_status_enum = sa.Enum('PENDING', 'SENT', 'DELIVERED', 'FAILED', name='notificationstatusenum')

    # Create all enums
    for e in [
        role_enum, admin_role_enum, admin_permission_enum, partner_status_enum,
        career_level_enum, partner_work_status_enum, document_type_enum, document_status_enum,
        booking_status_enum, payment_status_enum, payment_method_enum, refund_status_enum,
        transaction_type_enum, settlement_status_enum, quote_status_enum, contract_status_enum,
        milestone_status_enum, amc_plan_type_enum, amc_sub_status_enum,
        complaint_status_enum, complaint_type_enum, coupon_type_enum,
        notification_type_enum, notification_status_enum,
    ]:
        e.create(op.get_bind(), checkfirst=True)

    # ─── USERS ─────────────────────────────────────────────────────────────────
    op.create_table('users',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('phone', sa.String(15), unique=True, index=True, nullable=False),
        sa.Column('email', sa.String(255), unique=True, index=True),
        sa.Column('name', sa.String(120), nullable=False),
        sa.Column('role', role_enum, nullable=False, server_default='CUSTOMER'),
        sa.Column('profile_picture_url', sa.String(512)),
        sa.Column('fcm_token', sa.String(512)),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    op.create_table('addresses',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('label', sa.String(60)),
        sa.Column('address_line', sa.String(512), nullable=False),
        sa.Column('landmark', sa.String(256)),
        sa.Column('city', sa.String(100), nullable=False),
        sa.Column('state', sa.String(100), nullable=False),
        sa.Column('pincode', sa.String(10), nullable=False),
        sa.Column('latitude', sa.Float()),
        sa.Column('longitude', sa.Float()),
        sa.Column('is_default', sa.Boolean(), server_default='false'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    # ─── ADMIN USERS ───────────────────────────────────────────────────────────
    op.create_table('admin_users',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False, unique=True),
        sa.Column('admin_role', admin_role_enum, nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('created_by', UUID(as_uuid=True), sa.ForeignKey('admin_users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table('admin_permissions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('admin_user_id', UUID(as_uuid=True), sa.ForeignKey('admin_users.id'), nullable=False),
        sa.Column('permission', admin_permission_enum, nullable=False),
        sa.Column('resource', sa.String(100)),
        sa.Column('granted', sa.Boolean(), server_default='true'),
    )

    # ─── PARTNERS ──────────────────────────────────────────────────────────────
    op.create_table('partners',
        sa.Column('id', UUID(as_uuid=True), sa.ForeignKey('users.id'), primary_key=True),
        sa.Column('name', sa.String(120), nullable=False),
        sa.Column('phone', sa.String(15), unique=True, nullable=False),
        sa.Column('email', sa.String(255), unique=True),
        sa.Column('status', partner_status_enum, server_default='PENDING'),
        sa.Column('encrypted_aadhaar', sa.String(512)),
        sa.Column('encrypted_pan', sa.String(512)),
        sa.Column('background_check_passed', sa.Boolean(), server_default='false'),
        sa.Column('is_available', sa.Boolean(), server_default='false'),
        sa.Column('work_status', partner_work_status_enum, server_default='OFFLINE'),
        sa.Column('skill_tags', JSONB(), server_default='[]'),
        sa.Column('service_areas', JSONB(), server_default='[]'),
        sa.Column('working_hours_start', sa.Time()),
        sa.Column('working_hours_end', sa.Time()),
        sa.Column('jobs_completed', sa.Integer(), server_default='0'),
        sa.Column('career_level', career_level_enum, server_default='ONBOARDING'),
        sa.Column('rating', sa.Float(), server_default='0.0'),
        sa.Column('total_ratings', sa.Integer(), server_default='0'),
        sa.Column('completion_rate', sa.Float(), server_default='0.0'),
        sa.Column('acceptance_rate', sa.Float(), server_default='0.0'),
        sa.Column('wallet_balance', sa.Numeric(12, 2), server_default='0.0'),
        sa.Column('bank_account_number', sa.String(512)),
        sa.Column('bank_ifsc', sa.String(20)),
        sa.Column('upi_id', sa.String(100)),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table('partner_locations',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('partner_id', UUID(as_uuid=True), sa.ForeignKey('partners.id'), unique=True),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('accuracy', sa.Float()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table('partner_documents',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('partner_id', UUID(as_uuid=True), sa.ForeignKey('partners.id'), nullable=False),
        sa.Column('document_type', document_type_enum, nullable=False),
        sa.Column('file_url', sa.String(512), nullable=False),
        sa.Column('status', document_status_enum, server_default='PENDING'),
        sa.Column('rejection_reason', sa.Text()),
        sa.Column('reviewed_by', UUID(as_uuid=True), sa.ForeignKey('admin_users.id'), nullable=True),
        sa.Column('reviewed_at', sa.DateTime()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    # ─── CATALOG ───────────────────────────────────────────────────────────────
    op.create_table('categories',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('name', sa.String(120), nullable=False),
        sa.Column('slug', sa.String(120), unique=True, nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('icon_url', sa.String(512)),
        sa.Column('parent_id', UUID(as_uuid=True), sa.ForeignKey('service_categories.id'), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('sort_order', sa.Integer(), server_default='0'),
    )

    op.create_table('services',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('category_id', UUID(as_uuid=True), sa.ForeignKey('service_categories.id')),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('slug', sa.String(255), unique=True, nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('skill_tag', sa.String(100)),
        sa.Column('base_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('duration_mins', sa.Integer(), nullable=False),
        sa.Column('estimated_arrival_mins', sa.Integer(), server_default='30'),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('is_amc_eligible', sa.Boolean(), server_default='false'),
        sa.Column('image_url', sa.String(512)),
        sa.Column('sort_order', sa.Integer(), server_default='0'),
    )

    op.create_table('partner_services',
        sa.Column('partner_id', UUID(as_uuid=True), sa.ForeignKey('partners.id'), primary_key=True),
        sa.Column('service_package_id', UUID(as_uuid=True), sa.ForeignKey('service_packages.id'), primary_key=True),
    )

    op.create_table('service_addons',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('service_package_id', UUID(as_uuid=True), sa.ForeignKey('service_packages.id'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('price', sa.Numeric(10, 2), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
    )

    op.create_table('service_areas',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('name', sa.String(120), nullable=False),
        sa.Column('city', sa.String(100), nullable=False),
        sa.Column('state', sa.String(100), nullable=False),
        sa.Column('pincodes', JSONB(), server_default='[]'),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table('coupons',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('code', sa.String(50), unique=True, nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('coupon_type', coupon_type_enum, nullable=False),
        sa.Column('discount_value', sa.Numeric(10, 2), nullable=False),
        sa.Column('min_order_value', sa.Numeric(10, 2), server_default='0'),
        sa.Column('max_discount_cap', sa.Numeric(10, 2)),
        sa.Column('valid_from', sa.DateTime(), nullable=False),
        sa.Column('valid_until', sa.DateTime(), nullable=False),
        sa.Column('max_uses', sa.Integer()),
        sa.Column('uses_per_user', sa.Integer(), server_default='1'),
        sa.Column('total_used', sa.Integer(), server_default='0'),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('applicable_services', JSONB(), server_default='[]'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    # ─── AMC ───────────────────────────────────────────────────────────────────
    op.create_table('amc_plans',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('plan_type', amc_plan_type_enum, nullable=False),
        sa.Column('price', sa.Numeric(10, 2), nullable=False),
        sa.Column('validity_months', sa.Integer(), nullable=False),
        sa.Column('total_visits', sa.Integer(), nullable=False),
        sa.Column('applicable_services', JSONB(), server_default='[]'),
        sa.Column('benefits', JSONB(), server_default='[]'),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    # ─── BOOKINGS (create table first, then amc_subscriptions which FK's back to bookings) ──
    op.create_table('bookings',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('customer_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('partner_id', UUID(as_uuid=True), sa.ForeignKey('partners.id'), nullable=True),
        sa.Column('service_package_id', UUID(as_uuid=True), sa.ForeignKey('service_packages.id'), nullable=False),
        sa.Column('address_id', UUID(as_uuid=True), sa.ForeignKey('addresses.id'), nullable=False),
        sa.Column('coupon_id', UUID(as_uuid=True), sa.ForeignKey('coupons.id'), nullable=True),
        sa.Column('amc_subscription_id', UUID(as_uuid=True), nullable=True),  # FK added after
        sa.Column('status', booking_status_enum, nullable=False, server_default='CREATED'),
        sa.Column('is_instant', sa.Boolean(), server_default='true'),
        sa.Column('scheduled_time', sa.DateTime()),
        sa.Column('slot_start', sa.DateTime()),
        sa.Column('slot_end', sa.DateTime()),
        sa.Column('required_skill', sa.String(100)),
        sa.Column('booking_type', sa.String(50), server_default='REGULAR'),
        sa.Column('price', sa.Numeric(10, 2), nullable=False),
        sa.Column('addons_amount', sa.Numeric(10, 2), server_default='0'),
        sa.Column('discount_amount', sa.Numeric(10, 2), server_default='0'),
        sa.Column('tax_amount', sa.Numeric(10, 2), server_default='0'),
        sa.Column('final_amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('notes', sa.Text()),
        sa.Column('cancellation_reason', sa.Text()),
        sa.Column('cancellation_by', sa.String(20)),
        sa.Column('cancellation_fee', sa.Numeric(10, 2), server_default='0'),
        sa.Column('arrival_otp', sa.String(6)),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('confirmed_at', sa.DateTime()),
        sa.Column('partner_assigned_at', sa.DateTime()),
        sa.Column('partner_on_way_at', sa.DateTime()),
        sa.Column('arrived_at', sa.DateTime()),
        sa.Column('service_started_at', sa.DateTime()),
        sa.Column('service_completed_at', sa.DateTime()),
        sa.Column('payment_completed_at', sa.DateTime()),
        sa.Column('reviewed_at', sa.DateTime()),
    )

    # AMC Subscriptions (after bookings)
    op.create_table('amc_subscriptions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('customer_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('plan_id', UUID(as_uuid=True), sa.ForeignKey('amc_plans.id'), nullable=False),
        sa.Column('address_id', UUID(as_uuid=True), sa.ForeignKey('addresses.id'), nullable=True),
        sa.Column('status', amc_sub_status_enum, server_default='PENDING'),
        sa.Column('start_date', sa.Date()),
        sa.Column('end_date', sa.Date()),
        sa.Column('visits_used', sa.Integer(), server_default='0'),
        sa.Column('visits_remaining', sa.Integer()),
        sa.Column('payment_id', UUID(as_uuid=True), nullable=True),
        sa.Column('auto_renew', sa.Boolean(), server_default='false'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('renewed_at', sa.DateTime()),
    )

    # Add FK from bookings to amc_subscriptions
    op.create_foreign_key(
        'fk_bookings_amc_subscription_id', 'bookings', 'amc_subscriptions',
        ['amc_subscription_id'], ['id']
    )

    # Partner availability slots
    op.create_table('partner_availability_slots',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('partner_id', UUID(as_uuid=True), sa.ForeignKey('partners.id'), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('slot_start', sa.Time(), nullable=False),
        sa.Column('slot_end', sa.Time(), nullable=False),
        sa.Column('is_booked', sa.Boolean(), server_default='false'),
        sa.Column('booking_id', UUID(as_uuid=True), sa.ForeignKey('bookings.id'), nullable=True),
    )

    # ─── BOOKING ITEMS + STATUS HISTORY ────────────────────────────────────────
    op.create_table('booking_items',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('booking_id', UUID(as_uuid=True), sa.ForeignKey('bookings.id'), nullable=False),
        sa.Column('item_type', sa.String(50), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('quantity', sa.Integer(), server_default='1'),
        sa.Column('unit_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('total_price', sa.Numeric(10, 2), nullable=False),
    )

    op.create_table('booking_status_history',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('booking_id', UUID(as_uuid=True), sa.ForeignKey('bookings.id'), nullable=False),
        sa.Column('old_status', booking_status_enum),
        sa.Column('new_status', booking_status_enum, nullable=False),
        sa.Column('changed_by', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('changed_by_role', sa.String(20)),
        sa.Column('note', sa.Text()),
        sa.Column('changed_at', sa.DateTime(), server_default=sa.func.now()),
    )

    # ─── PAYMENTS ──────────────────────────────────────────────────────────────
    op.create_table('payments',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('booking_id', UUID(as_uuid=True), sa.ForeignKey('bookings.id'), unique=True),
        sa.Column('amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('status', payment_status_enum, server_default='PENDING'),
        sa.Column('method', payment_method_enum),
        sa.Column('razorpay_order_id', sa.String(255)),
        sa.Column('razorpay_payment_id', sa.String(255)),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('paid_at', sa.DateTime()),
    )

    op.create_table('refunds',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('payment_id', UUID(as_uuid=True), sa.ForeignKey('payments.id'), nullable=False),
        sa.Column('amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('reason', sa.Text()),
        sa.Column('status', refund_status_enum, server_default='INITIATED'),
        sa.Column('razorpay_refund_id', sa.String(255)),
        sa.Column('initiated_by_id', UUID(as_uuid=True), sa.ForeignKey('admin_users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime()),
    )

    op.create_table('invoices',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('payment_id', UUID(as_uuid=True), sa.ForeignKey('payments.id'), unique=True),
        sa.Column('invoice_number', sa.String(50), unique=True, nullable=False),
        sa.Column('customer_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('subtotal', sa.Numeric(10, 2), nullable=False),
        sa.Column('tax_amount', sa.Numeric(10, 2), server_default='0'),
        sa.Column('discount_amount', sa.Numeric(10, 2), server_default='0'),
        sa.Column('total_amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('invoice_url', sa.String(512)),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table('commissions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('payment_id', UUID(as_uuid=True), sa.ForeignKey('payments.id'), unique=True),
        sa.Column('booking_id', UUID(as_uuid=True), sa.ForeignKey('bookings.id'), nullable=False),
        sa.Column('partner_id', UUID(as_uuid=True), sa.ForeignKey('partners.id'), nullable=False),
        sa.Column('gross_amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('commission_pct', sa.Float(), nullable=False),
        sa.Column('commission_amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('tax_on_commission', sa.Numeric(10, 2), server_default='0'),
        sa.Column('partner_earning', sa.Numeric(10, 2), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    # ─── WALLET & SETTLEMENTS ──────────────────────────────────────────────────
    op.create_table('settlements',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('partner_id', UUID(as_uuid=True), sa.ForeignKey('partners.id'), nullable=False),
        sa.Column('amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('status', settlement_status_enum, server_default='PENDING'),
        sa.Column('payout_method', sa.String(30)),
        sa.Column('utr_number', sa.String(100)),
        sa.Column('initiated_by', UUID(as_uuid=True), sa.ForeignKey('admin_users.id'), nullable=True),
        sa.Column('requested_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('processed_at', sa.DateTime()),
        sa.Column('notes', sa.Text()),
    )

    op.create_table('wallet_transactions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('partner_id', UUID(as_uuid=True), sa.ForeignKey('partners.id'), nullable=False),
        sa.Column('booking_id', UUID(as_uuid=True), sa.ForeignKey('bookings.id'), nullable=True),
        sa.Column('settlement_id', UUID(as_uuid=True), sa.ForeignKey('settlements.id'), nullable=True),
        sa.Column('amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('balance_after', sa.Numeric(12, 2)),
        sa.Column('transaction_type', transaction_type_enum, nullable=False),
        sa.Column('description', sa.String(512)),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    # ─── CONTRACTOR ────────────────────────────────────────────────────────────
    op.create_table('contractor_profiles',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('partner_id', UUID(as_uuid=True), sa.ForeignKey('partners.id'), unique=True, nullable=False),
        sa.Column('company_name', sa.String(255)),
        sa.Column('gst_number', sa.String(20)),
        sa.Column('specializations', JSONB(), server_default='[]'),
        sa.Column('team_size', sa.Integer(), server_default='1'),
        sa.Column('min_project_value', sa.Numeric(10, 2)),
        sa.Column('is_verified', sa.Boolean(), server_default='false'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table('contractor_leads',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('customer_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('address_id', UUID(as_uuid=True), sa.ForeignKey('addresses.id'), nullable=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.String(100)),
        sa.Column('estimated_budget', sa.Numeric(10, 2)),
        sa.Column('preferred_start_date', sa.Date()),
        sa.Column('photos', JSONB(), server_default='[]'),
        sa.Column('status', sa.String(30), server_default='OPEN'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('expires_at', sa.DateTime()),
    )

    op.create_table('quotations',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('lead_id', UUID(as_uuid=True), sa.ForeignKey('contractor_leads.id'), nullable=False),
        sa.Column('contractor_id', UUID(as_uuid=True), sa.ForeignKey('contractor_profiles.id'), nullable=False),
        sa.Column('quote_amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('timeline_days', sa.Integer()),
        sa.Column('description', sa.Text()),
        sa.Column('attachments', JSONB(), server_default='[]'),
        sa.Column('status', quote_status_enum, server_default='PENDING'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('expires_at', sa.DateTime()),
    )

    op.create_table('contracts',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('quotation_id', UUID(as_uuid=True), sa.ForeignKey('quotations.id'), unique=True),
        sa.Column('customer_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('contractor_id', UUID(as_uuid=True), sa.ForeignKey('contractor_profiles.id'), nullable=False),
        sa.Column('total_amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('status', contract_status_enum, server_default='ACTIVE'),
        sa.Column('start_date', sa.Date()),
        sa.Column('end_date', sa.Date()),
        sa.Column('contract_doc_url', sa.String(512)),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table('contract_milestones',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('contract_id', UUID(as_uuid=True), sa.ForeignKey('contracts.id'), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('status', milestone_status_enum, server_default='PENDING'),
        sa.Column('due_date', sa.Date()),
        sa.Column('completed_at', sa.DateTime()),
    )

    # ─── REVIEWS & COMPLAINTS ──────────────────────────────────────────────────
    op.create_table('reviews',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('booking_id', UUID(as_uuid=True), sa.ForeignKey('bookings.id'), unique=True),
        sa.Column('customer_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('partner_id', UUID(as_uuid=True), sa.ForeignKey('partners.id'), nullable=True),
        sa.Column('service_package_id', UUID(as_uuid=True), sa.ForeignKey('service_packages.id'), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('comment', sa.Text()),
        sa.Column('photos', JSONB(), server_default='[]'),
        sa.Column('partner_reply', sa.Text()),
        sa.Column('partner_replied_at', sa.DateTime()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table('complaints',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('booking_id', UUID(as_uuid=True), sa.ForeignKey('bookings.id'), nullable=True, unique=True),
        sa.Column('filed_by_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('filed_by_role', sa.String(20), nullable=False),
        sa.Column('against_partner_id', UUID(as_uuid=True), sa.ForeignKey('partners.id'), nullable=True),
        sa.Column('against_customer_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('complaint_type', complaint_type_enum, nullable=False),
        sa.Column('subject', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('attachments', JSONB(), server_default='[]'),
        sa.Column('status', complaint_status_enum, server_default='OPEN'),
        sa.Column('resolution_note', sa.Text()),
        sa.Column('assigned_to', UUID(as_uuid=True), sa.ForeignKey('admin_users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('resolved_at', sa.DateTime()),
    )

    # ─── NOTIFICATIONS & AUDIT LOGS ────────────────────────────────────────────
    op.create_table('notifications',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('body', sa.Text(), nullable=False),
        sa.Column('notif_type', notification_type_enum, server_default='IN_APP'),
        sa.Column('status', notification_status_enum, server_default='PENDING'),
        sa.Column('data', JSONB(), server_default='{}'),
        sa.Column('is_read', sa.Boolean(), server_default='false'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('sent_at', sa.DateTime()),
    )

    op.create_table('audit_logs',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('event_type', sa.String(100), nullable=False, index=True),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('service', sa.String(100), nullable=False),
        sa.Column('ip_address', sa.String(50)),
        sa.Column('payload', JSONB()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), index=True),
        sa.Column('signature', sa.String(512), nullable=False),
    )

    # ─── LEGACY TABLES ─────────────────────────────────────────────────────────
    op.create_table('chat_messages',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('booking_id', UUID(as_uuid=True), sa.ForeignKey('bookings.id')),
        sa.Column('sender_id', UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('receiver_id', UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    op.create_table('quotes',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('booking_id', UUID(as_uuid=True), sa.ForeignKey('bookings.id'), nullable=False),
        sa.Column('partner_id', UUID(as_uuid=True), sa.ForeignKey('partners.id'), nullable=False),
        sa.Column('quote_amount', sa.Float(), nullable=False),
        sa.Column('message', sa.Text()),
        sa.Column('status', quote_status_enum, server_default='PENDING'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    # ─── INDEXES ───────────────────────────────────────────────────────────────
    op.create_index('ix_bookings_status', 'bookings', ['status'])
    op.create_index('ix_bookings_customer_id', 'bookings', ['customer_id'])
    op.create_index('ix_bookings_partner_id', 'bookings', ['partner_id'])
    op.create_index('ix_bookings_created_at', 'bookings', ['created_at'])
    op.create_index('ix_partners_status', 'partners', ['status'])
    op.create_index('ix_wallet_transactions_partner_id', 'wallet_transactions', ['partner_id'])
    op.create_index('ix_payments_status', 'payments', ['status'])
    op.create_index('ix_amc_subscriptions_customer_id', 'amc_subscriptions', ['customer_id'])
    op.create_index('ix_complaints_status', 'complaints', ['status'])
    op.create_index('ix_notifications_user_id', 'notifications', ['user_id'])


def downgrade() -> None:
    """Drop all tables in reverse dependency order."""
    tables_to_drop = [
        'quotes', 'chat_messages', 'audit_logs', 'notifications',
        'complaints', 'reviews',
        'contract_milestones', 'contracts', 'quotations',
        'contractor_leads', 'contractor_profiles',
        'wallet_transactions', 'settlements',
        'commissions', 'invoices', 'refunds', 'payments',
        'booking_status_history', 'booking_items',
        'partner_availability_slots',
        'amc_subscriptions', 'amc_plans',
        'bookings', 'coupons', 'service_areas', 'service_addons',
        'partner_services', 'services', 'categories',
        'partner_documents', 'partner_locations', 'partners',
        'admin_permissions', 'admin_users',
        'addresses', 'users',
    ]
    for table in tables_to_drop:
        op.drop_table(table)

    enum_names = [
        'roleenum', 'adminroleenum', 'adminpermissionenum',
        'partnerstatusenum', 'careerlevelenum', 'partnerworkstatusenum',
        'documenttypeenum', 'documentstatusenum', 'bookingstatusenum',
        'paymentstatusenum', 'paymentmethodenum', 'refundstatusenum',
        'transactiontypeenum', 'settlementstatusenum', 'quotestatusenum',
        'contractstatusenum', 'milestonestatusenum', 'amcplantypeenum',
        'amcsubscriptionstatusenum', 'complaintstatusenum', 'complainttypeenum',
        'coupontypeenum', 'notificationtypeenum', 'notificationstatusenum',
    ]
    for name in enum_names:
        op.execute(f"DROP TYPE IF EXISTS {name}")
