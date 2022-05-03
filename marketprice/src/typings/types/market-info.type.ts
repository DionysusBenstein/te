export type Deal = {
  id: string;
  type: number;
  price: number;
  amount: number;
  total: number;
  time: string;
};

export type MarketStatus = {
  period: number;
  open: number;
  last: number;
  high: number;
  low: number;
  volume: number;
};

export type KlineInfo = {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
};
