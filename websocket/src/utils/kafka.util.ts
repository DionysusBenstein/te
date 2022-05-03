import kafkaConsumer from '../kafka/kafka.consumer';
import { KafkaTopic, ResponseMessage } from '../types/enums';

export async function subscribeHelper(params: any, ws: any, topics: KafkaTopic[]) {
  const self = this;

  const consumer = await kafkaConsumer.subscribe(
    topics,
    (result) => {
      const { key } = result.message;
      console.log(`Message ${key}`);
      ws.send(JSON.stringify(self.query(params)));
    }
  );

  this.consumer = consumer;

  return ResponseMessage.SUCCESS_SUB;
}

export function unsubscribeHelper(): string {
  kafkaConsumer.unsubscribe(this.consumer);
  return ResponseMessage.SUCCESS_UNSUB;
}
