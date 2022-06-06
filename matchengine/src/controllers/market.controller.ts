import marketService from '../services/market.service';

class MarketController {
  list() {
    return marketService.list();
  }
}

export default new MarketController();
