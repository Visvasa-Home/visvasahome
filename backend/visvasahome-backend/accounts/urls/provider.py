from django.urls import path
from accounts.views import ProviderOnboardingView, ProviderListView

urlpatterns = [
    path('', ProviderListView.as_view(), name='provider-list'),
    path('onboard/', ProviderOnboardingView.as_view(), name='provider-onboard'),
]
