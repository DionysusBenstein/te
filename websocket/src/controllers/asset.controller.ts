import { Consumer } from 'kafkajs/types';
import { deasyncRequestHelper } from '../utils/deasync.util';
import { subscribeHelper, unsubscribeHelper } from '../utils/kafka.util';
import { updateHelper } from '../utils/ws.util';
import { Method } from '../types/enums';
import { IWsRpcController } from '../types/interfaces';
import client from '../config/router.config';

class OrderController implements IWsRpcController {
  consumer: Consumer;

  query(params: any) {
    return deasyncRequestHelper(Method.BALANCE_QUERY, params, client);
  }

  history(params: any) {
    return deasyncRequestHelper(Method.BALANCE_HISTORY, params, client);
  }

  async subscribe(params: any, ws: any) {
    return await subscribeHelper(params, ws);
  }

  update(params: any, ws: any, wss: any): string {
    return updateHelper(params, ws, wss);
  }

  unsubscribe(): string {
    return unsubscribeHelper();
  }
}

export default new OrderController();
