import { MarketStatusTodayParams } from './dto/market-status-today-params.dto';
import { MarketLastParams } from './dto/market-last-params.dto';
import { MarketDealsParams } from './dto/market-deals-params.dto';
import { MarketStatusParams } from './dto/market-status-params.dto';
import { OrderbookParams } from './dto/orderbook-params.dto';
import marketController from './controllers/market.controller';
import orderController from './controllers/order.controller';

export const methods = {
  market: {
    async last(args: MarketLastParams, callback) {
      callback(null, await marketController.last(args));
    },

    async deals(args: MarketDealsParams, callback) {
      callback(null, await marketController.deals(args));
    },

    async kline(args, callback) {
      callback(null, await marketController.kline(args));
    },

    async status(args: MarketStatusParams, callback) {
      callback(null, await marketController.status(args));
    },

    async status_today(args: MarketStatusTodayParams, callback) {
      callback(null, await marketController.status_today(args));
    },
  },
  order: {
    async asks(args: OrderbookParams, callback) {
      callback(null, await orderController.asks(args));
    },

    async bids(args: OrderbookParams, callback) {
      callback(null, await orderController.bids(args));
    },

    async book(args: OrderbookParams, callback) {
      callback(null, await orderController.book(args));
    }
  }
};
