# Web and Cloud Computing - Group 15
**Chat App** made by Marius and Lennard.

![Demo video](demo.gif)

## How to run
To start the front-end, back-end and in memory caching services run:
```shell
docker compose up -d
```

or to force rebuild the images:
```shell
docker compose up --force-recreate --build -d
```

The chat app should now be accessible at ```http://0.0.0.0:8000/```.

To clear all the database entries:
```shell
python manage.py flush
```

To update dependencies:
```shell
pip list --format=freeze > requirements.txt
```

## Roadmap

- [x] Cassandra DB
- [ ] Move front end to React
- [ ] Search messages feature
- [ ] Predefined dropdown channel selection
- [ ] Form validation from landing page
