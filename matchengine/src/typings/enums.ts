export enum OrderSide {
  ASK = 'sell',
  BID = 'buy',
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

export enum OrderStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PARTIALLY = 'partially',
  CANCELED = 'cancelled',
  PARTIALLY_CANCELED = 'partially cancelled'
}

export enum BalanceType {
  FREEZE = 'freeze',
  AVAILABLE = 'available'
}

export enum OrderEvent {
  PUT = 'ORDER_EVENT_PUT',
  CANCEL = 'ORDER_EVENT_CANCEL',
  UPDATE = 'ORDER_EVENT_UPDATE',
  PARTIALLY_FINISH = 'ORDER_PARTIALLY_FINISH',
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
