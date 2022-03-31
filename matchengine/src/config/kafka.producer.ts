import { Kafka } from 'kafkajs';

const clientId = 'matchengine';
const brokers = ['kafka:9092'];
const topic = 'message-log';

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
