import { MarketStatusTodayParams } from './../dto/market-status-today-params.dto';
import { MarketStatusParams } from './../dto/market-status-params.dto';
import { MarketDealsParams } from './../dto/market-deals-params.dto';
import { MarketLastParams } from '../dto/market-last-params.dto';
import { KlineParams } from '../dto/kline-params.dto';
import { KafkaTopic } from '../typings/enums/enums';
import { onDealMessage } from '../utils/market.util';
import { KlineInfo, MarketStatus } from '../typings/types/market-info.type';
import config from '../config/marketprice.config';
import client from '../config/router.config';
import { deasyncRequestHelper } from '../utils/deasync.util';
import { mergeKlineInfo } from '../utils/kline.util';
import { sequelize, redisClient } from '../config/database.config';
import kafkaConsumer from '../kafka/kafka.consumer';
import { onOrderMessage } from '../utils/orderbook.util';

export class MarketService {
  constructor(private client: typeof redisClient) {
    kafkaConsumer.subscribe(KafkaTopic.DEALS, onDealMessage);
    kafkaConsumer.subscribe(KafkaTopic.ORDERS, onOrderMessage);

  }

  async getLast({ market }: MarketLastParams) {
    const [lastDeal] = await this.client.lRange(`${market}:deals`, 0, 0);
    if (!lastDeal) return null;
    const { price } = JSON.parse(lastDeal);
    return { market, price };
  }

  async getDeals({ offset, limit, market }: MarketDealsParams) {
    const dealsList = await this.client.lRange(`${market}:deals`, 0, -1);
    const total = await this.client.lLen(`${market}:deals`);

    return {
      offset,
      limit,
      total,
      records: dealsList.map((deal) => JSON.parse(deal)).slice(offset, limit),
    };
  }

  async getStatus({ period, market }: MarketStatusParams) {
    const { timeframes } = config;
    const klineData = await this.client.hGetAll(`k:${market}:1`);
    const [lastDeal] = await this.client.lRange(`${market}:deals`, 0, 0);
    if (!lastDeal) return null;
    const { price } = JSON.parse(lastDeal);

    const end = Date.now() / 1000;
    const start = end - period;
    const klines: KlineInfo[] = [];

    for (let time of Object.keys(klineData)) {
      const intTime = parseInt(time);

      const timeframeStart = Math.floor(start / timeframes['1']);
      const timeframeEnd = Math.floor(end / timeframes['1']);

      if (intTime >= timeframeStart && intTime <= timeframeEnd) {
        klines.push(JSON.parse(klineData[time]));
      }
    }

    const singleKline: KlineInfo = mergeKlineInfo(klines);
    singleKline.time = undefined;

    const status: MarketStatus = {
      period,
      last: price,
      ...singleKline,
    };

    return status;
  }

  async getStatusToday({ market }: MarketStatusTodayParams) {
    const status: MarketStatus = await this.getStatus({ market, period: 86400 });

    if (!status) {
      return {
        open: 0,
        last: 0,
        high: 0,
        low: 0,
        volume: 0
      };
    }

    status.period = undefined;
    return status;
  }

  async getKline({ market, start, end, interval, offset, limit }: KlineParams) {
    const { timeframes } = config;
    const allKlines = await this.client.hGetAll(`k:${market}:${interval}`);
    if (!allKlines) return null;
    const klines: KlineInfo[] = [];

    if (!(start && end)) {
      for (let time of Object.keys(allKlines)) {
        klines.push(JSON.parse(allKlines[time]));
      }
      return klines.slice(offset, limit);
    }

    for (let time of Object.keys(allKlines)) {
      const intTime = parseInt(time);

      const timeframeStart = Math.floor(start / timeframes[interval]);
      const timeframeEnd = Math.floor(end / timeframes[interval]);

      if (intTime >= timeframeStart && intTime <= timeframeEnd) {
        klines.push(JSON.parse(allKlines[time]));
      }
    }

    return klines.slice(offset, limit);
  }

  async summary() {
    const marketList: any = deasyncRequestHelper('market.list', {}, client);
    return Promise.all(marketList.map(async (market: any) => {
      const status: any = await this.getStatusToday({ market: market.name });
      const usdPrice = await sequelize.query('SELECT usdPrice from LivPrice WHERE currencyName = :market', {
        replacements: {
          market
        }
      });
      const percentChange: number = -(100 - status.close / status.open * 100).toFixed(3) || 0;
      const change: number = status.close - status.open || 0;
      const colour = change >= 0 ? "green" : "red";

      return {
        pairId: market.pairId,
        pairName: `${market.stock}-${market.money}`,
        percentChange,
        change,
        colour,
        price: status.last,
        usdPrice,
        xdcPrice: 100,
        favStatus: "inActive",
        ...status
      }
    }));
  }
}

export default new MarketService(redisClient);
