import kafkaConsumer from '../kafka/kafka.consumer';
import { KafkaTopic, ResponseMessage } from '../types/enums';

export async function subscribeHelper(params: any, ws: any) {
  const self = this;

  const consumer = await kafkaConsumer.subscribe(
    // TODO: subscribe to a another topics dynamically
    KafkaTopic.ORDERS,
    (result) => {
      console.log(`Message ${result.message.value}`);
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
