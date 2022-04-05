import { Consumer } from 'kafkajs/types';
import { deasyncRequestHelper } from '../utils/deasync.util';
import { subscribe, unsubscribe } from '../kafka/kafka.consumer';
import { broadcast } from '../utils/ws.util';
import { KafkaTopic, Method, ResponseMessage } from '../types/enums';
import { IWsRpcController } from '../types/interfaces';
import client from '../config/router.config';

class DepthController implements IWsRpcController {
  consumer: Consumer;

  query(params: any) {
    return deasyncRequestHelper(Method.ORDER_DEPTH, params, client);
  }

  async subscribe(params: any, ws: any) {
    const self = this;

    const depthConsumer = await subscribe(KafkaTopic.ORDERS, (result) => {
      console.log(`Message ${result.message.value}`);
      ws.send(JSON.stringify(self.query(params)));
    });

    this.consumer = depthConsumer;

    return ResponseMessage.SUCCESS_SUB;
  }

  update(params: any, ws: any, wss: any): string {
    broadcast(wss, JSON.stringify(this.query(params)));
    return ResponseMessage.SUCCESS_NOTIFY;
  }

  unsubscribe(): string {
    unsubscribe(this.consumer);
    return ResponseMessage.SUCCESS_UNSUB;
  }
}

export default new DepthController();
