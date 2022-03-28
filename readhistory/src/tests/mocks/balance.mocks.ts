import { BalanceHistory } from "../../typings/types/balance-history.return-type";

export const balanceHistoryMock: BalanceHistory[] = [
  {
    balance: 1,
    business_id: 1,
    change: 1,
    detail: "mock detail 1",
    id: 1,
    time: "2019-09-09",
    user_id: 1,
    asset: "BTC",
    business: "mock business type 1",
  },
  {
    balance: 2,
    business_id: 2,
    change: 2,
    detail: "mock detail 2",
    id: 2,
    time: "2020-09-09",
    user_id: 2,
    asset: "BTC",
    business: "mock business type 2",
  },
];
