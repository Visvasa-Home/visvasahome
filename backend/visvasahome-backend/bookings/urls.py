from django.urls import path
from bookings.views import (BookingListView, CreateBookingView,
                             BookingDetailView, VerifyStartOTPView,
                             AMCPackageListView, AMCContractView)

urlpatterns = [
    path('', BookingListView.as_view(), name='booking-list'),
    path('create/', CreateBookingView.as_view(), name='booking-create'),
    path('<uuid:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('<uuid:booking_id>/verify-otp/', VerifyStartOTPView.as_view(), name='booking-verify-otp'),
    path('amc/packages/', AMCPackageListView.as_view(), name='amc-packages'),
    path('amc/contracts/', AMCContractView.as_view(), name='amc-contracts'),
]
