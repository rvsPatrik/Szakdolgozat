from django.urls import path
from .views import SupplyListCreateView, SupplyDetailView

urlpatterns = [
    path('', SupplyListCreateView.as_view()),
    path('<int:pk>/', SupplyDetailView.as_view()),  # Enables GET/PUT for a single supply
]