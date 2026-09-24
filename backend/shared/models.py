"""
VisvasaHome — Shared SQLAlchemy Models (Single-schema Modular Monolith)

Tables:
  users, addresses
  admin_users
  partners, partner_documents, partner_availability_slots, partner_locations, partner_services
  categories, services, service_addons, service_pricing, service_areas
  coupons
  bookings, booking_items, booking_status_history, assignments
  payments, refunds, invoices, commissions
  partner_wallet, wallet_transactions, settlements
  amc_plans, amc_subscriptions
  contractors, quotations, contracts, contract_milestones
  reviews, complaints
  notifications
  audit_logs
"""

import uuid
from datetime import datetime, time
from sqlalchemy import (
    Column, String, Float, Boolean, DateTime, Time, Integer,
    Text, ForeignKey, Enum as SQLEnum, Table, Numeric, Date
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from shared.database import Base
import enum


# ─────────────────────────────────────────────────────────────────────────────
# ENUMS
# ─────────────────────────────────────────────────────────────────────────────

class RoleEnum(str, enum.Enum):
    CUSTOMER = "CUSTOMER"
    PARTNER  = "PARTNER"
    ADMIN    = "ADMIN"

class AdminRoleEnum(str, enum.Enum):
    SUPER_ADMIN        = "SUPER_ADMIN"
    OPERATIONS_ADMIN   = "OPERATIONS_ADMIN"
    PARTNER_ADMIN      = "PARTNER_ADMIN"
    CUSTOMER_SUPPORT   = "CUSTOMER_SUPPORT"
    FINANCE_ADMIN      = "FINANCE_ADMIN"
    SERVICE_ADMIN      = "SERVICE_ADMIN"
    ANALYTICS_ADMIN    = "ANALYTICS_ADMIN"

class AdminPermissionEnum(str, enum.Enum):
    VIEW    = "VIEW"
    CREATE  = "CREATE"
    UPDATE  = "UPDATE"
    DELETE  = "DELETE"
    APPROVE = "APPROVE"
    REFUND  = "REFUND"
    ASSIGN  = "ASSIGN"
    EXPORT  = "EXPORT"

class PartnerStatusEnum(str, enum.Enum):
    PENDING        = "PENDING"
    KYC_SUBMITTED  = "KYC_SUBMITTED"
    ACTIVE         = "ACTIVE"
    SUSPENDED      = "SUSPENDED"
    BLOCKED        = "BLOCKED"
    REJECTED       = "REJECTED"

class CareerLevelEnum(str, enum.Enum):
    ONBOARDING = "ONBOARDING"
    SME        = "SME"
    TRAINER    = "TRAINER"

class PartnerWorkStatusEnum(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    ON_JOB    = "ON_JOB"
    OFFLINE   = "OFFLINE"

class DocumentTypeEnum(str, enum.Enum):
    AADHAAR          = "AADHAAR"
    PAN              = "PAN"
    DRIVING_LICENSE  = "DRIVING_LICENSE"
    BANK_PASSBOOK    = "BANK_PASSBOOK"
    PROFILE_PHOTO    = "PROFILE_PHOTO"
    POLICE_CLEARANCE = "POLICE_CLEARANCE"

class DocumentStatusEnum(str, enum.Enum):
    PENDING  = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class BookingStatusEnum(str, enum.Enum):
    CREATED            = "CREATED"
    PAYMENT_PENDING    = "PAYMENT_PENDING"
    CONFIRMED          = "CONFIRMED"
    SEARCHING_PARTNER  = "SEARCHING_PARTNER"
    PARTNER_ASSIGNED   = "PARTNER_ASSIGNED"
    PARTNER_ON_WAY     = "PARTNER_ON_WAY"
    ARRIVED            = "ARRIVED"
    JOB_STARTED        = "JOB_STARTED"
    JOB_COMPLETED      = "JOB_COMPLETED"
    PAYMENT_COMPLETED  = "PAYMENT_COMPLETED"
    REVIEWED           = "REVIEWED"
    # Cancellation states
    CANCELLED_BY_CUSTOMER = "CANCELLED_BY_CUSTOMER"
    CANCELLED_BY_PARTNER  = "CANCELLED_BY_PARTNER"
    CANCELLED_BY_ADMIN    = "CANCELLED_BY_ADMIN"
    # Legacy aliases (for backward compat)
    PENDING            = "PENDING"
    PARTNER_EN_ROUTE   = "PARTNER_EN_ROUTE"
    IN_PROGRESS        = "IN_PROGRESS"
    COMPLETED          = "COMPLETED"
    CANCELLED          = "CANCELLED"
    FAILED             = "FAILED"

class PaymentStatusEnum(str, enum.Enum):
    PENDING  = "PENDING"
    CAPTURED = "CAPTURED"
    FAILED   = "FAILED"
    REFUNDED = "REFUNDED"

class PaymentMethodEnum(str, enum.Enum):
    UPI          = "UPI"
    CARD         = "CARD"
    NET_BANKING  = "NET_BANKING"
    WALLET       = "WALLET"
    CASH         = "CASH"

class RefundStatusEnum(str, enum.Enum):
    INITIATED  = "INITIATED"
    PROCESSING = "PROCESSING"
    COMPLETED  = "COMPLETED"
    FAILED     = "FAILED"

class TransactionTypeEnum(str, enum.Enum):
    EARNING       = "EARNING"
    PAYOUT        = "PAYOUT"
    LEAD_QUOTE_FEE = "LEAD_QUOTE_FEE"
    PENALTY       = "PENALTY"
    BONUS         = "BONUS"
    REFUND        = "REFUND"

class SettlementStatusEnum(str, enum.Enum):
    PENDING    = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED  = "COMPLETED"
    FAILED     = "FAILED"

class QuoteStatusEnum(str, enum.Enum):
    PENDING  = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    EXPIRED  = "EXPIRED"

class ContractStatusEnum(str, enum.Enum):
    ACTIVE    = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    DISPUTED  = "DISPUTED"

class MilestoneStatusEnum(str, enum.Enum):
    PENDING    = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED  = "COMPLETED"

class AmcPlanTypeEnum(str, enum.Enum):
    BASIC     = "BASIC"
    STANDARD  = "STANDARD"
    PREMIUM   = "PREMIUM"

class AmcSubscriptionStatusEnum(str, enum.Enum):
    ACTIVE    = "ACTIVE"
    EXPIRED   = "EXPIRED"
    CANCELLED = "CANCELLED"
    PENDING   = "PENDING"

class ComplaintStatusEnum(str, enum.Enum):
    OPEN       = "OPEN"
    UNDER_REVIEW = "UNDER_REVIEW"
    RESOLVED   = "RESOLVED"
    ESCALATED  = "ESCALATED"
    CLOSED     = "CLOSED"

class ComplaintTypeEnum(str, enum.Enum):
    BEHAVIOUR   = "BEHAVIOUR"
    SERVICE_QUALITY = "SERVICE_QUALITY"
    PAYMENT     = "PAYMENT"
    DELAY       = "DELAY"
    SAFETY      = "SAFETY"
    OTHER       = "OTHER"

class CouponTypeEnum(str, enum.Enum):
    FLAT_DISCOUNT       = "FLAT_DISCOUNT"
    PERCENTAGE_DISCOUNT = "PERCENTAGE_DISCOUNT"
    FREE_SERVICE        = "FREE_SERVICE"

class NotificationTypeEnum(str, enum.Enum):
    PUSH    = "PUSH"
    SMS     = "SMS"
    EMAIL   = "EMAIL"
    IN_APP  = "IN_APP"

class NotificationStatusEnum(str, enum.Enum):
    PENDING   = "PENDING"
    SENT      = "SENT"
    DELIVERED = "DELIVERED"
    FAILED    = "FAILED"

class CustomerWalletTransactionTypeEnum(str, enum.Enum):
    CREDIT  = "CREDIT"
    DEBIT   = "DEBIT"
    REFUND  = "REFUND"
    PROMO   = "PROMO"


# ─────────────────────────────────────────────────────────────────────────────
# ASSOCIATION TABLES
# ─────────────────────────────────────────────────────────────────────────────

partner_services = Table(
    "partner_services",
    Base.metadata,
    Column("partner_id", UUID(as_uuid=True), ForeignKey("partners.id"), primary_key=True),
    Column("service_package_id", UUID(as_uuid=True), ForeignKey("service_packages.id"), primary_key=True),
)

admin_role_permissions = Table(
    "admin_role_permissions",
    Base.metadata,
    Column("admin_user_id", UUID(as_uuid=True), ForeignKey("admin_users.id"), primary_key=True),
    Column("permission",    SQLEnum(AdminPermissionEnum), primary_key=True),
)

favorite_partners = Table(
    "favorite_partners",
    Base.metadata,
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True),
    Column("partner_id", UUID(as_uuid=True), ForeignKey("partners.id"), primary_key=True),
)

favorite_services = Table(
    "favorite_services",
    Base.metadata,
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True),
    Column("service_package_id", UUID(as_uuid=True), ForeignKey("service_packages.id"), primary_key=True),
)


