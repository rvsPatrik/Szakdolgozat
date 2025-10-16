from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet
from django.urls import path, include
from .views import SupplierListCreateView, SupplierDetailView  # ensure detail view import exists


router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)

urlpatterns = [
    path('', SupplierListCreateView.as_view()),       # GET list, POST create
    path('<int:pk>/', SupplierDetailView.as_view()),  # GET/PUT/PATCH/DELETE for single supplier
]