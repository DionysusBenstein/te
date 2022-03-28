import { MarketUserDealsParams } from "../dto/market-user-deals-params.dto";
import marketService, { MarketService } from "../services/market.service";
import { validateAndConvert } from "../utils/validation.util";

export class MarketController {
  constructor(private marketService: MarketService) {}
  async user_deals(params: MarketUserDealsParams) {
    const { data, errors } = await validateAndConvert(
      MarketUserDealsParams,
      params
    );

    if (errors) {
      return {
        errors,
        message: "Invalid params!",
      };
    }

    return {
      offset: params.offset,
      limit: params.limit,
      records: await this.marketService.getUserDeals(data),
    };
  }
}

export default new MarketController(marketService);
