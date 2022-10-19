from rest_framework import serializers
from chat_app.chats.models import Message
from asgiref.sync import sync_to_async

# username = models.CharField(max_length=255)
# room = models.CharField(max_length=255)
# content = models.TextField()
# date_added = models.DateTimeField(auto_now_add=True)


# @sync_to_async
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
