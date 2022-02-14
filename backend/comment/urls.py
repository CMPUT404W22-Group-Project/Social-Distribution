from django.urls import path, include
from .views import CommentListAPIView


urlpatterns = [
    path('', CommentListAPIView.as_view(), name='commentList'),
]
