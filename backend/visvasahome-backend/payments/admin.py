from django.contrib import admin
from payments.models import Payment, WalletTransaction


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['user', 'amount', 'status', 'method', 'razorpay_order_id', 'created_at']
    list_filter = ['status', 'method']
    search_fields = ['user__phone', 'razorpay_order_id', 'razorpay_payment_id']
    readonly_fields = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']


@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'txn_type', 'amount', 'reason', 'balance_after', 'created_at']
    list_filter = ['txn_type', 'reason']
