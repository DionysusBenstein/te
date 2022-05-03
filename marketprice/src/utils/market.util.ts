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
    id: uuidv4(),
    type: dealInfo.role,
    price: dealInfo.price,
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
      kinfo = createKlineInfo(deal.price);
    }

    updateKlineInfo(kinfo, deal.price, deal.amount);
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
