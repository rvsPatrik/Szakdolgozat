from rest_framework.routers import DefaultRouter
from .views import SupplyViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'supplies', SupplyViewSet)

urlpatterns = [
    path('', include(router.urls)),
]