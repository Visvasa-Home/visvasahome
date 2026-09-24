from rest_framework import serializers
from accounts.models import User


class SendOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    purpose = serializers.ChoiceField(choices=['login', 'register'], default='login')

    def validate_phone(self, value):
        import re
        if not re.match(r'^\+?[1-9]\d{9,14}$', value):
            raise serializers.ValidationError('Invalid phone number.')
        return value


class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6, min_length=4)
    purpose = serializers.ChoiceField(choices=['login', 'register'], default='login')
    full_name = serializers.CharField(max_length=150, required=False)
    referral_code = serializers.CharField(max_length=10, required=False, allow_blank=True)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone', 'email', 'full_name', 'role', 'profile_photo',
                  'city', 'wallet_balance', 'loyalty_points', 'referral_code',
                  'is_phone_verified', 'created_at']
        read_only_fields = ['id', 'phone', 'role', 'wallet_balance',
                            'loyalty_points', 'referral_code', 'created_at']
