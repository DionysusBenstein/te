import { Server } from 'ws';
import { methods } from './rpc';

const port = +process.env.WS_PORT || 3031;
const wss = new Server({ port }, () => console.log(`Running on port ${port}`));

async function handleMessage(rawData) {
  try {
    const { method, params } = JSON.parse(rawData);
    const [route, name] = method.split('.');
    this.send(JSON.stringify(await methods[route][name](params, this, wss)));
  } catch (e) {
    this.send('Invalid method');
    console.log(e);
  }
}

wss.on('connection', (ws) => {
  ws.on('message', handleMessage);
  ws.send(JSON.stringify({ message: 'Connected successfully!' }));
});
