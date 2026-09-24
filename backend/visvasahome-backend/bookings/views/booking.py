import random, string
from decimal import Decimal

from django.db import transaction
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking, BookingStatusLog
from bookings.serializers import BookingSerializer, CreateBookingSerializer
from services.models import ServicePackage, ServicePricing


TAX_RATE = Decimal('0.18')   # 18% GST


class BookingListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'provider':
            return Booking.objects.filter(provider__user=user).select_related(
                'service', 'provider__user', 'customer')
        return Booking.objects.filter(customer=user).select_related(
            'service', 'provider__user')


class CreateBookingView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        serializer = CreateBookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Get service
        try:
            service = ServicePackage.objects.get(id=data['service_package_id'], is_active=True)
        except ServicePackage.DoesNotExist:
            return Response({'error': 'ServicePackage not found or unavailable.'},
                            status=status.HTTP_404_NOT_FOUND)

        # Get city pricing
        pricing = ServicePricing.objects.filter(
            service=service, city=data['city'], is_active=True
        ).first()
        if not pricing:
            return Response({'error': f"ServicePackage not available in {data['city']}."},
                            status=status.HTTP_400_BAD_REQUEST)

        base = pricing.effective_price
        discount = Decimal('0')

        # Apply wallet if requested
        if data.get('use_wallet') and request.user.wallet_balance > 0:
            wallet_use = min(request.user.wallet_balance, base)
            discount += wallet_use

        taxable = base - discount
        tax = (taxable * TAX_RATE).quantize(Decimal('0.01'))
        total = taxable + tax

        # Generate start OTP
        start_otp = ''.join(random.choices(string.digits, k=6))

        booking = Booking.objects.create(
            customer=request.user,
            service=service,
            service_pricing=pricing,
            booking_type=data['booking_type'],
            scheduled_at=data.get('scheduled_at'),
            address_line=data['address_line'],
            city=data['city'],
            pincode=data['pincode'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            notes=data.get('notes', ''),
            base_amount=base,
            discount_amount=discount,
            tax_amount=tax,
            total_amount=total,
            start_otp=start_otp,
        )

        # Deduct wallet if used
        if data.get('use_wallet') and discount > 0:
            request.user.wallet_balance -= discount
            request.user.save(update_fields=['wallet_balance'])

        # Log status change
        BookingStatusLog.objects.create(
            booking=booking,
            to_status=Booking.Status.PENDING,
            changed_by=request.user,
            note='Booking created',
        )

        # Trigger provider matching via Celery
        from notifications.tasks import match_provider_for_booking
        match_provider_for_booking.delay(str(booking.id))

        return Response({
            'booking': BookingSerializer(booking).data,
            'start_otp': start_otp,   # Send this to customer via SMS
            'message': 'Booking created. Finding a provider near you...',
        }, status=status.HTTP_201_CREATED)


class BookingDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'provider':
            return Booking.objects.filter(provider__user=user)
        return Booking.objects.filter(customer=user)


class VerifyStartOTPView(APIView):
    """Provider verifies OTP from customer to mark job as started"""
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        try:
            booking = Booking.objects.get(
                id=booking_id,
                provider__user=request.user,
                status=Booking.Status.PROVIDER_ASSIGNED,
            )
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        otp = request.data.get('otp', '')
        if booking.start_otp != otp:
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        booking.start_otp_verified = True
        booking.status = Booking.Status.OTP_VERIFIED
        booking.save(update_fields=['start_otp_verified', 'status'])

        BookingStatusLog.objects.create(
            booking=booking,
            from_status=Booking.Status.PROVIDER_ASSIGNED,
            to_status=Booking.Status.OTP_VERIFIED,
            changed_by=request.user,
            note='Job started — OTP verified',
        )
        return Response({'message': 'Job started successfully.'})
