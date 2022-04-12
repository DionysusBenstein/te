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

kafkaProducer.connect();

const map = _.reduce(methods, collapse('', '.'), {});

app.post('/', new jayson.Server(map).middleware());
app.get('/', (req, res) => {
    res.send('matchengine healthcheck');
});

app.listen(port, () => console.log(`Running on port ${port}`));
