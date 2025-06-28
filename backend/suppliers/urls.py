from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)

urlpatterns = [
    path('', include(router.urls)),
]