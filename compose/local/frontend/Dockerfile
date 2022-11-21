FROM node:18.12.0-alpine

WORKDIR /app

# ENV WDS_SOCKET_PORT=0

COPY ./frontend/package.json .
COPY ./frontend/package-lock.json .
RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent

RUN npm install -g serve

COPY ./frontend/ .

EXPOSE 3000

RUN npm run build
