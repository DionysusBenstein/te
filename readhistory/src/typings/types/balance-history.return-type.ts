export type BalanceHistory = {
  id: number;
  time: string;
  user_id: number;
  asset: string;
  business: string;
  business_id: number;
  change: number;
  balance: number;
  detail: string;
};
