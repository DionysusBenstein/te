import { Kafka, logLevel } from 'kafkajs';
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
      retry: {
        initialRetryTime: 3000,
        retries: 10,
      },
      logLevel: logLevel.ERROR
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

  async pushMessage(topic: string, event: string, value=null) {
    try {
      const result = await this.producer.send({
        topic,
        messages: [{ key: event, value: JSON.stringify(value) }],
      });
      console.log(`Sent Successfully! : ${event} : ${value} : ${JSON.stringify(result)}`);
    } catch (err) {
      console.error(`ERROR::PRODUCER:: ${err}`);
    }
  }
}

export default new KafkaProducer(config);
