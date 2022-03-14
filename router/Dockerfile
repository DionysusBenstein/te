FROM node:16

WORKDIR /usr/src/router

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3003
CMD [ "node", "dist/index.js" ]