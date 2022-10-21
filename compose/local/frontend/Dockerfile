FROM node:16.3.0-alpine

WORKDIR /app

COPY ./frontend/package.json .
COPY ./frontend/package-lock.json .
RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent

COPY ./frontend/ .

EXPOSE 3000

CMD ["npm", "start"]
