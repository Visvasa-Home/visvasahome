from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from accounts.models import ServiceProvider
from accounts.serializers import ProviderSerializer, ProviderOnboardingSerializer


class ProviderOnboardingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if hasattr(request.user, 'provider_profile'):
            return Response({'error': 'Provider profile already exists.'},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = ProviderOnboardingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        provider = serializer.save(user=request.user)
        request.user.role = 'provider'
        request.user.save(update_fields=['role'])
        return Response({
            'message': 'Provider profile submitted for review.',
            'provider_id': str(provider.id),
        }, status=status.HTTP_201_CREATED)

    def patch(self, request):
        provider = getattr(request.user, 'provider_profile', None)
        if not provider:
            return Response({'error': 'No provider profile found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProviderOnboardingSerializer(provider, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ProviderListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProviderSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'is_available']

    def get_queryset(self):
        return ServiceProvider.objects.filter(status='approved').select_related('user')
