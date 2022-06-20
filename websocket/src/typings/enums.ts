export enum Method {
  // Trade API
  ORDER_DEPTH = 'order.depth',
  ORDER_BOOK = 'order.book',
  ORDER_PENDING = 'order.pending',
  ORDER_FINISHED = 'order.finished',
  // Asset API
  BALANCE_QUERY = 'balance.query',
  BALANCE_HISTORY = 'balance.history',
  // Market API
  MARKET_DEALS = 'market.deals',
  MARKET_STATUS = 'market.status',
  MARKET_STATUS_TODAY = 'market.status_today',
  MARKET_LAST = 'market.last',
  MARKET_KLINE = 'market.kline',
  MARKET_SUMMARY = 'market.summary'
}

export enum KafkaTopic {
  DEALS = 'deals',
  ORDERS = 'orders',
  BALANCES = 'balances',
}

export enum SocketEvent {
  DEPTH = 'depth',
  BOOK = 'book',
  KLINE = 'kline',
  PRICE = 'price',
  STATE = 'state',
  TODAY = 'today',
  DEAL = 'deal',
  ORDER = 'order',
  ASSET = 'asset',
  SUMMARY = 'summary',
}

export enum ResponseMessage {
  SUCCESS_SUB = 'Channel subscribed successfully',
  SUCCESS_UNSUB = 'Channel unsubscribed successfully',
  SUCCESS_NOTIFY = 'Notification sent successfully',
}
