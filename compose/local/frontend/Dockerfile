FROM node:18.12.0-alpine

WORKDIR /app

COPY ./frontend/package.json .
COPY ./frontend/package-lock.json .
RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent

RUN npm install -g serve

# RUN npm install -g typescript
# RUN npm link typescript

COPY ./frontend/ .

EXPOSE 3000

RUN npm run build
