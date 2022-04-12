import { OrderSide, OrderType, BusinessEnum, MarketRole } from './enums';

export type Order = {
  id: string;
  user_id: string;
  type: OrderType;
  side: OrderSide;
  price?: number;
  amount: number;
  market: string;
  taker_fee: number;
  maker_fee: number;
  deal_money: number;
  deal_stock: number;
  deal_fee: number;
  create_time: string;
  finish_time: string;
};

export type Deal = {
  id: string;
  user_id: string;
  order_id: string;
  deal_order_id: string;
  role: MarketRole;
  price: number;
  amount: number;
  deal: number;
  fee: number;
  deal_fee: number;
  time: string;
};

export type Market = {
  name: string;
  money: string;
  stock: string;
  asks: Order[];
  bids: Order[];
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

export type Asset = {
  id: string;
  name: string;
  precSave: number;
  precShow: number;
};
