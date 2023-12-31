import { Kafka, logLevel } from 'kafkajs';
import { Consumer, KafkaConfig } from 'kafkajs/types';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/kafka.config';

class KafkaConsumer {
  kafka: Kafka;

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
  }

  async subscribe(topic: string, eachMessage): Promise<Consumer> {
    try {
      const groupId: string = uuidv4();
      const consumer: Consumer = this.kafka.consumer({ groupId });

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

  unsubscribe(consumer: any): string {
    try {
      consumer.disconnect();
      return 'Channel unsubscribed successfully';
    } catch (err) {
      console.error(`ERROR::CONSUMER:: ${err}`);
    }
  }
}

export default new KafkaConsumer(config);
