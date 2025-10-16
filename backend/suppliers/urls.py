from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet
from django.urls import path, include
from .views import SupplierListCreateView, SupplierDetailView  

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)

urlpatterns = [
    path('', SupplierListCreateView.as_view()),
    path('<int:pk>/', SupplierDetailView.as_view()),
]