# ─────────────────────────────────────────────────────────────────────────────
# USERS
# ─────────────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"
    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone               = Column(String(15), unique=True, index=True, nullable=False)
    email               = Column(String(255), unique=True, index=True)
    name                = Column(String(120), nullable=False)
    role                = Column(SQLEnum(RoleEnum), default=RoleEnum.CUSTOMER, nullable=False)
    profile_picture_url = Column(String(512))
    fcm_token           = Column(String(512))
    subscription_tier   = Column(String(50), default="STANDARD")
    loyalty_points      = Column(Integer, default=0)
    referral_code       = Column(String(20), unique=True, index=True)
    referred_by_id      = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    wallet_balance      = Column(Numeric(12, 2), default=0.0)
    loyalty_points      = Column(Integer, default=0)
    preferred_language  = Column(String(10), default="en")
    tenant_id           = Column(String(50), default="default", index=True)
    push_enabled        = Column(Boolean, default=True)
    sms_enabled         = Column(Boolean, default=True)
    email_enabled       = Column(Boolean, default=True)
    is_active           = Column(Boolean, default=True)
    created_at          = Column(DateTime, default=datetime.utcnow)
    updated_at          = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    addresses = relationship("Address",   back_populates="user")
    bookings  = relationship("Booking",   back_populates="customer", foreign_keys="[Booking.customer_id]")
    complaints = relationship("Complaint", back_populates="filed_by", foreign_keys="[Complaint.filed_by_id]")
    wallet_transactions = relationship("CustomerWalletTransaction", back_populates="user")
    favorite_partners_list = relationship("Partner", secondary=favorite_partners)
    favorite_services_list = relationship("ServicePackage", secondary=favorite_services)


