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
        self.history_size = 50

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
        rooms = await self.get_rooms()
        await self.send_json(
            {
                "type": "room_list",
                "rooms": rooms,
            }
        )
        messages = await self.get_last_messages(room=self.room_name)
        serialized_messages = await self.serialize_messages(messages, multiple=True)
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
            serialized_message = await self.serialize_messages(message, multiple=False)
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
            serialized_messages = await self.serialize_messages(messages, multiple=True)
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
        messages = Message.objects.filter(room=room)
        return list(reversed(messages[0:self.history_size]))

    @sync_to_async
    def get_substring_messages(self, substring):
        query_substring = f"%{substring}%"
        # q = Message.objects.filter(room=self.room_name)
        q = Message.objects.filter(content__like=query_substring) #.allow_filtering()
        return q[0:self.history_size]

    @sync_to_async
    def get_rooms(self):
        query_set = Message.objects.all().distinct()
        return list(map(lambda x: x.room, list(query_set)))

    @sync_to_async
    def serialize_messages(self, messages, multiple):
        return MessageSerializer(messages, many=multiple).data
