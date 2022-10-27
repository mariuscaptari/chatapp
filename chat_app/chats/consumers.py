# from channels.generic.websocket import JsonWebsocketConsumer
import datetime
import json
from uuid import UUID

from asgiref.sync import sync_to_async
from cassandra.util import uuid_from_time
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from chat_app.chats.api.serializers import MessageSerializer

from .models import Message


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
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
        self.room_name = self.scope["url_route"]["kwargs"]["room"]
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name,
        )
        print("Added to group: " + self.room_name)
        await self.accept()
        print("Acepted!")
        print("Retriving message history...")
        messages = await self.get_last_messages(room=self.room_name)
        serialized_messages = await self.serialize_messages(messages)
        await self.send_json(
            {
                "type": "message_history",
                "messages": serialized_messages,
            }
        )

    async def disconnect(self, code):
        print("Disconnected!")
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        return super().disconnect(code)

    async def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "chat_message":
            message = await self.save_message(
                name=content["name"], room=self.room_name, message=content["message"]
            )
            serialized_message = await self.serialize_one_message(message)
            print("Received message: ")
            print(serialized_message)
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "chat_message_echo",
                    "name": content["name"],
                    "message": serialized_message,
                },
            )
        if message_type == "search_messages":
            print("Received search message request")
            messages = await self.get_substring_messages(
                substring=content["searchMessage"]
            )
            serialized_messages = await self.serialize_messages(messages)
            print("Query result: ", serialized_messages)
            await self.send_json(
                {
                    "type": "search_results",
                    "messages": serialized_messages,
                }
            )
        return await super().receive_json(content, **kwargs)

    async def chat_message_echo(self, event):
        print(event)
        await self.send_json(event)

    @sync_to_async
    def save_message(self, name, room, message):
        timestamp = datetime.datetime.now()
        time_uuid = uuid_from_time(timestamp)
        return Message.objects.create(
            id=time_uuid, name=name, room=room, content=message, date_added=timestamp
        )

    @sync_to_async
    def get_last_messages(self, room):
        number_msg_to_load = 50
        messages = Message.objects.filter(room=room)
        return list(reversed(messages[0:number_msg_to_load]))

    @sync_to_async
    def get_substring_messages(self, substring):
        like_substring = f"%{substring}%"
        # q = Message.objects.filter(room=self.room_name)
        q = Message.objects.filter(content__like=like_substring).allow_filtering()
        number_msg_to_load = 50
        return q[0:number_msg_to_load]

    @sync_to_async
    def serialize_messages(self, messages):
        return MessageSerializer(messages, many=True).data

    @sync_to_async
    def serialize_one_message(self, message):
        return MessageSerializer(message).data
