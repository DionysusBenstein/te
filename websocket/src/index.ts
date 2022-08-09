import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { methods } from './rpc';
import { roomsList } from './shared-data';
import { getAllRooms } from './utils/ws.util';
import { collapse } from './utils/rpc.util';
import { KafkaTopic } from './typings/enums';
import kafkaConsumer from './kafka/kafka.consumer';

const app = express();
const server = createServer(app);
const port = +process.env.WS_PORT || 3031;
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// const rateLimiter = new RateLimiterMemory({
//   points: 50,
//   duration: 0.1,
// });

const rateLimiter = new RateLimiterMemory({
  points: 50,
  duration: 1,
});

const collapsedMethods = collapse(methods)

io.use((socket, next) => {
  console.log('Connection auth info:', socket.handshake.auth);
  console.log('Origin:', socket.handshake.headers.origin);

  if (socket.handshake.auth.token === process.env.ACCESS_TOKEN) {
    console.log('Auth succsess!');
    next();
  } else {
    next(new Error('Not authorized'));
  }
});

io.on('connection', socket => {
  console.log(`Connection with id ${socket.id} connected`);
  console.log(`Total clients count: ${io.engine.clientsCount}`);
  console.log(`Total rooms count: ${getAllRooms(io).length - io.engine.clientsCount}\n`);

  socket.on('message', handleMessage);
  socket.on('disconnect', reason => {
    console.log('Disconnected:', socket.id, reason)
  });
});

async function handleMessage(rawData: any) {
  try {
    const { method, params } = rawData;

    if (method && params) {
      const rateLimiterRes = await rateLimiter.consume(this.id);
      const [route, name] = method.split('.');
      const eventName = name === 'query' ? method : 'message';
      console.log('::::::: eventName', method, ':', rateLimiterRes);
      
      return this.emit(eventName, JSON.stringify(await collapsedMethods[method](params, this, io)));
    }
  } catch (e) {
    this.send('Invalid method');

    if (e.BeforeNext) {
      this.emit('blocked', { 'retry-ms': e.msBeforeNext })
    }

    console.log(e);
  }
}

kafkaConsumer.subscribe([KafkaTopic.DEALS, KafkaTopic.ORDERS],
  async result => {
    const { topic, message: { key } } = result;

    for await (const room of roomsList) {
      const { name, channelString, topics, method, params } = room;

      if (topics.includes(topic)) {
        io.to(name).emit(channelString,
          JSON.stringify({
            stream: channelString,
            market: params.market,
            data: await collapsedMethods[method](params)
          }));
      }
    }
  }
);

app.get("/", (req, res) => {
  res.send("websocket healthcheck\n");
});

server.listen(port, () => console.log(`Running on port ${port}`))
