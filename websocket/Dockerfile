FROM node:16.14
WORKDIR /usr/src/websocket

COPY package.json .

RUN npm install
COPY . .

RUN npm run build

EXPOSE $WS_PORT
CMD [ "node", "dist/index.js" ]
