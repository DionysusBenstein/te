import balanceController from "./controllers/balance.controller";
import marketController from "./controllers/market.controller";
import orderController from "./controllers/order.controller";
import { BalanceHistoryParams } from "./dto/balance-history-params.dto";
import { FinishedDetailParams } from "./dto/finished-detail-params.dto";
import { MarketUserDealsParams } from "./dto/market-user-deals-params.dto";
import { OrderDealsParams } from "./dto/order-deals-params.dto";
import { OrderFinishedParams } from "./dto/order-finished-params.dto";
import marketService from "./services/market.service";
import { validateAndConvert } from "./utils/validation.util";

export const methods = {
  balance: {
    async history(args: BalanceHistoryParams, callback) {
      callback(null, await balanceController.history(args));
    },
  },

  order: {
    async deals(args: OrderDealsParams, callback) {
      callback(null, await orderController.deals(args));
    },

    async finished(args: OrderFinishedParams, callback) {
      callback(null, await orderController.finished(args));
    },

    async finished_detail(args: FinishedDetailParams, callback) {
      callback(null, await orderController.finished_detail(args));
    },
  },

  market: {
    async user_deals(args: MarketUserDealsParams, callback) {
      callback(null, await marketController.user_deals(args));
    },
  },
};
