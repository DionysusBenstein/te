import { MarketUserDealsParams } from "../dto/market-user-deals-params.dto";
import marketService from "../services/market.service";
import { validateAndConvert } from "../utils/validation.util";

class MarketController {
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
      records: await marketService.getUserDeals(data),
    };
  }
}

export default new MarketController();
