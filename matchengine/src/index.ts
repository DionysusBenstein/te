import express from 'express';
import 'dotenv/config';
import _ from 'lodash';
import jayson from 'jayson';
import kafkaProducer from './kafka/kafka.producer';
import { methods } from './rpc';
import { collapse } from './utils/rpc.util';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const map = _.reduce(methods, collapse('', '.'), {});

app.post('/', new jayson.Server(map).middleware());
app.get('/', (req, res) => {
  res.send('matchengine healthcheck\n');
});

const start = async () => {
  await kafkaProducer.connect();
  app.listen(port, () => console.log(`Running on port ${port}`));
};

start();