class Address(Base):
    __tablename__ = "addresses"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    label        = Column(String(60))               # Home / Work / Other
    address_line = Column(String(512), nullable=False)
    landmark     = Column(String(256))
    city         = Column(String(100), nullable=False)
    state        = Column(String(100), nullable=False)
    pincode      = Column(String(10),  nullable=False)
    latitude     = Column(Float)
    longitude    = Column(Float)
    is_default   = Column(Boolean, default=False)
    created_at   = Column(DateTime, default=datetime.utcnow)

    user     = relationship("User",    back_populates="addresses")
    bookings = relationship("Booking", back_populates="address")


# ─────────────────────────────────────────────────────────────────────────────
# ADMIN USERS & RBAC
# ─────────────────────────────────────────────────────────────────────────────

class AdminUser(Base):
    """Fine-grained admin users separate from customer/partner users."""
    __tablename__ = "admin_users"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    admin_role   = Column(SQLEnum(AdminRoleEnum), nullable=False, default=AdminRoleEnum.CUSTOMER_SUPPORT)
    is_active    = Column(Boolean, default=True)
    created_by   = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"), nullable=True)
    created_at   = Column(DateTime, default=datetime.utcnow)
    updated_at   = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user         = relationship("User", foreign_keys=[user_id])
    permissions  = relationship("AdminPermissionEntry", back_populates="admin_user")


class AdminPermissionEntry(Base):
    """Per-admin permission overrides (additive to role defaults)."""
    __tablename__ = "admin_permissions"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    admin_user_id = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"), nullable=False)
    permission   = Column(SQLEnum(AdminPermissionEnum), nullable=False)
    resource     = Column(String(100))          # e.g. "bookings", "partners", "finance"
    granted      = Column(Boolean, default=True)

    admin_user   = relationship("AdminUser", back_populates="permissions")


# ─────────────────────────────────────────────────────────────────────────────
# PARTNERS
# ─────────────────────────────────────────────────────────────────────────────

class Partner(Base):
    __tablename__ = "partners"
    id                     = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    name                   = Column(String(120), nullable=False)
    phone                  = Column(String(15), unique=True, nullable=False)
    email                  = Column(String(255), unique=True)
    status                 = Column(SQLEnum(PartnerStatusEnum), default=PartnerStatusEnum.PENDING)

    # KYC Details (Encrypted PII)
    encrypted_aadhaar      = Column(String(512))
    encrypted_pan          = Column(String(512))
    background_check_passed = Column(Boolean, default=False)

    # Availability
    is_available           = Column(Boolean, default=False)
    work_status            = Column(SQLEnum(PartnerWorkStatusEnum), default=PartnerWorkStatusEnum.OFFLINE)
    skill_tags             = Column(JSONB, default=list)      # ["AC_REPAIR", "PLUMBING"]
    service_areas          = Column(JSONB, default=list)      # ["110001", "110002"]
    working_hours_start    = Column(Time)
    working_hours_end      = Column(Time)

    # Performance
    jobs_completed         = Column(Integer, default=0)
    career_level           = Column(SQLEnum(CareerLevelEnum), default=CareerLevelEnum.ONBOARDING)
    rating                 = Column(Float, default=0.0)
    total_ratings          = Column(Integer, default=0)
    completion_rate        = Column(Float, default=0.0)
    acceptance_rate        = Column(Float, default=0.0)

    # Wallet (simple balance field; detailed ledger in WalletTransaction)
    wallet_balance         = Column(Numeric(12, 2), default=0.0)

    # Banking for payouts
    bank_account_number    = Column(String(512))   # encrypted
    bank_ifsc              = Column(String(20))
    upi_id                 = Column(String(100))

    created_at             = Column(DateTime, default=datetime.utcnow)
    updated_at             = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user              = relationship("User", foreign_keys=[id])
    location          = relationship("PartnerLocation",         back_populates="partner", uselist=False)
    bookings          = relationship("Booking",                 back_populates="partner",  foreign_keys="[Booking.partner_id]")
    services          = relationship("ServicePackage",                 secondary=partner_services, back_populates="partners")
    documents         = relationship("PartnerDocument",         back_populates="partner")
    availability_slots = relationship("PartnerAvailabilitySlot", back_populates="partner")
    wallet_transactions = relationship("WalletTransaction",     back_populates="partner")
    settlements       = relationship("Settlement",              back_populates="partner")
    complaints        = relationship("Complaint",               back_populates="against_partner", foreign_keys="[Complaint.against_partner_id]")


class PartnerLocation(Base):
    __tablename__ = "partner_locations"
    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    partner_id = Column(UUID(as_uuid=True), ForeignKey("partners.id"), unique=True)
    latitude   = Column(Float, nullable=False)
    longitude  = Column(Float, nullable=False)
    accuracy   = Column(Float)                  # meters
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    partner = relationship("Partner", back_populates="location")


