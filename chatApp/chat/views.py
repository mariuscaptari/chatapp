from django.shortcuts import render

from .models import Message

# Create your views here.
def index(request):
    return render(request, 'chat/index.html')

def room(request, room_name):
    username = request.GET.get('username', 'Incognito')
    # Load only latest 20 messages of the given room
    messages = Message.objects.filter(room=room_name)[0:20]
    return render(request, 'chat/room.html', {'room_name': room_name, 'username': username, 'messages': messages})
