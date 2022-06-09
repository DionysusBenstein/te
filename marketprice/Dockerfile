FROM node:16.14
WORKDIR /usr/src/marketprice

COPY package.json .

RUN npm install
COPY . .

RUN npm run build

EXPOSE $PORT
CMD [ "node", "dist/src/index.js" ]
