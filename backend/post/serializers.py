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
        fields = ['type', 'title', 'id', 'source', 'origin', 'description', 'contentType', 'content', 'author',
                  'categories', 'count', 'comment', 'commentsSrc', 'published', 'visibility', 'unlisted']


class CommentsSrcSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentsSrc
        fields = ['type', 'page', 'size', 'post', 'comments']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['type', 'author', 'comment',
                  'contentType', 'published', 'id']
