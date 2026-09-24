from celery import shared_task
from django.utils import timezone
from datetime import date, timedelta


@shared_task
def send_booking_confirmation(booking_id):
    """Send SMS + push notification on booking confirmation"""
    from bookings.models import Booking
    try:
        booking = Booking.objects.select_related('customer', 'service').get(id=booking_id)
        message = (
            f"Booking confirmed! ID: {booking.booking_number}. "
            f"ServicePackage: {booking.service.name}. "
            f"Total: ₹{booking.total_amount}. "
            f"Your start OTP: {booking.start_otp}"
        )
        _send_sms(booking.customer.phone, message)
    except Exception as e:
        print(f"[Celery] send_booking_confirmation failed: {e}")


@shared_task
def match_provider_for_booking(booking_id):
    """
    Find nearest available approved provider within 10km.
    In production: use PostGIS or Haversine formula for geo matching.
    """
    from bookings.models import Booking, BookingStatusLog
    from accounts.models import ServiceProvider
    try:
        booking = Booking.objects.select_related('customer').get(id=booking_id)
        providers = ServiceProvider.objects.filter(
            status='approved',
            is_available=True,
            user__city=booking.city
        ).order_by('?')[:1]   # Random for now — replace with geo sort

        if providers:
            provider = providers[0]
            booking.provider = provider
            booking.status = Booking.Status.PROVIDER_ASSIGNED
            booking.save(update_fields=['provider', 'status'])
            BookingStatusLog.objects.create(
                booking=booking,
                from_status=Booking.Status.CONFIRMED,
                to_status=Booking.Status.PROVIDER_ASSIGNED,
                note=f'Auto-matched to {provider.user.full_name}',
            )
            # Notify provider
            _send_sms(provider.user.phone,
                      f"New job alert! Booking {booking.booking_number}. "
                      f"ServicePackage: {booking.service.name}. "
                      f"Address: {booking.address_line}, {booking.city}")
    except Exception as e:
        print(f"[Celery] match_provider_for_booking failed: {e}")


@shared_task
def schedule_amc_visits(contract_id):
    """Pre-schedule all visits for an AMC contract"""
    from bookings.models import AMCContract, AMCVisit
    try:
        contract = AMCContract.objects.select_related('package').get(id=contract_id)
        visits_per_year = contract.package.visits_per_year
        interval_days = 365 // visits_per_year
        for i in range(1, visits_per_year + 1):
            visit_date = contract.start_date + timedelta(days=interval_days * i)
            AMCVisit.objects.create(
                contract=contract,
                visit_number=i,
                scheduled_date=visit_date,
            )
            # Schedule reminder 7 days before visit
            send_amc_visit_reminder.apply_async(
                args=[contract_id, i],
                eta=timezone.make_aware(
                    timezone.datetime.combine(visit_date - timedelta(days=7),
                                             timezone.datetime.min.time())
                )
            )
    except Exception as e:
        print(f"[Celery] schedule_amc_visits failed: {e}")


@shared_task
def send_amc_visit_reminder(contract_id, visit_number):
    """Send reminder 7 days before AMC visit"""
    from bookings.models import AMCContract, AMCVisit
    try:
        contract = AMCContract.objects.select_related('customer', 'package').get(id=contract_id)
        visit = AMCVisit.objects.get(contract=contract, visit_number=visit_number)
        message = (
            f"Reminder: Your AMC visit #{visit_number} for {contract.package.name} "
            f"is scheduled on {visit.scheduled_date.strftime('%d %b %Y')}. "
            f"Contract ID: {contract.contract_number}"
        )
        _send_sms(contract.customer.phone, message)
    except Exception as e:
        print(f"[Celery] send_amc_visit_reminder failed: {e}")


@shared_task
def credit_referral_bonus(referrer_id):
    """Credit ₹100 wallet bonus to referrer"""
    from accounts.models import User
    from payments.models import WalletTransaction
    try:
        referrer = User.objects.get(id=referrer_id)
        bonus = 100
        referrer.wallet_balance += bonus
        referrer.save(update_fields=['wallet_balance'])
        WalletTransaction.objects.create(
            user=referrer,
            txn_type='credit',
            amount=bonus,
            reason='referral',
            balance_after=referrer.wallet_balance,
            note='Referral bonus — friend joined Visvasahome',
        )
        _send_sms(referrer.phone, f"You earned ₹{bonus} wallet credit for referring a friend!")
    except Exception as e:
        print(f"[Celery] credit_referral_bonus failed: {e}")


@shared_task
def send_amc_renewal_reminders():
    """Daily cron: send renewal reminders 30/15/3 days before AMC expiry"""
    from bookings.models import AMCContract
    today = date.today()
    for days in [30, 15, 3]:
        target = today + timedelta(days=days)
        contracts = AMCContract.objects.filter(
            end_date=target, status=AMCContract.Status.ACTIVE
        ).select_related('customer', 'package')
        for contract in contracts:
            msg = (
                f"Your AMC '{contract.package.name}' expires in {days} days "
                f"({contract.end_date.strftime('%d %b %Y')}). "
                f"Renew now to continue uninterrupted service."
            )
            _send_sms(contract.customer.phone, msg)


def _send_sms(phone, message):
    """Internal helper — MSG91 or print in dev mode"""
    from django.conf import settings
    if not settings.MSG91_API_KEY:
        print(f"[SMS→{phone}] {message}")
        return
    import requests
    try:
        requests.post(
            "https://api.msg91.com/api/v5/flow/",
            json={
                "authkey": settings.MSG91_API_KEY,
                "mobiles": phone,
                "message": message,
                "sender": settings.MSG91_SENDER_ID,
                "route": "4",
            },
            timeout=5
        )
    except Exception as e:
        print(f"[SMS Error] {e}")
