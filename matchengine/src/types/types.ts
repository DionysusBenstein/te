import { OrderSide, OrderType, BusinessEnum } from './enums';

export type Order = {
  id: string,
  user_id: number,
  type: OrderType,
  side: OrderSide,
  price: number;
  amount: number;
  market: string;
  taker_fee: number,
  maker_fee: number,
  deal_money: number,
  deal_stock: number,
  deal_fee: number,
  create_time: string,
  finish_time: string
}

export type Market = {
  name: string;
  money: string;
  stock: string;
  asks: Order[];
  bids: Order[];
}

export type Balance = {
  id: number,
  user_id: number,
  balance: number,
  change: number,
  asset: string,
  business: BusinessEnum,
  detail: string,
  time: string
}

export type Asset = {
  name: string,
  precSave: number,
  precShow: number,
}