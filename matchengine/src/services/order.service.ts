import { PutLimitParams } from '../dto/put-limit-params.dto';
import { PutMarketParams } from '../dto/put-market-params.dto';
import { OrderBookParams } from '../dto/order-book-params.dto';
import { PendingParams } from '../dto/pending-params.dto';
import { PendingDetailParams } from '../dto/pending-detail-params.dto';
import { CancelParams } from '../dto/cancel-params.dto';
import { DepthParams } from '../dto/depth-params.dto';

import { v4 as uuidv4 } from 'uuid';
import config from '../config/matchengine.config';
import db from '../database/queries';
import { getCurrentTimestamp } from '../utils/time.util';
import { appendOrderDeal, appendTradeBalance } from '../utils/trade.util';
import kafkaProducer from '../kafka/kafka.producer';
import { Market, Order } from '../types/types';
import { OrderSide, OrderType, KafkaTopic, OrderEvent } from '../types/enums';

class OrderService {
  markets: Market[] = [];
  settleBookSize: number;

  constructor(config: any) {
    for (const marketConf of config.markets) {
      const { name, stock, money } = marketConf;
      this.settleBookSize = 0;

      const market: Market = {
        name,
        stock: stock.name,
        money: money.name,
        asks: [],
        bids: [],
      };

      this.markets.push(market);
    }
  }

  getMarketByName(marketName: string): Market {
    return this.markets.find((market) => market.name === marketName);
  }

  executeAskLimitOrder(order: Order): Order {
    const { bids, asks }: Market = this.getMarketByName(order.market);
    let dealOrder: Order;

    for (const [i, bid] of bids.entries()) {
      if (order.price <= bid.price) {
        [dealOrder] = bids.splice(i, 1);
        return dealOrder;
      }
    }

    asks.push(order);
    return dealOrder;
  }

  executeBidLimitOrder(order: Order): Order {
    const { bids, asks }: Market = this.getMarketByName(order.market);
    let dealOrder: Order;

    for (const [i, ask] of asks.entries()) {
      if (order.price >= ask.price) {
        [dealOrder] = asks.splice(i, 1);
        return dealOrder;
      }
    }

    bids.push(order);
    return dealOrder;
  }

  executeAskMarketOrder(order: Order): boolean {
    const { bids }: Market = this.getMarketByName(order.market);

    if (bids.length <= 0) {
      return false;
    }

    bids.sort((a, b) => b.price - a.price);
    bids.splice(0, 1);

    return true;
  }

  executeBidMarketOrder(order: Order): boolean {
    const { asks }: Market = this.getMarketByName(order.market);

    if (asks.length <= 0) {
      return false;
    }

    asks.sort((a, b) => a.price - b.price);
    asks.splice(0, 1);

    return true;
  }

  async putLimit({
    user_id,
    market,
    side,
    price,
    amount,
    taker_fee,
    maker_fee,
    ...params
  }: PutLimitParams) {
    const { money, stock } = this.getMarketByName(market);
    const { balance } = await db.getLastBalance(user_id, [money]);

    if (side === OrderSide.BID && balance < amount) {
      return { message: 'Balance not enough' };
    }

    const order: Order = {
      id: uuidv4(),
      user_id,
      type: OrderType.LIMIT,
      side,
      price,
      amount,
      market,
      taker_fee,
      maker_fee,
      deal_money: amount - maker_fee,
      deal_stock: amount / price - taker_fee,
      deal_fee: taker_fee + maker_fee,
      create_time: getCurrentTimestamp(),
      finish_time: 'infinity',
    };

    await db.appendOrderHistory(order);

    let dealOrder: Order;
    if (side === OrderSide.ASK) {
      await appendTradeBalance(user_id, -order.deal_money, money);
      dealOrder = this.executeAskLimitOrder(order);
    } else {
      await appendTradeBalance(user_id, -order.deal_stock, stock);
      dealOrder = this.executeBidLimitOrder(order);
    }

    if (dealOrder) {
      const finishTimestamp = getCurrentTimestamp();

      order.finish_time = finishTimestamp;
      dealOrder.finish_time = finishTimestamp;

      await db.updateOrder(order.id, finishTimestamp);
      await db.updateOrder(dealOrder.id, finishTimestamp);

      await appendTradeBalance(dealOrder.user_id, dealOrder.deal_stock, stock);
      await appendOrderDeal(order, dealOrder);
      await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH);

      this.settleBookSize++;
      return order;
    }

