from django.db import models
import uuid
from author.models import Author
from post.models import Post
from django.utils import timezone
# Create your models here.


class Comment(models.Model):
    post_id = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="comment_in_post")
    comment_id = models.CharField(
        primary_key=True, default=uuid.uuid4, max_length=100)
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
