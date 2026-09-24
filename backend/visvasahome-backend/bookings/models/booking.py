import uuid
from django.db import models
from django.conf import settings


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        PROVIDER_ASSIGNED = 'provider_assigned', 'Provider Assigned'
        EN_ROUTE = 'en_route', 'Provider En Route'
        OTP_VERIFIED = 'otp_verified', 'OTP Verified — Job Started'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'
        FAILED = 'failed', 'Failed'

    class BookingType(models.TextChoices):
        INSTANT = 'instant', 'Instant'
        SCHEDULED = 'scheduled', 'Scheduled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_number = models.CharField(max_length=20, unique=True, blank=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='bookings')
    provider = models.ForeignKey('accounts.ServiceProvider', null=True, blank=True, on_delete=models.SET_NULL, related_name='bookings')
    service = models.ForeignKey('services.ServicePackage', on_delete=models.PROTECT)
    service_pricing = models.ForeignKey('services.ServicePricing', null=True, on_delete=models.SET_NULL)

    status = models.CharField(max_length=25, choices=Status.choices, default=Status.PENDING)
    booking_type = models.CharField(max_length=20, choices=BookingType.choices, default=BookingType.INSTANT)
    scheduled_at = models.DateTimeField(null=True, blank=True)

    # Address
    address_line = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)

    # Pricing snapshot (stored at booking time, never changes)
    base_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # OTP for job start verification
    start_otp = models.CharField(max_length=6, blank=True)
    start_otp_verified = models.BooleanField(default=False)

    notes = models.TextField(blank=True)
    cancellation_reason = models.TextField(blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.booking_number:
            import random, string
            self.booking_number = 'VH' + ''.join(random.choices(string.digits, k=8))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_number} — {self.service.name}"

    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['customer', 'status']),
            models.Index(fields=['provider', 'status']),
            models.Index(fields=['status', 'city']),
            models.Index(fields=['booking_number']),
            models.Index(fields=['scheduled_at']),
        ]


class BookingStatusLog(models.Model):
    """Full audit trail of every status change"""
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='status_logs')
    from_status = models.CharField(max_length=25, blank=True)
    to_status = models.CharField(max_length=25)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'booking_status_logs'
        ordering = ['created_at']
