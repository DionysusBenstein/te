import { createClient } from 'redis';

const client = createClient({
  url: 'redis://redis:6379',
});

client.on('error', (err) => console.log('Redis Client Error', err));
try {
  client.connect();
} catch (err) {
  console.log(err);
}

export default client;
