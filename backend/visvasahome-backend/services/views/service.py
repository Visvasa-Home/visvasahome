from rest_framework import generics
from rest_framework.permissions import AllowAny
from services.models import ServiceCategory, ServicePackage
from services.serializers import ServiceCategorySerializer, ServiceSerializer


class ServiceCategoryListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ServiceCategorySerializer
    queryset = ServiceCategory.objects.filter(is_active=True).prefetch_related('services')


class ServiceListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ServiceSerializer

    def get_queryset(self):
        qs = ServicePackage.objects.filter(is_active=True).select_related('category').prefetch_related('pricing')
        category = self.request.query_params.get('category')
        city = self.request.query_params.get('city')
        if category:
            qs = qs.filter(category__slug=category)
        if city:
            qs = qs.filter(pricing__city=city, pricing__is_active=True)
        return qs


class ServiceDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = ServiceSerializer
    queryset = ServicePackage.objects.filter(is_active=True).prefetch_related('pricing')
    lookup_field = 'slug'
