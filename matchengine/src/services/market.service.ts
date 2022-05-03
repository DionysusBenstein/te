import config from '../config/matchengine.config';
import orderService from './order.service';

class MarketService {
  async list() {
    return config.markets;
  }

  async summary({ markets }) {
    const result = [];
    // TODO: Needs to refactor
    for (const market of markets) {
      const summary = orderService.getMarketStatus(market);
      result.push(summary)
    }

    return result;
  }
}

export default new MarketService();
