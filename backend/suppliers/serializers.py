from rest_framework import serializers
from .models import Supplier

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'



def get_supply_model():
    from supplies.models import Supply
    return Supply

class SupplySerializer(serializers.ModelSerializer):
    class Meta:
        model = get_supply_model()
        fields = ['id', 'product', 'supplier', 'quantity', 'price', 'date_supplied', 'note']
        