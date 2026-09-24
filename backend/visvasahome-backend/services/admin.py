from django.contrib import admin
from services.models import ServiceCategory, ServicePackage, ServicePricing, Rating


@admin.register(ServiceCategory)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'display_order']
    prepopulated_fields = {'slug': ('name',)}


class PricingInline(admin.TabularInline):
    model = ServicePricing
    extra = 1

@admin.register(ServicePackage)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'booking_type', 'estimated_duration_mins', 'is_active']
    list_filter = ['category', 'booking_type', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [PricingInline]

@admin.register(Rating)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['customer', 'provider', 'rating', 'created_at']
    list_filter = ['rating']
