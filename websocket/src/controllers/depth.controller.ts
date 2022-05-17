import { Consumer } from 'kafkajs/types';
import { deasyncRequestHelper } from '../utils/deasync.util';
import { subscribeHelper, unsubscribeHelper } from '../utils/kafka.util';
import { updateHelper } from '../utils/ws.util';
import { KafkaTopic, Method, SocketEvent } from '../typings/enums';
import { IWsRpcController } from '../typings/interfaces';
import { SubOptions } from '../typings/types';
import client from '../config/router.config';

class DepthController implements IWsRpcController {
  consumer: Consumer;

  query(params: any) {
    return deasyncRequestHelper(Method.ORDER_DEPTH, params, client);
  }

  async subscribe(params: any, ws: any) {
    const options: SubOptions = {
      topics: [ KafkaTopic.DEALS, KafkaTopic.ORDERS ],
      event: SocketEvent.DEPTH
    };

    return await subscribeHelper.call(this, Method.ORDER_DEPTH, params, ws, options);
  }

  update(params: any, ws: any, wss: any): string {
    return updateHelper.call(this, params, ws, wss);
  }

  unsubscribe(): string {
    return unsubscribeHelper.call(this);
  }
}

export default new DepthController();
