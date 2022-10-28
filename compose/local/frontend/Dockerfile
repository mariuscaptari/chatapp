FROM node:16.3.0-alpine

WORKDIR /app

# ENV WDS_SOCKET_PORT=0

COPY ./frontend/package.json .
COPY ./frontend/package-lock.json .
RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent

# install serve - deployment static server suggested by official create-react-app
RUN npm install -g serve

COPY ./frontend/ .

EXPOSE 3000

CMD ["npm", "start"]
