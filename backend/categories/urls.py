from django.urls import path
from .views import CategoryListCreateView, CategoryDetailView

urlpatterns = [
    path('', CategoryListCreateView.as_view()),
    path('<int:pk>/', CategoryDetailView.as_view()),  # This enables GET/PUT for a single category
]