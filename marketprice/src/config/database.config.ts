import { createClient } from 'redis';
import { Sequelize } from 'sequelize';

export const redisClient = createClient({
  url: 'redis://redis:6379',
  // retry_strategy: () => {
  //   return 10000 // time in milliseconds from this https://stackoverflow.com/questions/58505318/how-to-reconnect-redis-connection-after-some-give-time
  // }
});

redisClient.on('error', (err:any) => console.log('Redis Client Error', err));

try {
  redisClient.connect().then(() => console.log('✅ Connected to Redis'));
} catch (err) {
  console.log(err);
}

export const sequelize = new Sequelize('globiance_prod', 'globiance_prod', '!G05unL1v3Pl5%', {
  host: "192.168.1.1",
  port: 1433,
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
  retry:{
    max: 999
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
  sequelize.authenticate()
    .then(() => console.log('✅ Connected to MSSQL'))
    .catch(()=>console.log("Error occured with mssql"));
} catch (err) {
  console.log(err);
}

export default redisClient;
