import { KafkaTopic, SocketEvent } from './enums';

export type SubOptions = {
  topics: KafkaTopic[];
  event: SocketEvent;
}

export type Room = {
  id: number;
  name: string;
  channelString: string;
  topics: string[];
  method: string;
  params: any;
}
