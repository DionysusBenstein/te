import { Kafka } from 'kafkajs';
import config from '../config/kafka.config';

const { clientId, brokers, topic } = config;

const kafka = new Kafka({
  clientId,
  brokers,
});

export const consumer = kafka.consumer({ groupId: clientId });

export async function connect() {
  try {
    console.log('Connecting to Kafka...');
    await consumer.connect();
    console.log('✅ Connected to Kafka');
    await consumer.subscribe({ topic });
  } catch (err) {
    console.error(`ERROR::CONSUMER:: ${err}`);
  }
}

// console.log('Connecting to Kafka...');
// consumer.connect();
// console.log('✅ Connected to Kafka');

// consumer.subscribe({
//   topic,
//   fromBeginning: true,
// });
