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
});

client.on('error', (err) => console.log('Redis Client Error', err));
try {
  client.connect();
  console.log('✅ Connected to Redis');
} catch (err) {
  console.log(err);
}

export default client;
