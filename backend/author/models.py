from django.db import models
import uuid
import os
# Create your models here.


class Author(models.Model):

    author_id = models.CharField(
        primary_key=True, default=uuid.uuid4, max_length=100)

    id = models.URLField(blank=True)

    class TagType(models.TextChoices):
        admin = 'admin'
        author = 'author'

    type = models.CharField(
        max_length=10,
        choices=TagType.choices,
        default=TagType.author
    )
    url = models.URLField(blank=True)
    host = models.URLField(blank=True)
    displayName = models.CharField(max_length=50, blank=True)
    github = models.URLField(blank=True)
    profileImage = models.URLField(blank=True)
