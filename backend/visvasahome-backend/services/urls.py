from django.urls import path
from services.views import ServiceCategoryListView, ServiceListView, ServiceDetailView

urlpatterns = [
    path('categories/', ServiceCategoryListView.as_view(), name='service-categories'),
    path('', ServiceListView.as_view(), name='service-list'),
    path('<slug:slug>/', ServiceDetailView.as_view(), name='service-detail'),
]
