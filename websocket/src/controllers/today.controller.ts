import { Consumer } from 'kafkajs/types';
import { deasyncRequestHelper } from '../utils/deasync.util';
import { subscribeHelper, unsubscribeHelper } from '../utils/kafka.util';
import { updateHelper } from '../utils/ws.util';
import { KafkaTopic, Method, SocketEvent } from '../typings/enums';
import { IWsRpcController } from '../typings/interfaces';
import { SubOptions } from '../typings/types';
import client from '../config/router.config';

class TodayController implements IWsRpcController {
  consumer: Consumer;

  query(params: any) {
    return deasyncRequestHelper(Method.MARKET_STATUS_TODAY, params, client);
  }

  async subscribe(params: any, ws: any) {
    const options: SubOptions = {
      topics: [ KafkaTopic.DEALS ],
      event: SocketEvent.TODAY
    };

    return await subscribeHelper.call(
      this,
      Method.MARKET_STATUS_TODAY,
      params,
      ws,
      options
    );
  }

  update(params: any, ws: any, wss: any): string {
    return updateHelper.call(this, params, ws, wss);
  }

  unsubscribe(): string {
    return unsubscribeHelper.call(this);
  }
}

export default new TodayController();
