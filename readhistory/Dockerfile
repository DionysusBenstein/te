FROM node:16

WORKDIR /usr/src/readhistory

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3002
CMD [ "node", "dist/index.js" ]