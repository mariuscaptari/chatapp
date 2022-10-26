# Web and Cloud Computing - Group 15

**Chat App** made by Marius and Lennard.

## High level design



## How to run

To start the front-end, back-end, database and redis:

```shell
docker compose -f local.yml up -d
```

or to force rebuild the images:

```shell
docker compose -f local.yml up --force-recreate --build -d
```

The chat app should now be accessible at ```http://0.0.0.0:3000/```.