    await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.PUT);
    return order;
  }

  async putMarket({
    user_id,
    market,
    side,
    amount,
    taker_fee,
    maker_fee,
    ...params
  }: PutMarketParams) {
    const { money } = this.getMarketByName(market);
    const { balance } = await db.getLastBalance(user_id, [money]);

    if (side === OrderSide.BID && balance < amount) {
      return { message: 'Balance not enough' };
    }

    const order: Order = {
      id: uuidv4(),
      user_id,
      type: OrderType.LIMIT,
      side,
      amount,
      market,
      taker_fee,
      maker_fee,
      deal_money: amount - maker_fee,
      deal_stock: amount - taker_fee,
      deal_fee: taker_fee + maker_fee,
      create_time: getCurrentTimestamp(),
      finish_time: 'infinity',
    };

    let isExecuted: any;
    if (side === OrderSide.ASK) {
      isExecuted = this.executeAskMarketOrder(order);
    } else {
      isExecuted = this.executeBidMarketOrder(order);
    }

    if (isExecuted) {
      order.finish_time = getCurrentTimestamp();
      this.settleBookSize++;
      // sendMessage('ORDER_MARKET_FINISH');
      return order;
    }

    return 'Order book is empty';
  }

  async cancel({ user_id, market, order_id, ...params }: CancelParams) {
    const { asks, bids, money }: Market = this.getMarketByName(market);
    let order: Order;

    let orderIndex: number = asks.findIndex(
      (order) => order.id === order_id && order.user_id === user_id
    );

    if (orderIndex < 0) {
      orderIndex = bids.findIndex(
        (order) => order.id === order_id && order.user_id === user_id
      );
      [order] = bids.splice(orderIndex, 1);
      await appendTradeBalance(user_id, order.deal_money, money);
      return order;
    }

    if (orderIndex < 0) {
      return 'Order not found';
    }

    [order] = asks.splice(orderIndex, 1);
    await appendTradeBalance(user_id, order.deal_money, money);
    return order;
  }

  book({ market, side, limit, offset }: OrderBookParams): any {
    const marketObj: Market = this.getMarketByName(market);

    if (side === OrderSide.ASK) {
      return {
        total: marketObj.asks.length,
        records: marketObj.asks.slice(offset, limit),
      };
    }

    return {
      total: marketObj.bids.length,
      records: marketObj.bids.slice(offset, limit),
    };
  }

  async depth({ market, limit }: DepthParams) {
    const { asks, bids }: Market = this.getMarketByName(market);
    const ask = [
      asks.slice(0, limit).reduce((acc, ask) => acc + ask.price, 0),
      asks.slice(0, limit).reduce((acc, ask) => acc + ask.amount, 0),
    ];

    const bid = [
      bids.slice(0, limit).reduce((acc, bid) => acc + bid.price, 0),
      bids.slice(0, limit).reduce((acc, bid) => acc + bid.amount, 0),
    ];

    return { asks: ask, bids: bid };
  }

  pending({ user_id, market, offset, limit }: PendingParams) {
    const { asks, bids }: Market = this.getMarketByName(market);
    const askOrders = asks.filter((order) => order.user_id == user_id);
    const bidOrders = bids.filter((order) => order.user_id == user_id);
    const userOrders = [...askOrders, ...bidOrders];

    return {
      total: userOrders.length,
      records: userOrders.slice(offset, limit),
    };
  }

  pending_detail({ order_id, market }: PendingDetailParams) {
    const { asks, bids }: Market = this.getMarketByName(market);

    let order: Order = asks.find((order) => order.id === order_id);

    if (!order) {
      order = bids.find((order) => order.id === order_id);
    }

    if (!order) {
      return 'Order not found';
    }

    return order;
  }

  getMarketStatus(marketName: string) {
    const market: Market = this.getMarketByName(marketName);

    const ask_amount = market.asks.reduce((acc, ask) => acc + ask.amount, 0);
    const bid_amount = market.bids.reduce((acc, bid) => acc + bid.amount, 0);

    return {
      ask_count: market.asks.length,
      ask_amount,
      bid_count: market.bids.length,
      bid_amount,
    };
  }

  getSettleBookSize() {
    return this.settleBookSize;
  }
}

export default new OrderService(config);
