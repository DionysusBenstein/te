export interface IWsRpcController {
  query(params: any): void;
  history?(params: any): void;
  subscribe(params: any, ws: any, wss: any): Promise<string>;
  update(params: any, ws: any, wss: any): string;
  unsubscribe(params: any, ws: any, wss: any): string;
}
