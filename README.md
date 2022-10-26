# Web and Cloud Computing - Group 15

**Chat App** made by Marius and Lennard.

## High level view

Our Chat App allows users to enter a chat room with a choosen nickname and chat with others that are in the same room. Its simple design allows for quick in and out conversations over the internet with strangers. When entering a new room, the previous chat history is loaded, so users know what the current topic of conversation is. Furthermore, we allow the feature of searching across all messages for any given text.

We make use of WebSockets as an alternative to HTTP communication to serve our real-time demands. Web socket connections offer a long lived, bidirectional communication channel between client and server. Once established, the channel is kept open, offering a very fast connection with low latency and overhead, ideal for our chat application.

The general data flow of our app is as follows:

1. User connects to backend server and establishes a web socket connection
2. User types message and sends it to the current chat room
3. Backend server receives this message
4. Backend server broadcasts message to all other chat participants

## Multi-tier architecture tech stack

To develop our chat application, we have choosen the following technologies:

### Frontend

- React: to achieve a SPA architecture where we load the HTML once and from there request all content of the page via the websocket connection.
- BulmaCSS: as any other CSS frameworks, it allows us to make a good UI with minimal code.
- Nginx Ingress: which allows us to expose and load balance all requests to only our frontend entry point from our Kubernetes cluster.

### Backend

- Django: which was choosen mostly based on our familiarity with python and since it supported all our application needs.
- Channels: takes Django and extends its abilities beyond HTTP, namely to handle WebSockets.
- Redis: used as a message brocker for all the incoming messages to our django server.

### Database

- Cassandra

### Containarization and orchestration

- Docker: all our services rely on Docker images
- Kubernetes: allows us to add service discovery and load balancing. Furthermore, it makes it simple to deal with scalability and fault tolerance.

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
