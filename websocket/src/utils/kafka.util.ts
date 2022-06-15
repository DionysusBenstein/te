import kafkaConsumer from '../kafka/kafka.consumer';
import { ResponseMessage } from '../typings/enums';
import { SubOptions } from '../typings/types';

export async function subscribeHelper(
  method: string,
  params: any,
  ws: any,
  options: SubOptions) {
  const self = this;
  const { topics, event } = options;
  const channelString = params.market ? `${event}~${params.market}` : event;

  const consumer = await kafkaConsumer.subscribe(
    topics,
    (result) => {
      const { key } = result.message;

      console.log(`Message ${channelString} :: ${key}`);
      ws.emit(channelString, JSON.stringify({
        stream: channelString,
        market: params.market,
        data: self.query(params)
      }));
    }
  );

  this.consumer = consumer;

  return {
    message: ResponseMessage.SUCCESS_SUB,
    stream: channelString,
    ...params
  };
}

export function unsubscribeHelper() {
  kafkaConsumer.unsubscribe(this.consumer);
  return { message: ResponseMessage.SUCCESS_UNSUB };
}
