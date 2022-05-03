import { KlineInfo } from '../typings/types/market-info.type';

export function createKlineInfo(price: number): KlineInfo {
  const kinfo: KlineInfo = {
    time: Date.now(),
    open: price,
    close: price,
    high: price,
    low: price,
    volume: 0,
  };

  return kinfo;
}

export function updateKlineInfo(
  kinfo: KlineInfo,
  price: number,
  amount: number
) {
  kinfo.volume += amount;
  kinfo.close = price;

  if (price > kinfo.high) {
    kinfo.high = price;
  }

  if (price < kinfo.low) {
    kinfo.low = price;
  }
}

export function mergeKlineInfo(klines: KlineInfo[]): KlineInfo {
  let newKline: KlineInfo = {
    time: klines[0].time,
    open: klines[0].open,
    close: klines[klines.length - 1].close,
    high: 0,
    low: klines[0].low,
    volume: 0
  }

  return klines.reduce((acc: KlineInfo, kline: KlineInfo) => {
    acc.volume += kline.volume;
    if (kline.high > acc.high) {
      acc.high = kline.high;
    }

    if (kline.low < acc.low) {
      acc.low = kline.low;
    }

    return acc;
  }, newKline);
}
