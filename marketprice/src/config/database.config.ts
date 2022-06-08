import { createClient } from 'redis';
import { Sequelize } from 'sequelize';

export const redisClient = createClient({
  url: 'redis://redis:6379',
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

try {
  redisClient.connect().then(() => console.log('✅ Connected to Redis'));
} catch (err) {
  console.log(err);
}

export const sequelize = new Sequelize('Globiance', 'globiance_db', 'M4lt4!23!', {
  dialect: 'mssql',
  host: '95.211.7.220'
});

try {
  sequelize.authenticate().then(() => console.log('✅ Connected to MSSQL'));
} catch (err) {
  console.log(err);
}

export default redisClient;
