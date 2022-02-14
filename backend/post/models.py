from django.db import models
import uuid
from author.models import Author
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone
# Create your models here.


class Post(models.Model):
    post_id = models.CharField(
        primary_key=True, default=uuid.uuid4, max_length=100)
    type = models.CharField(max_length=4, default='post', editable=False)
    title = models.CharField(max_length=100, blank=True)
    id = models.URLField(blank=True)
    source = models.URLField(blank=True)
    origin = models.URLField(blank=True)
    description = models.CharField(max_length=200, blank=True)

    class ContentType(models.TextChoices):
        common_mark = 'text/markdown'
        utf8 = 'text/plain'
        app_base64 = 'application/base64'
        embeded_png = 'image/png;base64'
        embeded_jpge = 'image/jpeg;base64'
        html_text = 'text/html'
    contentType = models.CharField(
        max_length=20,
        choices=ContentType.choices
    )
    content = models.TextField(blank=True)
    author = models.ForeignKey(
        Author, on_delete=models.DO_NOTHING, related_name="post_owner")
    # can use user.posts.all() to get all posts
    categories = ArrayField(models.CharField(
        max_length=20, blank=True), default=list, blank=True, null=True)
    count = models.IntegerField(default=0)
    comment = models.URLField(blank=True)
    commentsSrc = models.ForeignKey(
        'CommentsSrc', on_delete=models.DO_NOTHING, related_name="commentsSrc", blank=True)
    published = models.DateTimeField(default=timezone.now)

    class VisibilityType(models.TextChoices):
        PUBLIC = 'PUBLIC'
        FRIENDS = 'FRIENDS'

    visibility = models.CharField(max_length=7, choices=VisibilityType.choices)
    unlisted = models.BooleanField(default=False)


class CommentsSrc(models.Model):
    post_id = models.CharField(
        primary_key=True, default=uuid.uuid4, max_length=100)
    type = models.CharField(max_length=8, default='comments', editable=False)
    page = models.IntegerField(default=1)
    size = models.IntegerField(default=5)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comments = models.ManyToManyField(
        'Comment', related_name='comments', blank=True)


class Comment(models.Model):
    post_id = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="comment_in_post")
    comment_id = models.CharField(
        primary_key=True, default=uuid.uuid4, max_length=100)
    id = models.URLField(blank=True)
    type = models.CharField(max_length=7, default='comment', editable=False)
    author = models.ForeignKey(
        Author, on_delete=models.DO_NOTHING, related_name="comments_owner")
    comment = models.CharField(max_length=200, blank=True)

    class ContentType(models.TextChoices):
        common_mark = 'text/markdown'
        utf8 = 'text/plain'
    contentType = models.CharField(
        max_length=13,
        choices=ContentType.choices
    )
    published = models.DateTimeField(default=timezone.now)
