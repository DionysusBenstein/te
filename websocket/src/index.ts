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
  if (socket.handshake.auth.token === process.env.ACCESS_TOKEN) {
    console.log('Auth succsess!');
<<<<<<< HEAD
   next();
=======
    next();
>>>>>>> 628d011df9389f89be70bac767cc37629e04a163
  } else {
    next(new Error('Not authorized'));
  }
});

io.on('connection', socket => {
  console.log(`Client with id ${socket.id} connected`);
  socket.on('message', handleMessage);
});

app.get("/", (req, res) => {
  res.send("websocket healthcheck\n");
});

server.listen(port, () => console.log(`Running on port ${port}`))
