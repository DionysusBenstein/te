export function broadcast(wss: any, msg: any) {
  wss.clients.forEach((client) => {
    client.send(msg);
  });
}
