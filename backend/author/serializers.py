from rest_framework import serializers
from .models import Author


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author

        # fields = ['id','type', 'host', 'displayName', 'github', 'profileImage']
        fields = "__all__"
