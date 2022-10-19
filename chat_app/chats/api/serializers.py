# from rest_framework import serializers
from django_cassandra_engine.rest.serializers import DjangoCassandraModelSerializer

from chat_app.chats.models import Message


class MessageSerializer(DjangoCassandraModelSerializer):
    class Meta:
        model = Message
        fields = (
            "id",
            "name",
            "room",
            "content",
            "date_added",
        )