class PartnerDocument(Base):
    __tablename__ = "partner_documents"
    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    partner_id    = Column(UUID(as_uuid=True), ForeignKey("partners.id"), nullable=False)
    document_type = Column(SQLEnum(DocumentTypeEnum), nullable=False)
    file_url      = Column(String(512), nullable=False)
    status        = Column(SQLEnum(DocumentStatusEnum), default=DocumentStatusEnum.PENDING)
    rejection_reason = Column(Text)
    reviewed_by   = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"), nullable=True)
    reviewed_at   = Column(DateTime)
    created_at    = Column(DateTime, default=datetime.utcnow)

    partner = relationship("Partner", back_populates="documents")


class PartnerAvailabilitySlot(Base):
    """Partner declares future availability windows for scheduled bookings."""
    __tablename__ = "partner_availability_slots"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    partner_id  = Column(UUID(as_uuid=True), ForeignKey("partners.id"), nullable=False)
    date        = Column(Date, nullable=False)
    slot_start  = Column(Time, nullable=False)
    slot_end    = Column(Time, nullable=False)
    is_booked   = Column(Boolean, default=False)
    booking_id  = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=True)

    partner = relationship("Partner", back_populates="availability_slots")


# ─────────────────────────────────────────────────────────────────────────────
# SERVICE CATALOG
# ─────────────────────────────────────────────────────────────────────────────

class ServiceCategory(Base):
    __tablename__ = "service_categories"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name        = Column(String(120), nullable=False)
    slug        = Column(String(120), unique=True, nullable=False)
    description = Column(Text)
    icon_url    = Column(String(512))
    parent_id   = Column(UUID(as_uuid=True), ForeignKey("service_categories.id"), nullable=True)
    is_active   = Column(Boolean, default=True)
    sort_order  = Column(Integer, default=0)

    services = relationship("ServicePackage", back_populates="category")


class ServicePackage(Base):
    __tablename__ = "service_packages"
    id                     = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id            = Column(UUID(as_uuid=True), ForeignKey("service_categories.id"))
    name                   = Column(String(255), nullable=False)
    slug                   = Column(String(255), unique=True, nullable=False)
    description            = Column(Text)
    skill_tag              = Column(String(100))
    base_price             = Column(Numeric(10, 2), nullable=False)
    duration_mins          = Column(Integer, nullable=False)
    estimated_arrival_mins = Column(Integer, default=30)
    is_active              = Column(Boolean, default=True)
    is_amc_eligible        = Column(Boolean, default=False)
    image_url              = Column(String(512))
    sort_order             = Column(Integer, default=0)

    category  = relationship("ServiceCategory",     back_populates="services")
    bookings  = relationship("Booking",      back_populates="service")
    partners  = relationship("Partner",      secondary=partner_services, back_populates="services")
    reviews   = relationship("Rating",       back_populates="service")
    addons    = relationship("ServiceAddon", back_populates="service")


class ServiceAddon(Base):
    """Optional add-ons that can be selected during booking."""
    __tablename__ = "service_addons"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    service_package_id  = Column(UUID(as_uuid=True), ForeignKey("service_packages.id"), nullable=False)
    name        = Column(String(255), nullable=False)
    description = Column(Text)
    price       = Column(Numeric(10, 2), nullable=False)
    is_active   = Column(Boolean, default=True)

    service = relationship("ServicePackage", back_populates="addons")


class ServiceArea(Base):
    """City/pincode service areas where VisvasaHome operates."""
    __tablename__ = "service_areas"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name        = Column(String(120), nullable=False)   # e.g., "South Delhi"
    city        = Column(String(100), nullable=False)
    state       = Column(String(100), nullable=False)
    pincodes    = Column(JSONB, default=list)            # ["110001", "110002"]
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime, default=datetime.utcnow)


class Coupon(Base):
    __tablename__ = "coupons"
    id                 = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code               = Column(String(50), unique=True, nullable=False)
    description        = Column(Text)
    coupon_type        = Column(SQLEnum(CouponTypeEnum), nullable=False)
    discount_value     = Column(Numeric(10, 2), nullable=False)   # flat ₹ or %
    min_order_value    = Column(Numeric(10, 2), default=0)
    max_discount_cap   = Column(Numeric(10, 2))                   # for % coupons
    valid_from         = Column(DateTime, nullable=False)
    valid_until        = Column(DateTime, nullable=False)
    max_uses           = Column(Integer, default=None)            # None = unlimited
    uses_per_user      = Column(Integer, default=1)
    total_used         = Column(Integer, default=0)
    is_active          = Column(Boolean, default=True)
    applicable_services = Column(JSONB, default=list)            # [] = all services
    created_at         = Column(DateTime, default=datetime.utcnow)


# ─────────────────────────────────────────────────────────────────────────────
# BOOKINGS
# ─────────────────────────────────────────────────────────────────────────────

