from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from decimal import Decimal, InvalidOperation
from django.db import transaction, DataError, IntegrityError, DatabaseError

from .models import Supply
from .serializers import SupplySerializer
from products.models import Product


class SupplyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET / PUT / DELETE for a single Supply instance.
    Matches the usual ListCreate view used for collection endpoints.
    """
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    permission_classes = [IsAuthenticated]


class SupplyListCreateView(generics.ListCreateAPIView):
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        product_name = (data.get('product_name') or '').strip()
        product_id = data.get('product') or data.get('product_id')

        try:
            qty = int(data.get('quantity') or 0)
        except Exception:
            try:
                qty = int(float(data.get('quantity') or 0))
            except Exception:
                qty = 0

        MIN_QTY = 0
        MAX_QTY = 2_147_483_647
        if qty < MIN_QTY or qty > MAX_QTY:
            return Response({'quantity': f'Quantity out of range ({MIN_QTY}..{MAX_QTY})'},
                            status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            product = None

            if product_id:
                try:
                    product = Product.objects.get(pk=product_id)
                except Product.DoesNotExist:
                    return Response({'product': 'Product id not found'}, status=status.HTTP_400_BAD_REQUEST)

            if not product and product_name:
                product = Product.objects.filter(name__iexact=product_name).first()
                if not product:
                    product = Product.objects.filter(name__icontains=product_name).first()

            if product is None:
                return Response(
                    {'error': f'Product \"{product_name or product_id}\" does not exist'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            data['product'] = product.id

            for fld in ('quantity', 'stock', 'inventory', 'amount'):
                if hasattr(product, fld):
                    try:
                        cur = getattr(product, fld) or 0
                        new_val = cur + qty
                        if new_val < MIN_QTY or new_val > MAX_QTY:
                            transaction.set_rollback(True)
                            return Response(
                                {'error': f'Updated product {fld} out of allowed range ({MIN_QTY}..{MAX_QTY}).'},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        setattr(product, fld, new_val)
                        product.save(update_fields=[fld])
                    except (DataError, IntegrityError, DatabaseError) as exc:
                        transaction.set_rollback(True)
                        return Response(
                            {'error': 'Database error while updating product (numeric value may be out of range).'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    except Exception:
                        pass
                    break

            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
