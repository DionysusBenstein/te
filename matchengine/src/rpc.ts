import assetController from './controllers/asset.controller';
import marketController from './controllers/market.controller';
import balanceController from './controllers/balance.controller';
import orderController from './controllers/order.controller';
import orderService from './services/order.service';

export const methods = {
  asset: {
    list(args, callback) {
      const response = assetController.list();
      callback(null, response);
    },

    async summary(args, callback) {
      const response = await assetController.summary(args);

      callback(null, response);
    },
  },

  balance: {
    async query(args, callback) {
      callback(null, await balanceController.query(args));
    },

    async update(args, callback) {
      callback(null, await balanceController.update(args));
    },
  },

  order: {
    async put_limit(args, callback) {
      callback(null, await orderController.putLimit(args));
    },

    async put_market(args, callback) {
      callback(null, await orderController.putMarket(args));
    },

    async cancel(args, callback) {
      callback(null, await orderController.cancel(args));
    },

    async book(args, callback) {
      callback(null, await orderController.book(args));
    },

    async depth(args, callback) {
      callback(null, await orderController.depth(args));
    },

    async pending(args, callback) {
      callback(null, await orderController.pending(args));
    },

    async pending_detail(args, callback) {
      callback(null, await orderController.pending_detail(args));
    },

    settle_book(args, callback) {
      callback(null, orderService.getSettleBookSize());
    }
  },

  market: {
    async list(args, callback) {
      callback(null, marketController.list());
    },

    async summary(args, callback) {
      callback(null, await marketController.summary(args));
    },
  },
};
