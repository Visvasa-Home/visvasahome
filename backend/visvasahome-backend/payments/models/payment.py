import uuid
from django.db import models
from django.conf import settings


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CAPTURED = 'captured', 'Captured'
        FAILED = 'failed', 'Failed'
        REFUNDED = 'refunded', 'Refunded'
        PARTIALLY_REFUNDED = 'partially_refunded', 'Partially Refunded'

    class Method(models.TextChoices):
        UPI = 'upi', 'UPI'
        CARD = 'card', 'Card'
        NETBANKING = 'netbanking', 'Net Banking'
        WALLET = 'wallet', 'Wallet'
        BNPL = 'bnpl', 'Buy Now Pay Later'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='payments')
    booking = models.ForeignKey('bookings.Booking', null=True, blank=True, on_delete=models.SET_NULL, related_name='payments')
    amc_contract = models.ForeignKey('bookings.AMCContract', null=True, blank=True, on_delete=models.SET_NULL)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=5, default='INR')
    status = models.CharField(max_length=25, choices=Status.choices, default=Status.PENDING)
    method = models.CharField(max_length=20, choices=Method.choices, blank=True)
    # Razorpay fields
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    razorpay_signature = models.CharField(max_length=200, blank=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    refund_id = models.CharField(max_length=100, blank=True)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"₹{self.amount} — {self.status}"

    class Meta:
        db_table = 'payments'
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['razorpay_order_id']),
            models.Index(fields=['booking']),
        ]


class WalletTransaction(models.Model):
    class TxnType(models.TextChoices):
        CREDIT = 'credit', 'Credit'
        DEBIT = 'debit', 'Debit'

    class Reason(models.TextChoices):
        REFERRAL = 'referral', 'Referral Bonus'
        LOYALTY = 'loyalty', 'Loyalty Points Redeemed'
        REFUND = 'refund', 'Refund'
        BOOKING = 'booking', 'Booking Payment'
        ADMIN = 'admin', 'Admin Adjustment'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet_transactions')
    txn_type = models.CharField(max_length=10, choices=TxnType.choices)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.CharField(max_length=20, choices=Reason.choices)
    reference_id = models.CharField(max_length=100, blank=True)
    balance_after = models.DecimalField(max_digits=10, decimal_places=2)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'wallet_transactions'
        ordering = ['-created_at']
        indexes = [models.Index(fields=['user', 'created_at'])]
