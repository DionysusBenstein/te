import redisClient from '../config/database.config';
import kafkaConsumer from '../kafka/kafka.consumer';
import { KafkaTopic } from '../typings/enums/enums';
import { onOrderMessage } from '../utils/orderbook.util';

export class OrderService {
    constructor(private client: typeof redisClient) {
        kafkaConsumer.subscribe(KafkaTopic.ORDERS, onOrderMessage);
    }

    private async orders(market, side) {
        const orders = [];
        const orderIds = await redisClient.lRange(`${market}:${side}`, -1, 0);

        for (const id of orderIds) {
            orders.push(await redisClient.get(`${market}:${side}:${id}`));
        }

        return orders;
    }

    async asks(market) {
        return await this.orders(market, 'asks');
    }

    async bids(market) {
        return await this.orders(market, 'bids');
    }
}

export default new OrderService(redisClient);