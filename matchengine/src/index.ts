import express from 'express';
import 'dotenv/config';
import _ from 'lodash';
import jayson from 'jayson';
import kafkaProducer from './kafka/kafka.producer';
import { methods } from './rpc';
import { collapse } from './utils/rpc.util';
// import os from 'os';
import cluster from 'cluster';
// const clusterWorkerSize = os.cpus().length;
const clusterWorkerSize = 1;

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

kafkaProducer.connect();

const map = _.reduce(methods, collapse('', '.'), {});

app.post('/', new jayson.Server(map).middleware());
app.get('/', (req, res) => {
  res.send('matchengine healthcheck');
});

const start = async () => {
  app.listen(port, () => console.log(`Running on port ${port}`));
};

if (clusterWorkerSize > 1) {
  if (cluster.isMaster) {
    for (let i = 0; i < clusterWorkerSize; i++) {
      cluster.fork();
    }

    cluster.on('exit', function (worker, code, signal) {
      console.log('Worker', worker.id, 'has exited with signal', signal);
      if (code !== 0 && !worker.exitedAfterDisconnect) {
        cluster.fork();
      }
    });
  } else {
    start();
  }
} else {
  start();
}
