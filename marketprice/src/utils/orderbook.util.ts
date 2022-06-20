import { OrderEvent, OrderSide } from '../typings/enums/enums';
import redisClient from '../config/database.config';

export async function orderbookUpdate(event, order: any) {
    let side;

    switch (order.side) {
        case OrderSide.ASK:
            side = 'asks';
            break;
        case OrderSide.BID:
            side = 'bids';
            break;
    }
    switch (event) {
        case OrderEvent.PUT:
            await redisClient.lPush(`${order.market}:${side}`, order.id);
            await redisClient.set(`${order.market}:${side}:${order.id}`, JSON.stringify(order));

            break;
        case OrderEvent.PARTIALLY_FINISH:
            await redisClient.set(`${order.market}:${side}:${order.id}`, JSON.stringify(order));

            break;
        case OrderEvent.FINISH:
        case OrderEvent.CANCEL:
            await redisClient.lRem(`${order.market}:${side}`, 1, order.id);
            await redisClient.del(`${order.market}:${side}:${order.id}`);
    }
}

export async function onOrderMessage(result) {
    let { value: order, key } = result.message;
    await orderbookUpdate(key.toString(), JSON.parse(order));
}
