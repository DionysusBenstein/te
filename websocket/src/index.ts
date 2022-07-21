import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { methods } from './rpc';

const app = express();
const server = createServer(app);
const port = +process.env.WS_PORT || 3031;
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

async function handleMessage(rawData: any) {
  try {    
    const { method, params } = rawData;

    if (method && params) {
      const [route, name] = method.split('.');
      const eventName = name === 'query' ? method : 'message';
      return this.emit(eventName, JSON.stringify(await methods[route][name](params, this, io)));
    }
  } catch (e) {
    this.send('Invalid method');
    console.log(e);
  }
}

io.use((socket, next) => {
  console.log('Connection auth info:', socket.handshake.auth);
  console.log('Origin:', socket.handshake.headers.origin);
  console.log('--------------------------');
  
  if (socket.handshake.auth.token === process.env.ACCESS_TOKEN) {
    console.log('Auth succsess!');
    next();
  } else {
    next(new Error('Not authorized'));
  }
});

io.on('connection', socket => {
  console.log(`Connection with id ${socket.id} connected, total count: ${io.engine.clientsCount}`);
  socket.on('message', handleMessage);
  socket.on('disconnect', reason => console.log('Disconnected:', reason));
});

app.get("/", (req, res) => {
  res.send("websocket healthcheck\n");
});

server.listen(port, () => console.log(`Running on port ${port}`))
