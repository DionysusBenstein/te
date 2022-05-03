import { OrderSide, OrderType, BusinessEnum, MarketRole } from './enums';

export type Order = {
  id: string;
  user_id: string;
  type: OrderType;
  side: OrderSide;
  market: string;
  status: string;
  price?: number;
  amount: number;
  total?: number;
  total_fee: number;
  deal_money: number;
  deal_stock: number;
  create_time: string;
  update_time: string;
};

export type Deal = {
  id: string;
  user_id: string;
  order_id: string;
  deal_order_id: string;
  market: string;
  role: MarketRole;
  price: number;
  amount: number;
  total: number;
  deal: number;
  fee: number;
  deal_fee: number;
  time: string;
};

export type Balance = {
  user_id: string;
  balance: number;
  change: number;
  asset: string;
  business: BusinessEnum;
  detail: string;
  time: string;
};

export type Market = {
  name: string;
  money: string;
  stock: string;
  asks: Order[];
  bids: Order[];
};

export type AssetConfig = {
  name: string;
  prec?: number;
};

export type MarketConfig = {
  name: string;
  minAmount: number;
  stock: string;
  money: string;
};

export type MatchEngineConfig = {
  assets: AssetConfig[];
  markets: MarketConfig[];
};
