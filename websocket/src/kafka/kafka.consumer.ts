import { Kafka } from 'kafkajs';
import {v4 as uuidv4} from 'uuid';
import config from '../config/kafka.config';

const { clientId, brokers } = config;
const kafka = new Kafka({
  clientId,
  brokers,
});

export async function subscribe(topic: string, eachMessage) {
  try {
    const groupId = uuidv4()
    const consumer = kafka.consumer({ groupId });

    console.log('Connecting to Kafka...');
    await consumer.connect();
    console.log(`✅ Connected to Kafka consumer (id: ${groupId})`);

    await consumer.subscribe({ topic });
    await consumer.run({ eachMessage });

    return consumer;
  } catch (err) {
    console.error(`ERROR::CONSUMER:: ${err}`);
  }
}

export function unsubscribe(consumer: any) {
  try {
    consumer.disconnect();
    return 'Channel unsubscribed successfully';
  } catch (err) {
    console.error(`ERROR::CONSUMER:: ${err}`);
  }
}