class Booking(Base):
    __tablename__ = "bookings"
    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id       = Column(String(50), default="default", index=True)
    customer_id     = Column(UUID(as_uuid=True), ForeignKey("users.id"),    nullable=False)
    partner_id      = Column(UUID(as_uuid=True), ForeignKey("partners.id"), nullable=True)
    service_package_id      = Column(UUID(as_uuid=True), ForeignKey("service_packages.id"), nullable=False)
    address_id      = Column(UUID(as_uuid=True), ForeignKey("addresses.id"), nullable=False)
    coupon_id       = Column(UUID(as_uuid=True), ForeignKey("coupons.id"),  nullable=True)
    amc_subscription_id = Column(UUID(as_uuid=True), ForeignKey("amc_subscriptions.id"), nullable=True)

    status          = Column(SQLEnum(BookingStatusEnum), default=BookingStatusEnum.CREATED, nullable=False)
    is_instant      = Column(Boolean, default=True)
    scheduled_time  = Column(DateTime)
    slot_start      = Column(DateTime)
    slot_end        = Column(DateTime)
    required_skill  = Column(String(100))
    booking_type    = Column(String(50), default="REGULAR")   # REGULAR / AMC / CONTRACTOR

    # Pricing
    price           = Column(Numeric(10, 2), nullable=False)
    addons_amount   = Column(Numeric(10, 2), default=0)
    discount_amount = Column(Numeric(10, 2), default=0)
    tax_amount      = Column(Numeric(10, 2), default=0)
    final_amount    = Column(Numeric(10, 2), nullable=False)
    insurance_fee   = Column(Numeric(10, 2), default=0)

    notes                 = Column(Text)
    cancellation_reason   = Column(Text)
    cancellation_by       = Column(String(20))           # CUSTOMER / PARTNER / ADMIN
    cancellation_fee      = Column(Numeric(10, 2), default=0)
    arrival_otp           = Column(String(6))

    # Timestamps
    created_at            = Column(DateTime, default=datetime.utcnow)
    confirmed_at          = Column(DateTime)
    partner_assigned_at   = Column(DateTime)
    partner_on_way_at     = Column(DateTime)
    arrived_at            = Column(DateTime)
    service_started_at    = Column(DateTime)
    service_completed_at  = Column(DateTime)
    payment_completed_at  = Column(DateTime)
    reviewed_at           = Column(DateTime)

    customer         = relationship("User",            back_populates="bookings",  foreign_keys=[customer_id])
    partner          = relationship("Partner",         back_populates="bookings",  foreign_keys=[partner_id])
    service          = relationship("ServicePackage",         back_populates="bookings")
    address          = relationship("Address",         back_populates="bookings")
    coupon           = relationship("Coupon",          foreign_keys=[coupon_id])
    amc_subscription = relationship("AmcSubscription", foreign_keys=[amc_subscription_id])
    payment          = relationship("Payment",         back_populates="booking",   uselist=False)
    items            = relationship("BookingItem",     back_populates="booking")
    status_history   = relationship("BookingStatusHistory", back_populates="booking", order_by="BookingStatusHistory.changed_at")
    review           = relationship("Rating",          back_populates="booking",   uselist=False)
    complaint        = relationship("Complaint",       back_populates="booking",   uselist=False)
    chat_messages    = relationship("ChatMessage",     back_populates="booking")
    notifications    = relationship("Notification",    back_populates="booking")


class BookingItem(Base):
    """Line items within a booking (base service + selected add-ons)."""
    __tablename__ = "booking_items"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id  = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False)
    item_type   = Column(String(50), nullable=False)    # SERVICE / ADDON
    name        = Column(String(255), nullable=False)
    quantity    = Column(Integer, default=1)
    unit_price  = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)

    booking = relationship("Booking", back_populates="items")


class BookingStatusHistory(Base):
    """Full audit trail of every booking status transition."""
    __tablename__ = "booking_status_history"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id  = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False)
    old_status  = Column(SQLEnum(BookingStatusEnum), nullable=True)
    new_status  = Column(SQLEnum(BookingStatusEnum), nullable=False)
    changed_by  = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    changed_by_role = Column(String(20))               # CUSTOMER / PARTNER / ADMIN / SYSTEM
    note        = Column(Text)
    changed_at  = Column(DateTime, default=datetime.utcnow)

    booking = relationship("Booking", back_populates="status_history")


# ─────────────────────────────────────────────────────────────────────────────
# PAYMENTS, REFUNDS, INVOICES, COMMISSIONS
# ─────────────────────────────────────────────────────────────────────────────

class Payment(Base):
    __tablename__ = "payments"
    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id          = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), unique=True)
    amount              = Column(Numeric(10, 2), nullable=False)
    status              = Column(SQLEnum(PaymentStatusEnum), default=PaymentStatusEnum.PENDING)
    method              = Column(SQLEnum(PaymentMethodEnum))
    razorpay_order_id   = Column(String(255))
    razorpay_payment_id = Column(String(255))
    created_at          = Column(DateTime, default=datetime.utcnow)
    paid_at             = Column(DateTime)

    booking    = relationship("Booking", back_populates="payment")
    refunds    = relationship("Refund",  back_populates="payment")
    commission = relationship("Commission", back_populates="payment", uselist=False)
    invoice    = relationship("Invoice",    back_populates="payment",  uselist=False)


class Refund(Base):
    __tablename__ = "refunds"
    id                    = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    payment_id            = Column(UUID(as_uuid=True), ForeignKey("payments.id"), nullable=False)
    amount                = Column(Numeric(10, 2), nullable=False)
    reason                = Column(Text)
    status                = Column(SQLEnum(RefundStatusEnum), default=RefundStatusEnum.INITIATED)
    razorpay_refund_id    = Column(String(255))
    initiated_by_id       = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"), nullable=True)
    created_at            = Column(DateTime, default=datetime.utcnow)
    completed_at          = Column(DateTime)

    payment = relationship("Payment", back_populates="refunds")


