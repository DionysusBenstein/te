import { ResponseMessage } from '../types/enums';

export function broadcast(wss: any, msg: any) {
  wss.clients.forEach((client) => {
    client.send(msg);
  });
}

export function updateHelper(params: any, ws: any, wss: any): string {
  console.log(this);
  
  broadcast(wss, JSON.stringify(this.query(params)));
  return ResponseMessage.SUCCESS_NOTIFY;
}
