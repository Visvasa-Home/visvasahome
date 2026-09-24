import uuid
from django.db import models


class ServiceCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.ImageField(upload_to='category_icons/', blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'service_categories'
        ordering = ['display_order', 'name']
        verbose_name_plural = 'ServicePackage Categories'


class ServicePackage(models.Model):
    class BookingType(models.TextChoices):
        INSTANT = 'instant', 'Instant Booking'
        SCHEDULED = 'scheduled', 'Scheduled Booking'
        BOTH = 'both', 'Both'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)
    image = models.ImageField(upload_to='services/', blank=True)
    booking_type = models.CharField(max_length=20, choices=BookingType.choices, default=BookingType.BOTH)
    is_active = models.BooleanField(default=True)
    estimated_duration_mins = models.IntegerField(default=60)
    includes = models.JSONField(default=list)    # What's included
    excludes = models.JSONField(default=list)    # What's not included
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category.name} — {self.name}"

    class Meta:
        db_table = 'services'
        indexes = [
            models.Index(fields=['category', 'is_active']),
        ]


class ServicePricing(models.Model):
    """City-wise pricing — same service can cost differently in Mumbai vs Jaipur"""
    service = models.ForeignKey(ServicePackage, on_delete=models.CASCADE, related_name='pricing')
    city = models.CharField(max_length=100)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def effective_price(self):
        return self.discounted_price or self.base_price

    class Meta:
        db_table = 'service_pricing'
        unique_together = ('service', 'city')
        indexes = [models.Index(fields=['service', 'city', 'is_active'])]
