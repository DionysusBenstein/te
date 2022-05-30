import orderService, { OrderService } from '../services/order.service';
import { OrderbookParams } from '../dto/orderbook-params.dto';

export class OrderController {
    constructor(private orderService: OrderService) {}

    async asks(params: OrderbookParams) {
        return await this.orderService.asks(params.market);
    }

    async bids(params: OrderbookParams) {
        return await orderService.bids(params.market);
    }

    async book(params: OrderbookParams) {
        return {
            asks: await this.orderService.asks(params.market),
            bids: await this.orderService.bids(params.market)
        }
    }
}

export default new OrderController(orderService);