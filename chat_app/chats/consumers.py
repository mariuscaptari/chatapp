# from channels.generic.websocket import JsonWebsocketConsumer
from channels.generic.websocket import AsyncJsonWebsocketConsumer


class ChatConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None

    async def connect(self):
        print("Connected!")
        self.room_name = "home"
        await self.accept()
        # acception connection
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name,
        )
        # Send welcome back message to WebSocket
        await self.send_json(
            {
                "type": "welcome_message",
                "message": "Hey there! You've successfully connected!",
            }
        )

    async def disconnect(self, code):
        print("Disconnected!")
        return super().disconnect(code)

    async def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "chat_message":
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "chat_message_echo",
                    "name": content["name"],
                    "message": content["message"],
                },
            )
        return super().receive_json(content, **kwargs)

    async def chat_message_echo(self, event):
        print(event)
        await self.send_json(event)