class Invoice(Base):
    __tablename__ = "invoices"
    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    payment_id      = Column(UUID(as_uuid=True), ForeignKey("payments.id"), unique=True)
    invoice_number  = Column(String(50), unique=True, nullable=False)
    customer_id     = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    subtotal        = Column(Numeric(10, 2), nullable=False)
    tax_amount      = Column(Numeric(10, 2), default=0)
    discount_amount = Column(Numeric(10, 2), default=0)
    total_amount    = Column(Numeric(10, 2), nullable=False)
    invoice_url     = Column(String(512))          # S3 PDF link
    created_at      = Column(DateTime, default=datetime.utcnow)

    payment  = relationship("Payment", back_populates="invoice")
    customer = relationship("User",    foreign_keys=[customer_id])


class Commission(Base):
    """Per-booking platform commission record (double-entry accounting)."""
    __tablename__ = "commissions"
    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    payment_id      = Column(UUID(as_uuid=True), ForeignKey("payments.id"), unique=True)
    booking_id      = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False)
    partner_id      = Column(UUID(as_uuid=True), ForeignKey("partners.id"), nullable=False)
    gross_amount    = Column(Numeric(10, 2), nullable=False)
    commission_pct  = Column(Float, nullable=False)          # e.g., 25.0
    commission_amount = Column(Numeric(10, 2), nullable=False)
    tax_on_commission = Column(Numeric(10, 2), default=0)
    partner_earning = Column(Numeric(10, 2), nullable=False)
    created_at      = Column(DateTime, default=datetime.utcnow)

    payment = relationship("Payment", back_populates="commission")
    booking = relationship("Booking", foreign_keys=[booking_id])
    partner = relationship("Partner", foreign_keys=[partner_id])


# ─────────────────────────────────────────────────────────────────────────────
# WALLET & SETTLEMENTS
# ─────────────────────────────────────────────────────────────────────────────

class CustomerWalletTransaction(Base):
    """Wallet for customer refunds, promos, and cashbacks."""
    __tablename__ = "customer_wallet_transactions"
    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id          = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    booking_id       = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=True)
    
    amount           = Column(Numeric(12, 2), nullable=False)
    transaction_type = Column(SQLEnum(CustomerWalletTransactionTypeEnum), nullable=False)
    description      = Column(String(255))
    reference_id     = Column(String(100))
    created_at       = Column(DateTime, default=datetime.utcnow)

    user             = relationship("User", back_populates="wallet_transactions")
    booking          = relationship("Booking")


class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"
    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    partner_id       = Column(UUID(as_uuid=True), ForeignKey("partners.id"), nullable=False)
    booking_id       = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=True)
    settlement_id    = Column(UUID(as_uuid=True), ForeignKey("settlements.id"), nullable=True)
    amount           = Column(Numeric(10, 2), nullable=False)   # +ve credit / -ve debit
    balance_after    = Column(Numeric(12, 2))                   # snapshot after txn
    transaction_type = Column(SQLEnum(TransactionTypeEnum), nullable=False)
    description      = Column(String(512))
    created_at       = Column(DateTime, default=datetime.utcnow)

    partner    = relationship("Partner",    back_populates="wallet_transactions")
    booking    = relationship("Booking",    foreign_keys=[booking_id])
    settlement = relationship("Settlement", foreign_keys=[settlement_id])


class Settlement(Base):
    """Batch payout of partner earnings to bank / UPI."""
    __tablename__ = "settlements"
    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    partner_id     = Column(UUID(as_uuid=True), ForeignKey("partners.id"), nullable=False)
    amount         = Column(Numeric(10, 2), nullable=False)
    status         = Column(SQLEnum(SettlementStatusEnum), default=SettlementStatusEnum.PENDING)
    payout_method  = Column(String(30))                # BANK / UPI
    utr_number     = Column(String(100))               # UTR / reference from bank
    initiated_by   = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"), nullable=True)
    requested_at   = Column(DateTime, default=datetime.utcnow)
    processed_at   = Column(DateTime)
    notes          = Column(Text)

    partner      = relationship("Partner",    back_populates="settlements")
    transactions = relationship("WalletTransaction", back_populates="settlement")


# ─────────────────────────────────────────────────────────────────────────────
# AMC (Annual Maintenance Contract)
# ─────────────────────────────────────────────────────────────────────────────

class AmcPlan(Base):
    __tablename__ = "amc_plans"
    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name                = Column(String(255), nullable=False)
    description         = Column(Text)
    plan_type           = Column(SQLEnum(AmcPlanTypeEnum), nullable=False)
    price               = Column(Numeric(10, 2), nullable=False)
    validity_months     = Column(Integer, nullable=False)       # e.g., 12 months
    total_visits        = Column(Integer, nullable=False)       # total service visits included
    applicable_services = Column(JSONB, default=list)           # list of service IDs
    benefits            = Column(JSONB, default=list)           # text list of perks
    is_active           = Column(Boolean, default=True)
    created_at          = Column(DateTime, default=datetime.utcnow)

    subscriptions = relationship("AmcSubscription", back_populates="plan")


