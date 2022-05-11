const { KAFKA_HOST, KAFKA_PORT } = process.env;

export default {
  clientId: 'marketprice',
  brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
};
