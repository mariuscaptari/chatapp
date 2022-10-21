from django.urls import path

from chat_app.chats.consumers import ChatConsumer

websocket_urlpatterns = [path("ws/<str:room>/", ChatConsumer.as_asgi())]
