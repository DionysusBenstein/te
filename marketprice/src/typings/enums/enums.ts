export enum OrderSide {
  ASK = 'sell',
  BID = 'buy',
}

export enum OrderEvent {
  PUT = 'ORDER_EVENT_PUT',
  CANCEL = 'ORDER_EVENT_CANCEL',
  PARTIALLY_FINISH = 'ORDER_PARTIALLY_FINISH',
  FINISH = 'ORDER_EVENT_FINISH',
}

export enum KafkaTopic {
  DEALS = 'deals',
  ORDERS = 'orders',
  BALANCES = 'balances',
}
