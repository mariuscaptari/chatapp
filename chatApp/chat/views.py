from django.shortcuts import render

from .models import Message


def index(request):
    return render(request, 'chat/index.html')

def room(request, room_name):
    if request.method == "GET":
        username = request.GET.get('username', 'Incognito')
        messages = Message.objects.filter(room=room_name)[-10:] # Last 10 messages
        return render(request, 'chat/room.html', {'room_name': room_name, 'username': username, 'messages': messages})
