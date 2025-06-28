from rest_framework import viewsets
from .models import Supply
from .serializers import SupplySerializer
from rest_framework.permissions import IsAuthenticated



class SupplyViewSet(viewsets.ModelViewSet):
    queryset = Supply.objects.all().order_by('-date_supplied')
    serializer_class = SupplySerializer
    permission_classes = [IsAuthenticated]