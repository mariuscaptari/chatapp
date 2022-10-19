# from channels.generic.websocket import JsonWebsocketConsumer
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Message
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None

    async def connect(self):
        received_roomname = self.scope['url_route']['kwargs']['room']
        print("Connected! Will now be added to group: " + received_roomname)
        self.room_name = received_roomname
        self.room_group_name = 'chat_%s' % self.room_name
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name,
        )
        await self.accept()
        await self.send_json(
            {
                "type": "welcome_message",
                "message": "Hey there! You've successfully connected!",
            }
        )
        
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
            name = content["name"]
            message = content["message"]

            await self.save_message(username=name, 
                                    room=self.room_name, 
                                    message=message)

            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "chat_message_echo",
                    "name": name,
                    "message": message,
                },
            )
        return await super().receive_json(content, **kwargs)

    async def chat_message_echo(self, event):
        print(event)
        await self.send_json(event)

    @sync_to_async
    def save_message(self, username, room, message):
        Message.objects.create(username=username, room=room, content=message)