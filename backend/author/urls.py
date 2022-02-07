from django.urls import path, include
from .views import AuthorListAPIView, AuthorDetailAPIView


urlpatterns = [
    path('author', AuthorListAPIView.as_view(), name='authors'),
    path('authors/<int:pk>/', AuthorDetailAPIView.as_view(), name='authorbyid'),
]
