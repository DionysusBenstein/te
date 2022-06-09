FROM node:16.14
WORKDIR /usr/src/matchengine

COPY package.json .

RUN npm install
COPY . .

RUN npm run build

EXPOSE $PORT
CMD [ "node", "dist/index.js" ]
