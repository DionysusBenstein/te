export type OrderHistory = {
  id: number;
  create_time: string;
  update_time: string;
  user_id: number;
  market: string;
  source: string;
  t: number;
  side: number;
  price: number;
  amount: number;
  taker_fee: number;
  maker_fee: number;
  deal_stock: number;
  deal_money: number;
  deal_fee: number;
};
