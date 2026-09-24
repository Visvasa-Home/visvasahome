import hashlib, hmac, json

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from payments.models import Payment
from bookings.models import Booking


def get_razorpay_client():
    import razorpay
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking_id')
        try:
            booking = Booking.objects.get(id=booking_id, customer=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        amount_paise = int(booking.total_amount * 100)   # Razorpay needs paise

        client = get_razorpay_client()
        order = client.order.create({
            'amount': amount_paise,
            'currency': 'INR',
            'receipt': str(booking.booking_number),
            'notes': {
                'booking_id': str(booking.id),
                'customer_phone': request.user.phone,
            }
        })

        payment = Payment.objects.create(
            user=request.user,
            booking=booking,
            amount=booking.total_amount,
            razorpay_order_id=order['id'],
        )

        return Response({
            'order_id': order['id'],
            'amount': amount_paise,
            'currency': 'INR',
            'key': settings.RAZORPAY_KEY_ID,
            'booking_number': booking.booking_number,
        })


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('razorpay_order_id')
        payment_id = request.data.get('razorpay_payment_id')
        signature = request.data.get('razorpay_signature')

        # Verify signature
        msg = f"{order_id}|{payment_id}"
        expected = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            msg.encode(),
            hashlib.sha256
        ).hexdigest()

        if expected != signature:
            return Response({'error': 'Invalid payment signature.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Update payment record
        try:
            payment = Payment.objects.get(razorpay_order_id=order_id)
            payment.razorpay_payment_id = payment_id
            payment.razorpay_signature = signature
            payment.status = Payment.Status.CAPTURED
            payment.save(update_fields=['razorpay_payment_id', 'razorpay_signature', 'status'])
        except Payment.DoesNotExist:
            return Response({'error': 'Payment record not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Confirm booking
        if payment.booking:
            booking = payment.booking
            booking.status = Booking.Status.CONFIRMED
            booking.save(update_fields=['status'])

            # Add loyalty points — 1 point per ₹100 spent
            points = int(booking.total_amount / 100)
            booking.customer.loyalty_points += points
            booking.customer.save(update_fields=['loyalty_points'])

            # Send confirmation SMS via Celery
            from notifications.tasks import send_booking_confirmation
            send_booking_confirmation.delay(str(booking.id))

        return Response({'message': 'Payment verified successfully.'})


@method_decorator(csrf_exempt, name='dispatch')
class RazorpayWebhookView(APIView):
    """Handles Razorpay webhook events — backup to frontend verification"""
    permission_classes = [AllowAny]

    def post(self, request):
        webhook_secret = settings.RAZORPAY_KEY_SECRET
        signature = request.headers.get('X-Razorpay-Signature', '')
        body = request.body

        expected = hmac.new(webhook_secret.encode(), body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, signature):
            return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

        payload = json.loads(body)
        event = payload.get('event')

        if event == 'payment.captured':
            payment_entity = payload['payload']['payment']['entity']
            order_id = payment_entity.get('order_id')
            Payment.objects.filter(
                razorpay_order_id=order_id,
                status=Payment.Status.PENDING
            ).update(status=Payment.Status.CAPTURED)

        elif event == 'payment.failed':
            order_id = payload['payload']['payment']['entity'].get('order_id')
            Payment.objects.filter(razorpay_order_id=order_id).update(
                status=Payment.Status.FAILED
            )

        return Response({'status': 'ok'})
