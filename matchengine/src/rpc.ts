import assetController from './controllers/asset.controller';
import marketController from './controllers/market.controller';
import balanceController from './controllers/balance.controller';
import orderController from './controllers/order.controller';

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
      const response = {
        message: 'order.put_market is working!',
        args,
      };

      callback(null, response);
    },

    async cancel(args, callback) {
      const response = {
        message: 'order.cancel is working!',
        args,
      };

      callback(null, response);
    },

    async book(args, callback) {
      callback(null, await orderController.book(args));
    },

    async depth(args, callback) {
      const response = {
        message: 'order.depth is working!',
        args,
      };

      callback(null, response);
    },

    async pending(args, callback) {
      callback(null, await orderController.pending(args));
    },

    async pending_detail(args, callback) {
      callback(null, await orderController.pending_detail(args));
    },
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
