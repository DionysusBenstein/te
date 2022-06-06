import config from '../config/matchengine.config';

class MarketService {
  async list() {
    return config.markets;
  }
}

export default new MarketService();
