import { Kafka } from 'kafkajs';
import { Producer, KafkaConfig } from 'kafkajs/types';
import config from '../config/kafka.config';

class KafkaProducer {
  kafka: Kafka;
  producer: Producer;

  constructor(kafkaConfig: KafkaConfig) {
    const { clientId, brokers } = kafkaConfig;
    this.kafka = new Kafka({
      clientId,
      brokers,
    });

    this.producer = this.kafka.producer();
  }

  async connect() {
    try {
      console.log('Connecting to Kafka...');
      await this.producer.connect();
      console.log('✅ Connected to Kafka');
    } catch (err) {
      console.error(`ERROR::PRODUCER:: ${err}`);
    }
  }

  async pushMessage(topic: string, value: string) {
    try {
      const result = await this.producer.send({
        topic,
        messages: [{ value }],
      });
      console.log(`Sent Successfully! ${JSON.stringify(result)}`);
    } catch (err) {
      console.error(`ERROR::PRODUCER:: ${err}`);
    }
  }
}

export default new KafkaProducer(config);
