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

To develop our chat application, we have choosen the following technologies for each tier:

### Frontend

- React: to achieve a SPA architecture where we load the HTML once and from there request all content of the page via the websocket connection.
- BulmaCSS: as most other CSS frameworks, it allows us to make a good enough UI with minimal code.
- Nginx Ingress: which allows us to expose and load balance all requests to only our frontend entry point from our Kubernetes cluster.

### Backend

- Django: which was choosen mostly based on our familiarity with python and since it supported all our application needs.
- Channels: takes Django and extends its abilities beyond HTTP, namely to handle WebSockets.
- Redis: used as a message brocker for all the incoming messages. Works along with Django Channels to redirect incoming messages to all other users.

### Database

*Why Cassandra?*

Cassandra is a database that trades strong consistency for availability, which in the case of a real time chat application is ideal. Furthermore, Cassandra excels at storing time-series data (such as our chat data), where old data does not need to be updated, and reads are very fast.

It also provides high scalability by putting less emphasis on data consistency. Consistency typically requires a master node to track and enforce what consistency means either based on rules or previously stored data.

---

Cassandra is implemented as a KKV store where the two Ks comprise the primary key. The first K is the partition key and is used to determine which node the data lives on and where it is found on disk. The partition contains multiple rows within it and a row within a partition is identified by the second K, which is the clustering key. The clustering key acts as both a primary key within the partition and how the rows are sorted.

These properties combined make for a very effiecient way of querying the database in a chat application.

We decided to set the room_name as our partition key since all the queries where we retrieve messages operate on a specific room (with the exeption of the text search across all rooms). For the second part of our primary key, we choose message_id as the clustering key. The message_ID field is a generated timeUUID, meaning that it should uniquely identify a message along with the partition key, and is chronologically sortable - useful for retrieving the last N messages.

Below the schema of our main Cassandra table can be seen:

```sql
CREATE TABLE messages (
  message_id timeUUID,
  nickname text,
  room_name text,
  content text,
  date_added datetime,
  PRIMARY KEY (room_name, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);
```

The main downside we found with using Cassandra was that when querying the database for matching substrings we had to enable SASIIndex for the content column, which is not ideal and not recommended for production.

### Containarization and orchestration

All of our app's services are containerized using Docker. We wrote and uploaded the [frontend](https://hub.docker.com/repository/docker/mariuscaptari/frontend) and [backed](https://hub.docker.com/repository/docker/mariuscaptari/frontend) images to Docker Hub. During the first stages of development, a local testing a docker compose file was used.

---

In a production environment, we need to manage the containers that run the applications and ensure that there is no downtime. For instance, if a container goes down, another container needs to start. We rely on Kubernetes to manage resources for us and keep our app always available. To achieve this, we make use of the following Kubernetes features:

- Service discovery and load balancing through the use of Ingress Ngninx
- Storage orchestration for the database volumes
- Automated rollout updates
- Self-healing, in which the current state is compared and mantained to be as close as possible to the described desired state

### Deployment

For deploying  we used Google Kubernetes Engine (GKE)

## How to run

To start the app:

```shell
docker compose up -d
```

The chat app should now be accessible at ```http://localhost:3000/```.
