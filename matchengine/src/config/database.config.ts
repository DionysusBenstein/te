import { Pool } from 'pg';
import { createClient } from 'redis';

export const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'trade_history',
  password: 'b7Mg4UmK',
  port: 5432
});

const client = createClient({
  url: 'redis://redis:6379',
  retry_strategy : ()=>{
    return 10000 // time in milliseconds from this https://stackoverflow.com/questions/58505318/how-to-reconnect-redis-connection-after-some-give-time
  }
});

client.on('error', (err) => console.log('Redis Client Error', err));
try {
  client.connect();
  console.log('✅ Connected to Redis');
} catch (err) {
  console.log(err);
}

export default client;
