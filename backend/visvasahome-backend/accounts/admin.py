from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from accounts.models import User, OTPVerification, ServiceProvider, ProviderDocument


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['phone', 'full_name', 'role', 'city', 'is_phone_verified', 'wallet_balance', 'created_at']
    list_filter = ['role', 'is_phone_verified', 'city', 'is_active']
    search_fields = ['phone', 'full_name', 'email']
    ordering = ['-created_at']
    fieldsets = (
        (None, {'fields': ('phone', 'full_name', 'email', 'role', 'city')}),
        ('Wallet', {'fields': ('wallet_balance', 'loyalty_points', 'referral_code')}),
        ('Status', {'fields': ('is_active', 'is_phone_verified', 'is_staff', 'is_superuser')}),
        ('Location', {'fields': ('latitude', 'longitude', 'address')}),
    )
    add_fieldsets = (
        (None, {'fields': ('phone', 'full_name', 'role')}),
    )


@admin.register(ServiceProvider)
class ServiceProviderAdmin(admin.ModelAdmin):
    list_display = ['user', 'status', 'rating', 'total_jobs', 'is_available', 'created_at']
    list_filter = ['status', 'is_available']
    search_fields = ['user__phone', 'user__full_name']
    actions = ['approve_providers', 'suspend_providers']

    def approve_providers(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f'{updated} providers approved.')
    approve_providers.short_description = 'Approve selected providers'

    def suspend_providers(self, request, queryset):
        queryset.update(status='suspended')
    suspend_providers.short_description = 'Suspend selected providers'


@admin.register(OTPVerification)
class OTPAdmin(admin.ModelAdmin):
    list_display = ['phone', 'otp', 'purpose', 'is_used', 'created_at', 'expires_at']
    list_filter = ['is_used', 'purpose']
    search_fields = ['phone']
