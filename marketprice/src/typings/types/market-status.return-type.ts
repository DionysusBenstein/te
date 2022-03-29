import { MarketStatusToday } from "./market-status-today.return-type";

export type MarketStatus = {
  period: number;
} & MarketStatusToday;
