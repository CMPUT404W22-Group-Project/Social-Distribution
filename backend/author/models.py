from django.db import models

# Create your models here.


class Author(models.Model):

    class TagType(models.TextChoices):
        ADMIN = 'ADMIN'
        AUTHOR = 'AUTHOR'

    type = models.CharField(
        max_length=10,
        choices=TagType.choices,
        default=TagType.AUTHOR
    )
    host = models.URLField()
    displayName = models.CharField(max_length=50)
    github = models.CharField(max_length=100)
    profileImage = models.URLField(max_length=200)
