from rest_framework import viewsets
from .models import Supplier
from .serializers import SupplierSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import Supplier
from django.db import transaction
from .serializers import SupplySerializer
from products.models import Product

class SupplierListCreateView(generics.ListCreateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all().order_by('name')
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]

class SupplierDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]


class SupplyListCreateView(generics.ListCreateAPIView):
    from supplies.models import Supply 
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        product_name = data.get('product_name') or data.get('productName') or ''
        product_id = data.get('product') or data.get('product_id')
        try:
            qty = int(data.get('quantity') or 0)
        except Exception:
            try:
                qty = int(float(data.get('quantity') or 0))
            except Exception:
                qty = 0

        with transaction.atomic():
            product = None
            if product_id:
                try:
                    product = Product.objects.get(pk=product_id)
                except Product.DoesNotExist:
                    product = None

            if not product and product_name:
                product = Product.objects.filter(name__iexact=product_name).first()
                if not product:
                    product = Product.objects.filter(name__icontains=product_name).first()

            if not product and product_name:
                product = Product.objects.create(name=product_name)

            if product:
                data['product'] = product.id

                for fld in ('quantity', 'stock', 'amount', 'inventory'):
                    if hasattr(product, fld):
                        try:
                            cur = getattr(product, fld) or 0
                            new = cur + qty
                            setattr(product, fld, new)
                            product.save(update_fields=[fld])
                        except Exception:
                            pass
                        break

            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)