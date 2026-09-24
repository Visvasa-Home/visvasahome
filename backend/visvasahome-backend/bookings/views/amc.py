from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import AMCPackage, AMCContract
from bookings.serializers import AMCPackageSerializer, AMCContractSerializer


class AMCPackageListView(generics.ListAPIView):
    serializer_class = AMCPackageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = AMCPackage.objects.filter(is_active=True).select_related('service')
        service_package_id = self.request.query_params.get('service_package_id')
        if service_package_id:
            qs = qs.filter(service_package_id=service_package_id)
        return qs


class AMCContractView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """List customer's AMC contracts"""
        contracts = AMCContract.objects.filter(
            customer=request.user
        ).select_related('package__service').prefetch_related('visits')
        serializer = AMCContractSerializer(contracts, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Subscribe to an AMC package"""
        package_id = request.data.get('package_id')
        try:
            package = AMCPackage.objects.get(id=package_id, is_active=True)
        except AMCPackage.DoesNotExist:
            return Response({'error': 'Package not found.'}, status=status.HTTP_404_NOT_FOUND)

        from datetime import date
        from dateutil.relativedelta import relativedelta

        start = date.today()
        end = start + relativedelta(months=package.validity_months)

        contract = AMCContract.objects.create(
            customer=request.user,
            package=package,
            start_date=start,
            end_date=end,
            address_line=request.data.get('address_line', ''),
            city=request.data.get('city', ''),
            amount_paid=package.price,
        )

        # Pre-schedule visits via Celery
        from notifications.tasks import schedule_amc_visits
        schedule_amc_visits.delay(str(contract.id))

        return Response({
            'contract': AMCContractSerializer(contract).data,
            'message': 'AMC contract created. Visits will be scheduled shortly.',
        }, status=status.HTTP_201_CREATED)
