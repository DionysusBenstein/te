import { Server } from 'ws';
import { connect } from './kafka/kafka.consumer';
import { methods } from './rpc';

const port = +process.env.PORT || 3031;
const wss = new Server({ port }, () => console.log(`Running on port ${port}`));

connect(); // kafka connection

function handleMessage(rawData) {
  const { method, params } = JSON.parse(rawData);
  const [route, name] = method.split('.');

  try {
    this.send(JSON.stringify(methods[route][name](params, this, wss)));
  } catch (e) {
    this.send('Invalid method');
    console.log(e);
  }
}

wss.on('connection', (ws) => {
  ws.on('message', handleMessage);
  ws.send('Connected successfully!');
});

wss.broadcast = function broadcast(msg) {
  wss.clients.forEach(function each(client) {
    client.send(msg);
  });
};
