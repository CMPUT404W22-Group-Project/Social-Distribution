from django.urls import path, include
from .views import AuthorListAPIView, AuthorDetailAPIView


urlpatterns = [
    path('', AuthorListAPIView.as_view(), name='authors'),
    path('<author_id>/', AuthorDetailAPIView.as_view(), name='authorbyid'),
]
