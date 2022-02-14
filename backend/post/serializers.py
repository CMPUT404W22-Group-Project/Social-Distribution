from rest_framework import serializers
from .models import Post, Author, CommentsSrc, Comment


class PostSerializer(serializers.ModelSerializer):
    def get_author(self, author_id):
        post_author = Author.objects.get(author_id=author_id)
        return post_author

    def get_commentSrc(self, post_id):
        commentsSrc = CommentsSrc.objects.get(post_id=post_id)
        return commentsSrc

    class Meta:
        model = Post
        fields = "__all__"


class CommentsSrcSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentsSrc
        fields = "__all__"
