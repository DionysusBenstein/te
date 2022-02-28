FROM node:16

WORKDIR /usr/src/matchengine

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3001
CMD [ "node", "dist/index.js" ]