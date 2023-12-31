import { KlineInfo } from '../typings/types/market-info.type';

export function createKlineInfo(price: number, time?: any): KlineInfo {
  const kinfo: KlineInfo = {
    time: time ? time : Date.now(),
    open: price,
    close: price,
    high: price,
    low: price,
    volume: 0,
    volumeMoney: 0,
  };

  return kinfo;
}

export function updateKlineInfo(
  kinfo: KlineInfo,
  price: number,
  amount: number,
  total: number
) {
  if (!kinfo.volumeMoney) {
    kinfo.volumeMoney = 0;
  }

  kinfo.volume += amount;
  kinfo.volumeMoney += total;
  kinfo.close = price;

  if (price > kinfo.high) {
    kinfo.high = price;
  }

  if (price < kinfo.low) {
    kinfo.low = price;
  }
}

export function mergeKlineInfo(klines: KlineInfo[]): KlineInfo {
  if (klines.length <= 0) {
    return {
      time: 0,
      open: 1,
      close: 1,
      high: 1,
      low: 1,
      volume: 0,
      volumeMoney: 0
    }
  }

  let newKline: KlineInfo = {
    time: klines[0].time,
    open: klines[0].open,
    close: klines[klines.length - 1].close,
    high: 0,
    low: klines[0].low,
    volume: 0,
    volumeMoney: 0
  }

  return klines.reduce((acc: KlineInfo, kline: KlineInfo) => {
    acc.volume += kline.volume || 0;
    acc.volumeMoney += kline.volumeMoney || 0;

    if (kline.high > acc.high) {
      acc.high = kline.high;
    }

    if (kline.low < acc.low) {
      acc.low = kline.low;
    }

    return acc;
  }, newKline);
}
