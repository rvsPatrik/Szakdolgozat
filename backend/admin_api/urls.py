from django.urls import path
from .views import AdminSQLView

urlpatterns = [
    path('sql/', AdminSQLView.as_view(), name='admin-sql'),
]