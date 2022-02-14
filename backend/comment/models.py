from django.db import models
import uuid
from author.models import Author
from django.utils import timezone
# Create your models here.


class Comment(models.Model):
    comment_id = models.CharField(
        primary_key=True, default=uuid.uuid4, max_length=100)
    type = models.CharField(max_length=7, default='comment', editable=False)
    author = models.ForeignKey(
        Author, on_delete=models.DO_NOTHING, related_name="comments")
    comment = models.CharField(max_length=200, blank=True)

    class ContentType(models.TextChoices):
        common_mark = 'text/markdown'
        utf8 = 'text/plain'
    contentType = models.CharField(
        max_length=13,
        choices=ContentType.choices
    )
    published = models.DateTimeField(default=timezone.now)
