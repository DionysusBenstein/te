import { MarketStatusTodayParams } from "./dto/market-status-today-params.dto";
import { MarketLastParams } from "./dto/market-last-params.dto";
import { MarketDealsParams } from "./dto/market-deals-params.dto";
import { MarketStatusParams } from "./dto/market-status-params.dto";
import marketController from "./controllers/market.controller";

export const methods = {
  market: {
    async last(args: MarketLastParams, callback) {
      callback(null, await marketController.last(args));
    },

    async deals(args: MarketDealsParams, callback) {
      callback(null, await marketController.deals(args));
    },

    async kline(args, callback) {
      const response = {
        message: "market.kline is working!",
        args,
      };

      callback(null, response);
    },

    async status(args: MarketStatusParams, callback) {
      callback(null, await marketController.status(args));
    },

    async status_today(args: MarketStatusTodayParams, callback) {
      callback(null, await marketController.status_today(args));
    },
  },
};
