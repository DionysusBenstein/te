FROM node:16

WORKDIR /usr/src/marketprice

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000
CMD [ "node", "dist/index.js" ]