import { MarketStatusTodayParams } from "./../dto/market-status-today-params.dto";
import { MarketStatusParams } from "./../dto/market-status-params.dto";
import { MarketDealsParams } from "./../dto/market-deals-params.dto";
import client from "../config/database.config";
import { MarketLastParams } from "../dto/market-last-params.dto";

class MarketService {
  async getLast({ market: marketName }: MarketLastParams) {
    const market = JSON.parse(await client.get(marketName));
    if (!market) return null;
    return market.deals[market.deals.length - 1];
  }

  async getDeals({ limit, last_id, market: marketName }: MarketDealsParams) {
    const market = JSON.parse(await client.get(marketName));
    if (!market) return null;
    return (
      market.deals
        // .sort((a, b) => a.id - b.id)
        .slice(last_id, limit + last_id)
    );
  }

  async getStatus({ period, market: marketName }: MarketStatusParams) {
    const market = JSON.parse(await client.get(marketName));
    if (!market) return null;
    const schema = {
      period,
      open: "0",
      last: "0",
      high: "0",
      low: "0",
      deal: "0",
      volume: "0",
    };
    return market.deals.reduce((a, deal) => {
      const checkTime =
        Date.now() / 1000 - period < deal.time && deal.time < Date.now() / 1000;
      if (checkTime) {
        a.last = deal.price;
        if (+a.high < +deal.price) a.high = deal.price;
        if (+a.low > +deal.price || +a.low === 0) a.low = deal.price;
      }
      return a;
    }, schema);
  }

  async getStatusToday({ market: marketName }: MarketStatusTodayParams) {
    const market = JSON.parse(await client.get(marketName));
    if (!market) return null;
    const schema = {
      open: "0",
      last: "0",
      high: "0",
      low: "0",
      deal: "0",
      volume: "0",
    };
    return market.deals.reduce((a, deal) => {
      const checkTime =
        Date.now() / 1000 - 86400 < deal.time && deal.time < Date.now() / 1000;
      if (checkTime) {
        a.last = deal.price;
        if (+a.high < +deal.price) a.high = deal.price;
        if (+a.low > +deal.price || +a.low === 0) a.low = deal.price;
      }
      return a;
    }, schema);
  }
}

export default new MarketService();
