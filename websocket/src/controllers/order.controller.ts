import { deasyncRequestHelper } from '../utils/deasync.util';
import { subscribeHelper, unsubscribeHelper } from '../utils/subscription.util';
import { updateHelper } from '../utils/ws.util';
import { KafkaTopic, Method, SocketEvent } from '../typings/enums';
import { IWsRpcController } from '../typings/interfaces';
import { SubOptions } from '../typings/types';
import client from '../config/router.config';

const options: SubOptions = {
  topics: [KafkaTopic.ORDERS],
  event: SocketEvent.ORDER
};

class OrderController implements IWsRpcController {
  query(params: any) {
    return deasyncRequestHelper(Method.ORDER_HISTORY, params, client);
  }

  history(params: any) {
    return deasyncRequestHelper(Method.ORDER_FINISHED, params, client);
  }

  async subscribe(params: any, ws: any) {
    return await subscribeHelper.call(this, params, ws, options);
  }

  update(params: any, ws: any, wss: any): string {
    return updateHelper.call(this, params, ws, wss);
  }

  unsubscribe(params: any, ws: any, wss: any): string {
    return unsubscribeHelper.call(this, params, ws, wss, options);
  }
}

export default new OrderController();
