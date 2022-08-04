import murmurhash from 'murmurhash';
import { roomsList } from '../shared-data';
import { ResponseMessage } from '../typings/enums';
import { SubOptions, Room } from '../typings/types';
import { getActiveRooms, getClientsInRoom } from './ws.util';

export async function subscribeHelper(params: any, socket: any, options: SubOptions) {
  const { event, topics } = options;
  const channelString = params.market ? `${event}~${params.market}` : event;

  const room: Room = {
    id: 0,
    name: '',
    channelString,
    topics,
    method: `${event}.query`,
    params,
  };

  const roomHash: number = murmurhash.v2(JSON.stringify(room));
  const foundRoom: Room = roomsList.find(room => room.id === roomHash)

  if (foundRoom) {
    socket.join(`${foundRoom.channelString}:${foundRoom.id}`);
  } else {
    room.id = roomHash;
    room.name = `${room.channelString}:${room.id}`;
    roomsList.push(room);
    socket.join(room.name);
  }

  console.log(
    `\nAdd subscribtion: ${channelString}\nClient: ${socket.id}\nRoom: ${foundRoom ? foundRoom.name : room.name}\n`
  );

  return {
    message: ResponseMessage.SUCCESS_SUB,
    stream: channelString,
    ...params
  };
}

export function unsubscribeHelper(params: any, socket: any, io: any, options: SubOptions) {
  const { event, topics } = options;
  const channelString = params.market ? `${event}~${params.market}` : event;

  const room: Room = {
    id: 0,
    name: '',
    channelString,
    topics,
    method: `${event}.query`,
    params,
  };

  const roomHash: number = murmurhash.v2(JSON.stringify(room));
  const roomName = `${channelString}:${roomHash}`;

  if (getActiveRooms(io).includes(roomName)) {
    socket.leave(roomName);
    
    if (getClientsInRoom(roomName, io).length <= 0) {
      const roomIndex: number = roomsList.findIndex(room => room.name === roomName);
      roomsList.splice(roomIndex, 1);
    }

    console.log(
      `\nRemove subscribtion: ${channelString}\nClient: ${socket.id}\nRoom: ${roomName}\n`
    );

    return { message: ResponseMessage.SUCCESS_UNSUB };
  }
  return { message: ResponseMessage.UNSUCCESS_UNSUB };
}
