const { KAFKA_HOST, KAFKA_PORT } = process.env;

export default {
  clientId: 'websocket',
  brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
};
