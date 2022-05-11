import kafkaConsumer from '../kafka/kafka.consumer';
import { KafkaTopic, ResponseMessage } from '../types/enums';

export async function subscribeHelper(method: string, params: any, ws: any, topics: KafkaTopic[]) {
  const self = this;

  const consumer = await kafkaConsumer.subscribe(
    topics,
    (result) => {
      const { key } = result.message;
      console.log(`Message ${key}`);
      ws.send(JSON.stringify({
        stream: method.split('.')[0],
        market: params.market,
        records: self.query(params)
      }));
    }
  );

  this.consumer = consumer;

  return {
    message: ResponseMessage.SUCCESS_SUB,
    stream: method.split('.')[0],
    ...params
  };
}

export function unsubscribeHelper() {
  kafkaConsumer.unsubscribe(this.consumer);
  return { message: ResponseMessage.SUCCESS_UNSUB };
}
