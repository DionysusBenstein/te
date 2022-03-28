import { MarketStatusToday } from "../../typings/types/market-status-today.return-type";
import { MarketStatus } from "../../typings/types/market-status.return-type";
import { Market } from "../../typings/types/market.return-type";

export const marketDealsMock: Market[] = [
  {
    id: 2,
    time: 14922697636.238869,
    type: "sell",
    amount: "2.1000",
    price: "2000.00",
  },
  {
    id: 3,
    time: 14932697636.238869,
    type: "buy",
    amount: "3.1000",
    price: "3000.00",
  },
  {
    id: 4,
    time: 14942697636.238869,
    type: "sell",
    amount: "4.1000",
    price: "4000.00",
  },
  {
    id: 5,
    time: 14952697636.238869,
    type: "buy",
    amount: "5.1000",
    price: "5000.00",
  },
];

export const marketLastMock: Market = {
  id: 100,
  time: 1648051527,
  type: "sell",
  amount: "0.1000",
  price: "7000.00",
};

export const marketStatusMock: MarketStatus = {
  period: 1,
  open: "0",
  last: "0",
  high: "0",
  low: "0",
  deal: "0",
  volume: "0",
};
export const marketStatusTodayMock: MarketStatusToday = {
  open: "0",
  last: "0",
  high: "0",
  low: "0",
  deal: "0",
  volume: "0",
};
