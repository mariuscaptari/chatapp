# from django.db import models

# class Message(models.Model):
#     username = models.CharField(max_length=255)
#     room = models.CharField(max_length=255)
#     content = models.TextField()
#     date_added = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ('date_added',)

import uuid
from cassandra.cqlengine import columns
from django_cassandra_engine.models import DjangoCassandraModel

class Message(DjangoCassandraModel):
    # example_id   = columns.UUID(primary_key=True, default=uuid.uuid4)
    # example_type = columns.Integer(index=True)
    # created_at   = columns.DateTime()
    # description  = columns.Text(required=False)
    message_id = columns.UUID(primary_key=True, default=uuid.uuid4)
    room = columns.Text(index=True)
    username = columns.Text(required=True)
    content = columns.Text(required=True)
    # date_added = columns.DateTime()

    # class Meta:
    #     ordering = ('date_added',)