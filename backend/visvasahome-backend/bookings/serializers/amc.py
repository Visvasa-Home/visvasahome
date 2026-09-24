from rest_framework import serializers
from bookings.models import AMCPackage, AMCContract, AMCVisit


class AMCPackageSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)

    class Meta:
        model = AMCPackage
        fields = ['id', 'name', 'service_name', 'description', 'price',
                  'visits_per_year', 'validity_months', 'includes', 'is_active']


class AMCVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = AMCVisit
        fields = ['id', 'visit_number', 'scheduled_date', 'status',
                  'technician_notes', 'completed_at']


class AMCContractSerializer(serializers.ModelSerializer):
    package_name = serializers.CharField(source='package.name', read_only=True)
    visits_remaining = serializers.IntegerField(read_only=True)
    visits = AMCVisitSerializer(many=True, read_only=True)

    class Meta:
        model = AMCContract
        fields = ['id', 'contract_number', 'package_name', 'status',
                  'start_date', 'end_date', 'address_line', 'city',
                  'visits_used', 'visits_remaining', 'amount_paid',
                  'pdf_url', 'visits', 'created_at']
        read_only_fields = ['contract_number', 'visits_used', 'pdf_url', 'created_at']
