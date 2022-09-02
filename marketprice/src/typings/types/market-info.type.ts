export type Deal = {
  id: string;
  type: string;
  price: number;
  stockUsdPrice: number;
  moneyUsdPrice: number;
  amount: number;
  total: number;
  time: string;
};

export type MarketStatus = {
  period?: number;
  open: number;
  prev: number;
  last: number;
  high: number;
  low: number;
  volume: number;
  volumeMoney: number;
  stockUsdPrice: number;
  moneyUsdPrice: number;
};

export type KlineInfo = {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  volumeMoney: number;
};