class AmcSubscription(Base):
    __tablename__ = "amc_subscriptions"
    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id      = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    plan_id          = Column(UUID(as_uuid=True), ForeignKey("amc_plans.id"), nullable=False)
    address_id       = Column(UUID(as_uuid=True), ForeignKey("addresses.id"), nullable=True)
    status           = Column(SQLEnum(AmcSubscriptionStatusEnum), default=AmcSubscriptionStatusEnum.PENDING)
    start_date       = Column(Date)
    end_date         = Column(Date)
    visits_used      = Column(Integer, default=0)
    visits_remaining = Column(Integer)
    payment_id       = Column(UUID(as_uuid=True), ForeignKey("payments.id"), nullable=True)
    auto_renew       = Column(Boolean, default=False)
    created_at       = Column(DateTime, default=datetime.utcnow)
    renewed_at       = Column(DateTime)

    customer  = relationship("User",    foreign_keys=[customer_id])
    plan      = relationship("AmcPlan", back_populates="subscriptions")
    address   = relationship("Address", foreign_keys=[address_id])
    bookings  = relationship("Booking", back_populates="amc_subscription", foreign_keys="[Booking.amc_subscription_id]")


# ─────────────────────────────────────────────────────────────────────────────
# CONTRACTOR MODULE
# ─────────────────────────────────────────────────────────────────────────────

class ContractorProfile(Base):
    """Contractors are specialized partners handling large/complex jobs."""
    __tablename__ = "contractor_profiles"
    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    partner_id      = Column(UUID(as_uuid=True), ForeignKey("partners.id"), unique=True, nullable=False)
    company_name    = Column(String(255))
    gst_number      = Column(String(20))
    specializations = Column(JSONB, default=list)   # ["renovation", "waterproofing"]
    team_size       = Column(Integer, default=1)
    min_project_value = Column(Numeric(10, 2))
    is_verified     = Column(Boolean, default=False)
    created_at      = Column(DateTime, default=datetime.utcnow)

    partner    = relationship("Partner",    foreign_keys=[partner_id])
    quotations = relationship("Quotation",  back_populates="contractor")


class ContractorLead(Base):
    """Large-job leads posted by customers."""
    __tablename__ = "contractor_leads"
    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id     = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    address_id      = Column(UUID(as_uuid=True), ForeignKey("addresses.id"), nullable=True)
    title           = Column(String(255), nullable=False)
    description     = Column(Text, nullable=False)
    category        = Column(String(100))
    estimated_budget = Column(Numeric(10, 2))
    preferred_start_date = Column(Date)
    photos          = Column(JSONB, default=list)    # S3 URLs
    status          = Column(String(30), default="OPEN")  # OPEN / AWARDED / CLOSED
    created_at      = Column(DateTime, default=datetime.utcnow)
    expires_at      = Column(DateTime)

    customer   = relationship("User",      foreign_keys=[customer_id])
    address    = relationship("Address",   foreign_keys=[address_id])
    quotations = relationship("Quotation", back_populates="lead")


class Quotation(Base):
    __tablename__ = "quotations"
    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id        = Column(UUID(as_uuid=True), ForeignKey("contractor_leads.id"), nullable=False)
    contractor_id  = Column(UUID(as_uuid=True), ForeignKey("contractor_profiles.id"), nullable=False)
    quote_amount   = Column(Numeric(10, 2), nullable=False)
    timeline_days  = Column(Integer)
    description    = Column(Text)
    attachments    = Column(JSONB, default=list)
    status         = Column(SQLEnum(QuoteStatusEnum), default=QuoteStatusEnum.PENDING)
    created_at     = Column(DateTime, default=datetime.utcnow)
    expires_at     = Column(DateTime)

    lead       = relationship("ContractorLead",    back_populates="quotations")
    contractor = relationship("ContractorProfile", back_populates="quotations")
    contract   = relationship("Contract",          back_populates="quotation", uselist=False)


