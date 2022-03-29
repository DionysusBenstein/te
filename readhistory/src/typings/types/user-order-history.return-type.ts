export type UserOrderHistory = {
  id: number;
  time: string;
  user_id: number;
  market: string;
  deal_id: number;
  order_id: number;
  deal_order_id: number;
  side: number;
  role: number;
  price: number;
  amount: number;
  deal: number;
  fee: number;
  deal_fee: number;
};
