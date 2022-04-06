import { Consumer } from 'kafkajs/types';
import { deasyncRequestHelper } from '../utils/deasync.util';
import { subscribeHelper, unsubscribeHelper } from '../utils/kafka.util';
import { updateHelper } from '../utils/ws.util';
import { Method } from '../types/enums';
import { IWsRpcController } from '../types/interfaces';
import client from '../config/router.config';

class DealController implements IWsRpcController {
  consumer: Consumer;

  query(params: any) {
    return deasyncRequestHelper(Method.MARKET_DEALS, params, client);
  }

  async subscribe(params: any, ws: any) {
    return await subscribeHelper.call(this, params, ws);
  }

  update(params: any, ws: any, wss: any): string {
    return updateHelper.call(this, params, ws, wss);
  }

  unsubscribe(): string {
    return unsubscribeHelper.call(this);
  }
}

export default new DealController();