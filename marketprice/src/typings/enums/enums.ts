export enum OrderEvent {
  PUT = 'ORDER_EVENT_PUT',
  UPDATE = 'ORDER_EVENT_UPDATE',
  PARTIALLY_FINISH = 'ORDER_PARTIALLY_FINISH',
  FINISH = 'ORDER_EVENT_FINISH',
}

export enum KafkaTopic {
  DEALS = 'deals',
  ORDERS = 'orders',
  BALANCES = 'balances',
}
