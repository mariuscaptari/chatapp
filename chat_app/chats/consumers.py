# from channels.generic.websocket import JsonWebsocketConsumer
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Message
from asgiref.sync import sync_to_async

from chat_app.chats.api.serializers import MessageSerializer

import json
from uuid import UUID

class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return obj.hex
        return json.JSONEncoder.default(self, obj)


class ChatConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.name = None

    @classmethod
    async def encode_json(cls, content):
        return json.dumps(content, cls=UUIDEncoder)

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room']
        print("Connected! Will now be added to group: " + self.room_name)
        self.room_group_name = 'chat_%s' % self.room_name
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()
        # await self.send_json(
        #     {
        #         "type": "welcome_message",
        #         "message": "Hey there! You've successfully connected!",
        #     }
        # )
        messages = await self.get_last_messages(room=self.room_name)
        serialized_messages = await self.serialize_messages(messages)
        await self.send_json({
            "type": "message_history",
            "messages": serialized_messages,
        })
        
    async def disconnect(self, code):
        print("Disconnected!")
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        return super().disconnect(code)

    async def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "chat_message":
            message = await self.save_message(name=content["name"], 
                                    room=self.room_name, 
                                    message=content["message"])

            serialized_message = await self.serialize_one_message(message)
            print(serialized_message)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message_echo",
                    "name": content["name"],
                    "message": serialized_message,
                },
            )
        return await super().receive_json(content, **kwargs)

    async def chat_message_echo(self, event):
        print(event)
        await self.send_json(event)

    @sync_to_async
    def save_message(self, name, room, message):
        return Message.objects.create(name=name, room=room, content=message)

    @sync_to_async
    def get_last_messages(self, room):
        messages = Message.objects.filter(room=room)#.order_by("-date_added")
        return messages[0:10]

    @sync_to_async
    def serialize_messages(self, messages):
        return MessageSerializer(messages, many=True).data

    @sync_to_async
    def serialize_one_message(self, message):
        return MessageSerializer(message).data