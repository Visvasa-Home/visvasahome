import uuid
from django.db import models
from django.conf import settings


class AMCPackage(models.Model):
    """Admin creates these — e.g. 'AC Basic Plan ₹2499/year'"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    service = models.ForeignKey('services.ServicePackage', on_delete=models.CASCADE)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    visits_per_year = models.IntegerField(default=2)
    validity_months = models.IntegerField(default=12)
    includes = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} — ₹{self.price}/year"

    class Meta:
        db_table = 'amc_packages'


class AMCContract(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        EXPIRED = 'expired', 'Expired'
        CANCELLED = 'cancelled', 'Cancelled'
        RENEWAL_DUE = 'renewal_due', 'Renewal Due'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contract_number = models.CharField(max_length=20, unique=True, blank=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='amc_contracts')
    package = models.ForeignKey(AMCPackage, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    start_date = models.DateField()
    end_date = models.DateField()
    address_line = models.TextField()
    city = models.CharField(max_length=100)
    visits_used = models.IntegerField(default=0)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    pdf_url = models.URLField(blank=True)       # S3 link to generated contract PDF
    razorpay_subscription_id = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.contract_number:
            import random, string
            self.contract_number = 'AMC' + ''.join(random.choices(string.digits, k=7))
        super().save(*args, **kwargs)

    @property
    def visits_remaining(self):
        return self.package.visits_per_year - self.visits_used

    def __str__(self):
        return f"{self.contract_number} — {self.customer}"

    class Meta:
        db_table = 'amc_contracts'
        indexes = [
            models.Index(fields=['customer', 'status']),
            models.Index(fields=['end_date', 'status']),
        ]


class AMCVisit(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = 'scheduled', 'Scheduled'
        COMPLETED = 'completed', 'Completed'
        SKIPPED = 'skipped', 'Skipped'

    contract = models.ForeignKey(AMCContract, on_delete=models.CASCADE, related_name='visits')
    visit_number = models.IntegerField()
    scheduled_date = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    provider = models.ForeignKey('accounts.ServiceProvider', null=True, on_delete=models.SET_NULL)
    inspection_report_url = models.URLField(blank=True)
    technician_notes = models.TextField(blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'amc_visits'
        unique_together = ('contract', 'visit_number')
        indexes = [models.Index(fields=['scheduled_date', 'status'])]
