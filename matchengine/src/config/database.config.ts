import pg, { Client } from 'pg';
import { Sequelize } from 'sequelize';

export const client = new Client({
  user: 'postgres',
  host: 'postgres',
  database: 'trade_history',
  password: 'b7Mg4UmK',
  port: 5432
});

client.connect();

pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value: string) => {
    return parseFloat(value);
});

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
    return parseFloat(value);
});

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
