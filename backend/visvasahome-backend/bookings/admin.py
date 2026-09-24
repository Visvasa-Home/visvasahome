from django.contrib import admin
from bookings.models import Booking, BookingStatusLog, AMCPackage, AMCContract, AMCVisit


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_number', 'customer', 'service', 'provider', 'status', 'total_amount', 'city', 'created_at']
    list_filter = ['status', 'booking_type', 'city']
    search_fields = ['booking_number', 'customer__phone', 'customer__full_name']
    ordering = ['-created_at']
    readonly_fields = ['booking_number', 'created_at', 'updated_at']


@admin.register(AMCPackage)
class AMCPackageAdmin(admin.ModelAdmin):
    list_display = ['name', 'service', 'price', 'visits_per_year', 'validity_months', 'is_active']
    list_filter = ['is_active', 'service']


@admin.register(AMCContract)
class AMCContractAdmin(admin.ModelAdmin):
    list_display = ['contract_number', 'customer', 'package', 'status', 'start_date', 'end_date', 'visits_used']
    list_filter = ['status']
    search_fields = ['contract_number', 'customer__phone']