class Contract(Base):
    __tablename__ = "contracts"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quotation_id = Column(UUID(as_uuid=True), ForeignKey("quotations.id"), unique=True)
    customer_id  = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    contractor_id = Column(UUID(as_uuid=True), ForeignKey("contractor_profiles.id"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    status       = Column(SQLEnum(ContractStatusEnum), default=ContractStatusEnum.ACTIVE)
    start_date   = Column(Date)
    end_date     = Column(Date)
    contract_doc_url = Column(String(512))     # S3 PDF
    created_at   = Column(DateTime, default=datetime.utcnow)

    quotation   = relationship("Quotation",          back_populates="contract")
    customer    = relationship("User",               foreign_keys=[customer_id])
    contractor  = relationship("ContractorProfile",  foreign_keys=[contractor_id])
    milestones  = relationship("ContractMilestone",  back_populates="contract")


class ContractMilestone(Base):
    __tablename__ = "contract_milestones"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id"), nullable=False)
    title       = Column(String(255), nullable=False)
    description = Column(Text)
    amount      = Column(Numeric(10, 2), nullable=False)
    status      = Column(SQLEnum(MilestoneStatusEnum), default=MilestoneStatusEnum.PENDING)
    due_date    = Column(Date)
    completed_at = Column(DateTime)

    contract = relationship("Contract", back_populates="milestones")


# ─────────────────────────────────────────────────────────────────────────────
# REVIEWS & COMPLAINTS
# ─────────────────────────────────────────────────────────────────────────────

class Rating(Base):
    __tablename__ = "ratings"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id  = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), unique=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"),    nullable=False)
    partner_id  = Column(UUID(as_uuid=True), ForeignKey("partners.id"), nullable=True)
    service_package_id  = Column(UUID(as_uuid=True), ForeignKey("service_packages.id"), nullable=False)
    rating      = Column(Integer, nullable=False)    # 1-5
    comment     = Column(Text)
    photos      = Column(JSONB, default=list)
    # Partner counter-review
    partner_reply = Column(Text)
    partner_replied_at = Column(DateTime)
    created_at  = Column(DateTime, default=datetime.utcnow)

    booking  = relationship("Booking",  back_populates="review")
    customer = relationship("User",     foreign_keys=[customer_id])
    partner  = relationship("Partner",  foreign_keys=[partner_id])
    service  = relationship("ServicePackage",  back_populates="reviews")


class Complaint(Base):
    __tablename__ = "complaints"
    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id          = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=True, unique=True)
    filed_by_id         = Column(UUID(as_uuid=True), ForeignKey("users.id"),    nullable=False)
    filed_by_role       = Column(String(20), nullable=False)     # CUSTOMER / PARTNER
    against_partner_id  = Column(UUID(as_uuid=True), ForeignKey("partners.id"), nullable=True)
    against_customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"),    nullable=True)
    complaint_type      = Column(SQLEnum(ComplaintTypeEnum), nullable=False)
    subject             = Column(String(255), nullable=False)
    description         = Column(Text, nullable=False)
    attachments         = Column(JSONB, default=list)
    status              = Column(SQLEnum(ComplaintStatusEnum), default=ComplaintStatusEnum.OPEN)
    resolution_note     = Column(Text)
    assigned_to         = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"), nullable=True)
    created_at          = Column(DateTime, default=datetime.utcnow)
    resolved_at         = Column(DateTime)

    booking         = relationship("Booking",  back_populates="complaint")
    filed_by        = relationship("User",     back_populates="complaints",         foreign_keys=[filed_by_id])
    against_partner = relationship("Partner",  back_populates="complaints",         foreign_keys=[against_partner_id])
    against_customer = relationship("User",    foreign_keys=[against_customer_id])


# ─────────────────────────────────────────────────────────────────────────────
# NOTIFICATIONS
# ─────────────────────────────────────────────────────────────────────────────

class Notification(Base):
    """Persisted notification record for in-app notification centre."""
    __tablename__ = "notifications"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id     = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    booking_id  = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=True)
    title       = Column(String(255), nullable=False)
    body        = Column(Text, nullable=False)
    notif_type  = Column(SQLEnum(NotificationTypeEnum), default=NotificationTypeEnum.IN_APP)
    status      = Column(SQLEnum(NotificationStatusEnum), default=NotificationStatusEnum.PENDING)
    data        = Column(JSONB, default=dict)     # extra payload (booking_id etc.)
    is_read     = Column(Boolean, default=False)
    created_at  = Column(DateTime, default=datetime.utcnow)
    sent_at     = Column(DateTime)

    user    = relationship("User", foreign_keys=[user_id])
    booking = relationship("Booking", back_populates="notifications")


# ─────────────────────────────────────────────────────────────────────────────
# AUDIT LOGS
# ─────────────────────────────────────────────────────────────────────────────

class AuditLog(Base):
    """
    Append-only audit log for security events.
    HMAC signatures ensure immutability / tamper detection.
    """
    __tablename__ = "audit_logs"
    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(String(100), nullable=False, index=True)
    user_id    = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    service    = Column(String(100), nullable=False)
    ip_address = Column(String(50))
    payload    = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    signature  = Column(String(512), nullable=False)    # HMAC of content

    user = relationship("User", foreign_keys=[user_id])


# ─────────────────────────────────────────────────────────────────────────────
# LEGACY COMPAT (kept to avoid import breaks in older services)
# ─────────────────────────────────────────────────────────────────────────────

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id  = Column(UUID(as_uuid=True), ForeignKey("bookings.id"))
    sender_id   = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    receiver_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    content     = Column(Text, nullable=False)
    created_at  = Column(DateTime, default=datetime.utcnow)

    booking  = relationship("Booking", back_populates="chat_messages", foreign_keys=[booking_id])
    sender   = relationship("User",    foreign_keys=[sender_id])
    receiver = relationship("User",    foreign_keys=[receiver_id])


class Quote(Base):
    """Legacy pay-per-quote model (keep for existing booking service)."""
    __tablename__ = "quotes"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id   = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False)
    partner_id   = Column(UUID(as_uuid=True), ForeignKey("partners.id"), nullable=False)
    quote_amount = Column(Float, nullable=False)
    message      = Column(Text)
    status       = Column(SQLEnum(QuoteStatusEnum), default=QuoteStatusEnum.PENDING)
    created_at   = Column(DateTime, default=datetime.utcnow)

    booking = relationship("Booking", foreign_keys=[booking_id])
    partner = relationship("Partner", foreign_keys=[partner_id])