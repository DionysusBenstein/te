import { v4 as uuidv4 } from 'uuid';
import { Deal, KlineInfo } from '../typings/types/market-info.type';
import redisClient from '../config/database.config';
import { createKlineInfo, updateKlineInfo } from './kline.util';
import { toUnixTime } from './time.util';
import config from '../config/marketprice.config';

// redis key naming for kline data -> `k:${market}:%{timeframe}`. For example k:BTCEUR:1D.

export async function marketUpdate(dealInfo: any) {
  const { timeframes } = config;
  const deal: Deal = {
    id: dealInfo.id,
    type: dealInfo.side,
    price: dealInfo.price,
    stockUsdPrice: dealInfo.stock_usd_price,
    moneyUsdPrice: dealInfo.money_usd_price,
    amount: dealInfo.amount,
    total: dealInfo.total,
    time: dealInfo.time,
  };

  await redisClient.set(`${dealInfo.market}:last`, dealInfo.price);
  await redisClient.lPush(`${dealInfo.market}:deals`, JSON.stringify(deal));

  let kinfo: KlineInfo;

  for (const [timeframe, sec] of Object.entries(timeframes)) {
    let unixTime: number = toUnixTime(deal.time);
    unixTime = Math.floor(unixTime / sec);

    const existingKline: string = await redisClient.hGet(
      `k:${dealInfo.market}:${timeframe}`,
      unixTime.toString()
    );

    if (existingKline) {
      kinfo = JSON.parse(existingKline);
    } else {
      // For correct migrate data
      kinfo = createKlineInfo(deal.price);
      // const ktime =  Math.floor((new Date(deal.time).getTime()));
      // kinfo = createKlineInfo(deal.price, ktime);
    }

    updateKlineInfo(kinfo, deal.price, deal.amount, deal.total);
    await redisClient.hSet(
      `k:${dealInfo.market}:${timeframe}`,
      unixTime,
      JSON.stringify(kinfo)
    );
  }
}

export async function onDealMessage(result) {
  let { value: dealInfo } = result.message;
  dealInfo = JSON.parse(dealInfo);
  await marketUpdate(dealInfo);
}


