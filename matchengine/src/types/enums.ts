export enum OrderSide {
  ASK = 'ask',
  BID = 'bid',
}

export enum BusinessEnum {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRADE = 'trade',
}

export enum OrderType {
  LIMIT = 'limit',
  MARKET = 'market',
}

// export enum OrderStatus {
//   NEW = 'new',
//   SUSPENDED = 'suspended',
//   CANCELED = 'canceled',
//   EXPIRED = 'expired',
//   PARTIALLY_FILLED = 'partiallyFilled',
//   FILLED = 'filled',
// }

export enum BalanceType {
  FREEZE = 'freeze',
  AVAILABLE = 'available'
}

export enum OrderEvent {
  PUT = 'ORDER_EVENT_PUT',
  UPDATE = 'ORDER_EVENT_UPDATE',
  FINISH = 'ORDER_EVENT_FINISH',
}

export enum KafkaTopic {
  DEALS = 'deals',
  ORDERS = 'orders',
  BALANCES = 'balances',
}

export enum MarketRole {
  MAKER = 'maker',
  TAKER = 'taker',
}
