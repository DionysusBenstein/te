import balanceController from "./controllers/balance.controller";
import { BalanceHistoryParams } from "./dto/balance-history-params.dto";
import { validateAndConvert } from "./utils/validation.util";

export const methods = {
  balance: {
    async history(args: BalanceHistoryParams, callback) {
      const response = {
        message: "balance.history is working!",
        result: await balanceController.history(args),
      };

      callback(null, response);
    },
  },

  order: {
    async deals(args, callback) {
      const response = {
        message: "order.deals is working!",
        args,
      };

      callback(null, response);
    },

    async finished(args, callback) {
      const response = {
        message: "order.finished is working!",
        args,
      };

      callback(null, response);
    },

    async finished_detail(args, callback) {
      const response = {
        message: "order.finished_detail is working!",
        args,
      };

      callback(null, response);
    },
  },

  market: {
    async user_deals(args, callback) {
      const response = {
        message: "market.user_deals is working!",
        args,
      };

      callback(null, response);
    },
  },
};
