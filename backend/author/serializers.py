from rest_framework import serializers
from .models import Author
from urllib.parse import urlparse


class ProfileSerializer(serializers.ModelSerializer):
    def create(self, validated_data, author_id):
        author_id = validated_data.pop('author_id')
        author, created = Author.objects.update_or_create(
            author_id=author_id, defaults=validated_data)
        return author
# urlparse(id).path.split('/')[2]

    class Meta:
        model = Author

        # fields =
        fields = ['id', 'type', 'host',
                  'displayName', 'github', 'profileImage']
