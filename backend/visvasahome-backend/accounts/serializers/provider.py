from rest_framework import serializers
from accounts.models import ServiceProvider, ProviderDocument


class ProviderSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    profile_photo = serializers.ImageField(source='user.profile_photo', read_only=True)

    class Meta:
        model = ServiceProvider
        fields = ['id', 'full_name', 'phone', 'profile_photo', 'status',
                  'bio', 'experience_years', 'skills', 'rating', 'total_jobs',
                  'is_available', 'service_radius_km']
        read_only_fields = ['status', 'rating', 'total_jobs']


class ProviderOnboardingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProvider
        fields = ['bio', 'experience_years', 'skills', 'service_radius_km',
                  'aadhar_number', 'pan_number', 'bank_account', 'bank_ifsc']
