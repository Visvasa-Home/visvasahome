from rest_framework import serializers
from bookings.models import Booking, BookingStatusLog
from services.serializers import ServiceSerializer


class BookingSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)
    provider_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'booking_number', 'service_name', 'provider_name',
                  'status', 'status_display', 'booking_type', 'scheduled_at',
                  'address_line', 'city', 'pincode', 'base_amount', 'discount_amount',
                  'tax_amount', 'total_amount', 'notes', 'created_at', 'completed_at']
        read_only_fields = ['id', 'booking_number', 'base_amount', 'discount_amount',
                            'tax_amount', 'total_amount', 'created_at']

    def get_provider_name(self, obj):
        if obj.provider:
            return obj.provider.user.full_name
        return None


class CreateBookingSerializer(serializers.Serializer):
    service_package_id = serializers.UUIDField()
    booking_type = serializers.ChoiceField(choices=['instant', 'scheduled'])
    scheduled_at = serializers.DateTimeField(required=False, allow_null=True)
    address_line = serializers.CharField()
    city = serializers.CharField()
    pincode = serializers.CharField(max_length=10)
    latitude = serializers.DecimalField(max_digits=10, decimal_places=7)
    longitude = serializers.DecimalField(max_digits=10, decimal_places=7)
    notes = serializers.CharField(required=False, allow_blank=True)
    use_wallet = serializers.BooleanField(default=False)

    def validate(self, data):
        if data['booking_type'] == 'scheduled' and not data.get('scheduled_at'):
            raise serializers.ValidationError({'scheduled_at': 'Required for scheduled bookings.'})
        return data
