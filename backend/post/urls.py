from django.urls import path, include
from .views import PostListAPIView, PostDetailAPIView


urlpatterns = [
    path('', PostListAPIView.as_view(), name='postList'),
    path('<post_id>/', PostDetailAPIView.as_view(), name='postbyid'),
]
