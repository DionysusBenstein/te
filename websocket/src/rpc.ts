import { Client } from 'jayson';
import { deasyncRequestHelper } from './utils/deasync.util';
import kafkaConfig from './config/kafka.config';
import { consumer } from './kafka/kafka.consumer';

const router = {
  host: process.env.ROUTER_HOST || 'router',
  port: process.env.ROUTER_PORT || 3003,
};

const client = Client.http(router);

export const methods = {
  kline: {},
  price: {},
  state: {},
  today: {},
  deals: {},
  depth: {
    query: (params: any) => deasyncRequestHelper('order.depth', params, client),
    subscribe(params: any, ws: any) {
      const self = this;

      console.log(consumer);
      
      consumer.run({
        async eachMessage(result) {
          console.log(`Message ${result.message.value}`);
          ws.send(JSON.stringify(self.query(params)));
        },
      });

      return 'Channel subscribed successfully';
    },
    update(params: any, ws: any, wss: any) {     
      const self = this; 
      wss.broadcast(JSON.stringify(self.query(params)));
      return 'Notification sent';
    },
    unsubscribe() {
      consumer.stop();
      return 'Channel unsubscribed successfully';
    },
  },
  order: {},
  asset: {},
};
