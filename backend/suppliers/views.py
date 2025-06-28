from rest_framework import viewsets
from .models import Supplier
from .serializers import SupplierSerializer
from rest_framework.permissions import IsAuthenticated


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all().order_by('name')
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]