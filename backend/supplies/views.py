from rest_framework import generics
from .models import Supply
from .serializers import SupplySerializer
from rest_framework.permissions import IsAuthenticated

class SupplyListCreateView(generics.ListCreateAPIView):
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    permission_classes = [IsAuthenticated]

class SupplyDetailView(generics.RetrieveUpdateAPIView):
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    permission_classes = [IsAuthenticated]