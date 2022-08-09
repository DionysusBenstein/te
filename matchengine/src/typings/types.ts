import { OrderSide, OrderType, BusinessEnum, MarketRole } from './enums';

export type Order = {
  id: string;
  exchange_id: string;
  exchange_name: string;
  user_id: string;
  type: OrderType;
  side: OrderSide;
  market: string;
  stock: string;
  money: string;
  status: string;
  price?: number;
  amount: number;
  filled_qty: number;
  change_qty?: number;
  total?: number;
  executed_total?: number;
  total_fee: number;
  deal_money: number;
  deal_stock: number;
  create_time: string;
  update_time: string;
};

export type Deal = {
  id: string;
  exchange_id: string;
  exchange_name: string;
  user_id: string;
  deal_user_id: string;
  order_id: string;
  deal_order_id: string;
  side: string;
  market: string;
  stock: string;
  money: string;
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
