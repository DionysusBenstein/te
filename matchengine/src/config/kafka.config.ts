const { KAFKA_HOST, KAFKA_PORT } = process.env;

export default {
  clientId: 'matchengine',
  brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
};
