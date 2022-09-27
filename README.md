# Web and Cloud Computing - Group 15
## Chat App

Marius s4865928
Lennard s2676699

### How to run
Start redis server by pulling redis image from the web:
```shell
docker run -p 6379:6379 -d redis:5
```

Run the django server:
```shell
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 127.0.0.1:8080
```

To share a public link during development and make localhost public:
```shell
ssh -R 80:localhost:8080 localhost.run
```

The returned public url needs to be added to the known ```ALLOWED_HOSTS=[]``` inside ```settings.py```.