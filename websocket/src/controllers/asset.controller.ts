import { rpcRequest } from "../utils/rpc.util";
import { subscribeHelper, unsubscribeHelper } from '../utils/subscription.util';
import { updateHelper } from '../utils/ws.util';
import { KafkaTopic, Method, SocketEvent } from '../typings/enums';
import { IWsRpcController } from '../typings/interfaces';
import { SubOptions } from '../typings/types';

const options: SubOptions = {
  topics: [KafkaTopic.ORDERS],
  event: SocketEvent.ASSET
};

class AssetController implements IWsRpcController {
  async query(params: any) {
    return await rpcRequest(Method.BALANCE_QUERY, params);
  }

  async history(params: any) {
    return await rpcRequest(Method.BALANCE_HISTORY, params);
  }

  subscribe(params: any, ws: any) {
    return subscribeHelper(params, ws, options);
  }

  update(params: any, ws: any, wss: any): string {
    return updateHelper.call(this, params, ws, wss);
  }

  unsubscribe(params: any, ws: any, wss: any) {
    return unsubscribeHelper(params, ws, wss, options);
  }
}

export default new AssetController();
