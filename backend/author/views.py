from django.shortcuts import render
from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ProfileSerializer
from .models import Author
import json
# Create your views here.


class AuthorListAPIView(APIView):
    """
    List all author, or create a new author.
    """

    def get(self, request):
        author = Author.objects.all()
        serializer = ProfileSerializer(author, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AuthorDetailAPIView(APIView):
    """
    Retrieve, update or delete a author instance.
    """

    def get_object(self, author_id):
        try:
            return Author.objects.get(author_id=author_id)
        except Author.DoesNotExist:
            raise Http404

    def get(self, request, author_id, format=None):
        author = self.get_object(author_id)
        serializer = ProfileSerializer(author)
        return Response(serializer.data)

    def post(self, request, author_id, format=None):
        request.data['author_id'] = author_id
        serializer = ProfileSerializer(data=request.data)
        serializer.create(request.data, author_id)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
