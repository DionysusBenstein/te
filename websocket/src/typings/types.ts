import { KafkaTopic, SocketEvent } from './enums';

export type SubOptions = {
  topics: KafkaTopic[];
  event: SocketEvent;
}