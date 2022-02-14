from rest_framework import serializers
from .models import Author


class ProfileSerializer(serializers.ModelSerializer):
    def create(self, validated_data, author_id):
        author_id = validated_data.pop('author_id')
        author, created = Author.objects.update_or_create(
            author_id=author_id, defaults=validated_data)
        return author

    class Meta:
        model = Author

        # fields = ['id','type', 'host', 'displayName', 'github', 'profileImage']
        fields = "__all__"
