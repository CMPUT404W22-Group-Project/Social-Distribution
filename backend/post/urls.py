from django.urls import path, include
from .views import PostListAPIView, PostDetailAPIView


urlpatterns = [
    path('authors/<author_id>/posts/',
         PostListAPIView.as_view(), name='postList'),
    path('authors/<author_id>/posts/<post_id>/',
         PostDetailAPIView.as_view(), name='postbyid'),
]
