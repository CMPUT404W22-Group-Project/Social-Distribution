from django.db import models

# Create your models here.


class Author(models.Model):

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
