export enum Method {
  // Trade API
  ORDER_DEPTH = 'order.depth',
  ORDER_PENDING = 'order.pending',
  ORDER_FINISHED = 'order.finished',
  BALANCE_QUERY = 'balance.query',
  BALANCE_HISTORY = 'balance.history',
}

export enum KafkaTopic {
  DEALS = 'deals',
  ORDERS = 'orders',
  BALANCES = 'balances',
}

export enum ResponseMessage {
  SUCCESS_SUB = 'Channel subscribed successfully',
  SUCCESS_UNSUB = 'Channel unsubscribed successfully',
  SUCCESS_NOTIFY = 'Notification sent successfully',
}
