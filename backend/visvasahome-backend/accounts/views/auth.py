import random
import string
from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User, OTPVerification
from accounts.serializers import SendOTPSerializer, VerifyOTPSerializer, UserProfileSerializer


def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))


def send_sms_otp(phone, otp):
    """
    Send OTP via MSG91.
    Replace with actual MSG91 API call once you have credentials.
    """
    from django.conf import settings
    import requests
    if not settings.MSG91_API_KEY:
        # Dev mode — just print
        print(f"[DEV OTP] {phone}: {otp}")
        return True
    payload = {
        "template_id": "your_template_id",
        "mobile": phone,
        "authkey": settings.MSG91_API_KEY,
        "otp": otp,
    }
    try:
        resp = requests.post("https://control.msg91.com/api/v5/otp", json=payload, timeout=5)
        return resp.status_code == 200
    except Exception:
        return False


class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        purpose = serializer.validated_data['purpose']

        # Rate limit — max 5 OTPs per phone per 10 min
        recent = OTPVerification.objects.filter(
            phone=phone,
            created_at__gte=timezone.now() - timedelta(minutes=10)
        ).count()
        if recent >= 5:
            return Response({'error': 'Too many OTP requests. Try after 10 minutes.'},
                            status=status.HTTP_429_TOO_MANY_REQUESTS)

        otp = generate_otp()
        OTPVerification.objects.create(
            phone=phone,
            otp=otp,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=10),
        )
        send_sms_otp(phone, otp)
        return Response({'message': 'OTP sent successfully', 'phone': phone})


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        phone = data['phone']
        otp = data['otp']

        # Fetch latest unused OTP for this phone
        otp_obj = OTPVerification.objects.filter(
            phone=phone, is_used=False, purpose=data['purpose']
        ).order_by('-created_at').first()

        if not otp_obj:
            return Response({'error': 'OTP not found. Request a new one.'},
                            status=status.HTTP_400_BAD_REQUEST)

        otp_obj.attempts += 1
        otp_obj.save(update_fields=['attempts'])

        if not otp_obj.is_valid():
            return Response({'error': 'OTP expired or maximum attempts reached.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if otp_obj.otp != otp:
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark OTP used
        otp_obj.is_used = True
        otp_obj.save(update_fields=['is_used'])

        # Get or create user
        user, created = User.objects.get_or_create(phone=phone)
        if created or data['purpose'] == 'register':
            if data.get('full_name'):
                user.full_name = data['full_name']
            # Handle referral
            ref_code = data.get('referral_code', '').strip()
            if ref_code and not user.referred_by:
                try:
                    referrer = User.objects.get(referral_code=ref_code)
                    user.referred_by = referrer
                    # Give referrer ₹100 wallet credit via Celery task
                    from notifications.tasks import credit_referral_bonus
                    credit_referral_bonus.delay(str(referrer.id))
                except User.DoesNotExist:
                    pass
            user.is_phone_verified = True
            user.save()

        # Issue JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserProfileSerializer(user).data,
            'is_new_user': created,
        })


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass
        return Response({'message': 'Logged out successfully'})
