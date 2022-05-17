import { Consumer } from 'kafkajs/types';

export interface IWsRpcController {
  consumer: Consumer;

  query(params: any): void;
  history?(params: any): void;
  subscribe(params: any, ws: any): Promise<string>;
  update(params: any, ws: any, wss: any): string;
  unsubscribe(consumer: Consumer): string
}
