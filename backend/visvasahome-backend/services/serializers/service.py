from rest_framework import serializers
from services.models import ServiceCategory, ServicePackage, ServicePricing


class ServicePricingSerializer(serializers.ModelSerializer):
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    class Meta:
        model = ServicePricing
        fields = ['city', 'base_price', 'discounted_price', 'effective_price']


class ServiceSerializer(serializers.ModelSerializer):
    pricing = ServicePricingSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    class Meta:
        model = ServicePackage
        fields = ['id', 'name', 'slug', 'category_name', 'description',
                  'short_description', 'image', 'booking_type', 'estimated_duration_mins',
                  'includes', 'excludes', 'pricing']


class ServiceCategorySerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'icon', 'description', 'services']
