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

export const sequelize = new Sequelize('globiance_staging', 'globiance_db', 'M4lt4!23!', {
  host: "192.168.1.9",
  port: 14433,
  dialect: "mssql",
  logging: false,
  dialectOptions: {
    options: {
      requestTimeout: 300000,
      cryptoCredentialsDetails: {
        minVersion: 'TLSv1'
      }
    }
  },
  pool: {
    max: 500,
    min: 0,
    idle: 20000,
    acquire: 100000,
    evict: 20000
  }
});

try {
  sequelize.authenticate().then(() => console.log('✅ Connected to MSSQL'));
} catch (err) {
  console.log(err);
}

export default redisClient;
