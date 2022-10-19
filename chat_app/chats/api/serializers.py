from rest_framework import serializers

from chat_app.chats.models import Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = (
            "id",
            "name",
            "room",
            "content",
            "date_added",
        )
