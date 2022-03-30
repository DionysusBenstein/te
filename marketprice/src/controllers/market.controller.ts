import { MarketStatusTodayParams } from "./../dto/market-status-today-params.dto";
import { MarketStatusParams } from "./../dto/market-status-params.dto";
import { MarketDealsParams } from "./../dto/market-deals-params.dto";
import { MarketLastParams } from "../dto/market-last-params.dto";
import { validateAndConvert } from "../utils/validation.util";
import marketService, { MarketService } from "../services/market.service";

export class MarketController {
  constructor(private marketService: MarketService) {}
  async last(params: MarketLastParams) {
    const { data, errors } = await validateAndConvert(MarketLastParams, params);

    if (errors) {
      return {
        errors,
        message: "Invalid params!",
      };
    }

    return await this.marketService.getLast(data);
  }

  async deals(params: MarketDealsParams) {
    const { data, errors } = await validateAndConvert(
      MarketDealsParams,
      params
    );

    if (errors) {
      return {
        errors,
        message: "Invalid params!",
      };
    }

    return await this.marketService.getDeals(data);
  }

  async status(params: MarketStatusParams) {
    const { data, errors } = await validateAndConvert(
      MarketStatusParams,
      params
    );

    if (errors) {
      return {
        errors,
        message: "Invalid params!",
      };
    }

    return await this.marketService.getStatus(data);
  }

  async status_today(params: MarketStatusTodayParams) {
    const { data, errors } = await validateAndConvert(
      MarketStatusTodayParams,
      params
    );

    if (errors) {
      return {
        errors,
        message: "Invalid params!",
      };
    }

    return await this.marketService.getStatusToday(data);
  }
}

export default new MarketController(marketService);