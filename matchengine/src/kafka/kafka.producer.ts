import { Kafka } from 'kafkajs';
import config from '../config/kafka.config'

const { clientId, brokers, topic } = config;

const kafka = new Kafka({
  clientId,
  brokers,
});

const producer = kafka.producer();

export async function sendMessage(value: string) {
  try {
    console.log('Connecting to Kafka...');
    await producer.connect();
    console.log('✅ Connected to Kafka!!!');

    const result = await producer.send({
      topic,
      messages: [{ value }],
    });

    console.log(`Sent Successfully! ${JSON.stringify(result)}`);
  } catch (err) {
    console.error(`ERROR::PRODUCER:: ${err}`);
  }
}
