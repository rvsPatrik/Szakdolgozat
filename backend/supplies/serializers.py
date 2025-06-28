from rest_framework import serializers
from .models import Supply

class SupplySerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Supply
        fields = ['id', 'supplier', 'supplier_name', 'product', 'product_name', 'quantity', 'date_supplied', 'note']