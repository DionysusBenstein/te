import { MarketSummaryParams } from '../dto/market-summary-params.dto';
import marketService from '../services/market.service';
import { validateAndConvert } from '../utils/validation.util';

class MarketController {
  list() {
    return marketService.list();
  }

  async summary(params: MarketSummaryParams) {
    const { data, errors } = await validateAndConvert(
      MarketSummaryParams,
      params
    );

    if (errors) {   
      return {
        errors,
        message: 'Invalid params!',
      };
    }

    return await marketService.summary(data);
  }
}

export default new MarketController();
