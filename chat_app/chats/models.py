from django.db import models
import uuid

class Message(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4)
  name = models.CharField(max_length=255)
  room = models.CharField(max_length=255)
  content = models.TextField()
  date_added = models.DateTimeField(auto_now_add=True)

  class Meta:
    ordering = ('date_added',)
