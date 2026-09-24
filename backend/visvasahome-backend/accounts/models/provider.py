import uuid
from django.db import models
from django.conf import settings


class ServiceProvider(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending Rating'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
        SUSPENDED = 'suspended', 'Suspended'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='provider_profile')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    bio = models.TextField(blank=True)
    experience_years = models.IntegerField(default=0)
    skills = models.JSONField(default=list)          # ['AC Repair', 'Plumbing']
    service_radius_km = models.IntegerField(default=10)
    is_available = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_jobs = models.IntegerField(default=0)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    aadhar_number = models.CharField(max_length=12, blank=True)
    pan_number = models.CharField(max_length=10, blank=True)
    bank_account = models.CharField(max_length=20, blank=True)
    bank_ifsc = models.CharField(max_length=11, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Provider: {self.user.full_name}"

    class Meta:
        db_table = 'service_providers'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['is_available']),
        ]


class ProviderDocument(models.Model):
    class DocType(models.TextChoices):
        AADHAR = 'aadhar', 'Aadhar Card'
        PAN = 'pan', 'PAN Card'
        POLICE_CERT = 'police_cert', 'Police Verification'
        SKILL_CERT = 'skill_cert', 'Skill Certificate'
        PHOTO = 'photo', 'Profile Photo'

    provider = models.ForeignKey(ServiceProvider, on_delete=models.CASCADE, related_name='documents')
    doc_type = models.CharField(max_length=20, choices=DocType.choices)
    file = models.FileField(upload_to='provider_docs/')
    is_verified = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'provider_documents'
