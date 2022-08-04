import { ResponseMessage } from '../typings/enums';

export function broadcast(wss: any, msg: any) {
  wss.clients.forEach((client) => {
    client.send(msg);
  });
}

export function updateHelper(params: any, ws: any, wss: any): string {
  broadcast(wss, JSON.stringify(this.query(params)));
  return ResponseMessage.SUCCESS_NOTIFY;
}

export function getAllRooms(io: any) {
  return Array.from(io.sockets.adapter.rooms).map(i => i[0]);
}

export function getActiveRooms(io: any) {
  const arr = Array.from(io.sockets.adapter.rooms);
  const filtered = arr.filter(room => !room[1].has(room[0]))
  const result = filtered.map(i => i[0]);
  return result;
}

export function getClientsInRoom(roomName: string, io: any) {
  return Array.from(
    io.sockets.adapter.rooms.get(roomName) || []
  );
}