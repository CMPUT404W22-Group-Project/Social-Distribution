from django.shortcuts import render
from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ProfileSerializer
from .models import Author
# Create your views here.


class AuthorListAPIView(APIView):
    """
    List all author, or create a new author.
    """

    def get(self, request):
        author = Author.objects.all()
        serializer = ProfileSerializer(author, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AuthorDetailAPIView(APIView):
    """
    Retrieve, update or delete a author instance.
    """

    def get_object(self, id):
        try:
            return Author.objects.get(id=id)
        except Author.DoesNotExist:
            raise Http404

    def get(self, request, id, format=None):
        author = self.get_object(id)
        serializer = ProfileSerializer(author)
        return Response(serializer.data)

    def put(self, request, id, format=None):
        author = self.get_object(id)
        serializer = ProfileSerializer(author, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, format=None):
        author = self.get_object(id)
        author.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
