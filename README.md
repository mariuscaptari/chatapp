# Web and Cloud Computing - Group 15

**Chat App** made by Marius and Lennard.

## High level view

Our Chat App allows users to enter a chat room with a choosen nickname and chat with others that are in the same room. Its simple design allows for quick in and out conversations over the internet with strangers. When entering a new room, the previous chat history is loaded, so users know what the current topic of conversation is. In addition to this, user can also perform a search across all messages for any given text.

We adopt the use of WebSockets as an alternative to HTTP communication to serve our real-time demands. Web socket connections offer a long lived, bidirectional communication channel between client and server. Once established, the channel is kept open, offering a very fast connection with low latency and overhead, ideal for such chat applications.

The general data flow of our app is as follows:

1. User connects to frontend server and establishes a web socket connection
2. Message history of current room is loaded from backend
3. User types message and sends it to the current chat room
4. Backend receives message from frontend
5. Backend broadcasts message to all subscribers of channel
6. Backend stores message in database asynchronously

## Multi-tier architecture tech stack

An overview of our chat application and its main components can be seen below:

![App Diagram](App-diagram.svg)

### Frontend

- **Typescript** for improved code readability and type safety.
- **React** enables us the ability to have a SPA architecture where we load the HTML once and from there request all content of the page via the websocket connection.
- **BulmaCSS** as most other CSS frameworks, helps us create a good enough UI with minimal code.
- **Nginx Ingress** is used to expose, load balance and forward all incoming requests towards our frontend service inside the Kubernetes cluster.

### Backend

- **Django** was choosen as the backend framework given based on our familiarity with python and since it supported all our application needs.
- **Django Channels**, which takes Django and extends its abilities beyond HTTP, namely to handle WebSockets.
- **Redis** was used as a message brocker for all the incoming messages. Works along with Django Channels to redirect incoming messages to all other users.

### Database

*Why **Cassandra?***

Cassandra is a database that trades strong consistency for availability, which in the case of a real time chat application is ideal. Furthermore, Cassandra excels at storing time-series data (such as our chat data), where old data does not need to be updated, and reads are very fast.

It also provides high scalability by putting less emphasis on data consistency. Consistency typically requires a master node to track and enforce what consistency means either based on rules or previously stored data. However, in Cassandra there are no Master nodes, since all nodes share the same hierarchical level.

---

Cassandra is implemented as a **KKV** store where the two Ks comprise the primary key. The first K is the **partition key** and is used to determine which node the data lives on and where it is found on disk. The partition contains multiple rows within it and a row within a partition is identified by the second K, which is the **clustering key**. The clustering key acts as both a primary key within the partition and how the rows are sorted.

These properties combined make for a very effiecient way of querying the database in our chat application.

We decided to set the room_name as our partition key since all the queries where we retrieve messages operate on a specific room (with the exeption of the text search across all rooms). For the second part of our primary key, we choose message_id as the clustering key. The message_ID field is a generated timeUUID, meaning that it should uniquely identify a message along with the partition key, and is chronologically sortable - useful for retrieving the last N messages when loading the chat history.

The schema of our Cassandra table can be seen below:

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

---
We have choosen to go with a replication factor of 3 for our cassandra cluster to ensure that even if we lose 1 or 2 pods, the application should still be available. For a highly available system we went with read and write consistency values of 1. This means that we do not have strong consistency W + R < 3, however, in a chat application such us ours we decided to prioritize high availability and rely on Cassandra's eventual consistency.

### Containarization and orchestration

All of our app's services are containerized using Docker. We wrote and uploaded the [frontend](https://hub.docker.com/repository/docker/mariuscaptari/frontend) and [backend](https://hub.docker.com/repository/docker/mariuscaptari/frontend) images to Docker Hub. During the first stages of development, a local testing a docker compose file was used.

---

In a production environment, we need to manage the containers that run the applications and ensure that there is minimal or ideally no downtime. For instance, if a container goes down, another container needs to be started as soon as possible. We rely on Kubernetes to manage resources for us and keep our app always available. To achieve this, we make use of the following Kubernetes features:

- Service discovery and load balancing through the use of Ingress Ngninx
- Storage orchestration for the database volumes
- Automated rollout updates
- Self-healing, in which the current state is compared and mantained to be as close as possible to the described desired state

### Deployment

The app has been deployed using Google Kubernetes Engine (GKE) and its IP has been made public. The main services (frontend, backend and database) are all replicated. Both the frontend and backend services have 3 running replicas, while the cassandra service has 5 replicas.

## How to run

To start the app locally using the docker compose configurations:

```shell
docker compose up -d
```

The chat app should now be accessible at ```http://localhost:3000/```

To run the production deployment first start minikube:

```shell
minikube start
minikube addons enable ingress
```

Then start all services in the following order:

```shell
kubectl apply -f cassandra-service.yaml
kubectl create -f local-volumes.yaml
kubectl apply -f cassandra-statefulset.yaml
```

```shell
kubectl apply -f redis.yaml
kubectl apply -f django.yaml
kubectl apply -f frontend.yaml
kubectl apply -f ingress-service.yaml
```

The app is then available at the minikube local ip (in some cases a minikube tunnel needs to be open first).
