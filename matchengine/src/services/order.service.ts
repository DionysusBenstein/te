import { v4 as uuidv4 } from 'uuid';
import config from '../config/matchengine.config';
import db from '../database/queries';
import { getCurrentTimestamp } from '../utils/time.util';
import {
  appendOrderDeal,
  getAllPending,
  updateOrderHistory,
} from '../utils/trade.util';
import kafkaProducer from '../kafka/kafka.producer';
import { Market, Order, Deal, MatchEngineConfig } from '../typings/types';
import {
  OrderSide,
  OrderType,
  OrderEvent,
  OrderStatus,
  KafkaTopic,
} from '../typings/enums';

import { PutLimitParams } from '../dto/put-limit-params.dto';
import { PutMarketParams } from '../dto/put-market-params.dto';
import { OrderBookParams } from '../dto/order-book-params.dto';
import { PendingParams } from '../dto/pending-params.dto';
import { PendingDetailParams } from '../dto/pending-detail-params.dto';
import { CancelParams } from '../dto/cancel-params.dto';
import { DepthParams } from '../dto/depth-params.dto';

class OrderService {
  marketList: Market[] = [];
  // NOTE: this is property for testing
  settleBookSize: number;

  constructor(config: MatchEngineConfig) {
    for (const marketConf of config.markets) {
      const { name, stock, money } = marketConf;
      this.settleBookSize = 0;

      const market: Market = {
        name,
        stock,
        money,
        asks: [],
        bids: [],
      };

      this.marketList.push(market);
    }
  }

  getMarketByName(marketName: string): Market {
    return this.marketList.find((market) => market.name === marketName);
  }

  addAskOrder(order: Order) {
    const { asks }: Market = this.getMarketByName(order.market);

    asks.push(order);

    let i = asks.length - 1;
    const ask = asks[i];

    while (i > 0 && ask.price > asks[i - 1].price) {
      asks[i] = asks[i - 1];
      i -= 1;
    }

    asks[i] = ask;
  }

  addBidOrder(order: Order) {
    const { bids }: Market = this.getMarketByName(order.market);

    bids.push(order);

    let i = bids.length - 1;
    const bid = bids[i];

    while (i > 0 && bid.price < bids[i - 1].price) {
      bids[i] = bids[i - 1];
      i -= 1;
    }

    bids[i] = bid;
  }

  async executeAskLimitOrder(order: Order) {
    const { bids }: Market = this.getMarketByName(order.market);
    const n: number = bids.length;

    if (n !== 0 && bids[n - 1].price >= order.price) {
      for (let i = bids.length - 1; i >= 0; i--) {
        let bidOrder = bids[i];

        // if (bidOrder.price < order.price) {
        if (bidOrder.price != order.price) {
          break;
        }

        let dealOrder: Order;

        if (bidOrder.amount >= order.amount) {
          bidOrder.amount -= order.amount;
          bidOrder.status = OrderStatus.PARTIALLY;

          if (bidOrder.amount === 0) {
            bidOrder.status = OrderStatus.COMPLETED;
            [dealOrder] = bids.splice(i, 1);
          }

          order.status = OrderStatus.COMPLETED;
          await updateOrderHistory(order, bidOrder);
          return dealOrder;
        }

        if (bidOrder.amount < order.amount) {
          order.amount -= bidOrder.amount;
          bids.splice(i, 1);
          order.status = OrderStatus.PARTIALLY;
          bidOrder.status = OrderStatus.COMPLETED;
          await updateOrderHistory(order, bidOrder);
          continue;
        }
      }
    }

    this.addAskOrder(order);
  }

  async executeBidLimitOrder(order: Order) {
    const { asks }: Market = this.getMarketByName(order.market);
    const n: number = asks.length;

    if (n !== 0 && asks[n - 1].price <= order.price) {
      for (let i = asks.length - 1; i >= 0; i--) {
        let askOrder = asks[i];

        // if (askOrder.price > order.price) {
        if (askOrder.price != order.price) {
          break;
        }

        let dealOrder: Order;

        if (askOrder.amount >= order.amount) {
          askOrder.amount -= order.amount;
          askOrder.status = OrderStatus.PARTIALLY;

          if (askOrder.amount === 0) {
            askOrder.status = OrderStatus.COMPLETED;
            [dealOrder] = asks.splice(i, 1);
          }

          order.status = OrderStatus.COMPLETED;
          await updateOrderHistory(order, askOrder);
          return dealOrder;
        }

        if (askOrder.amount < order.amount) {
          order.amount -= askOrder.amount;
          asks.splice(i, 1);
          order.status = OrderStatus.PARTIALLY;
          askOrder.status = OrderStatus.COMPLETED;
          await updateOrderHistory(order, askOrder);
          continue;
        }
      }
    }

    this.addBidOrder(order);
  }

  executeAskMarketOrder(order: Order): Order {
    const { bids }: Market = this.getMarketByName(order.market);

    if (bids.length <= 0) {
      return;
    }

    const dealOrder = bids.pop();
    return dealOrder;
  }

  executeBidMarketOrder(order: Order): Order {
    const { asks }: Market = this.getMarketByName(order.market);

    if (asks.length <= 0) {
      return;
    }

    const dealOrder = asks.pop();
    return dealOrder;
  }

  async putLimit({
    exchange_id,
    exchange_name,
    user_id,
    market,
    stock,
    money,
    side,
    price,
    amount,
    total_fee,
  }: PutLimitParams): Promise<Order> {
    const order: Order = {
      id: uuidv4(),
      exchange_id,
      exchange_name,
      user_id,
      type: OrderType.LIMIT,
      side,
      market,
      stock,
      money,
      price,
      amount,
      total: amount * price,
      status: OrderStatus.ACTIVE,
      total_fee,
      deal_money: amount - total_fee,
      deal_stock: amount / price - total_fee,
      create_time: getCurrentTimestamp(),
      update_time: 'infinity',
    };

    db.appendOrderHistory(order);

    let dealOrder: Order;
    if (side === OrderSide.ASK) {
      dealOrder = await this.executeAskLimitOrder(order);
    } else {
      dealOrder = await this.executeBidLimitOrder(order);
    }

    if (dealOrder) {
      const updateTime = getCurrentTimestamp();

      order.update_time = updateTime;
      dealOrder.update_time = updateTime;

      db.updateOrder(order, updateTime);
      db.updateOrder(dealOrder, updateTime);

      const deal: Deal = await appendOrderDeal(order, dealOrder);

      await kafkaProducer.pushMessage(
        KafkaTopic.DEALS,
        OrderEvent.FINISH,
        deal
      );

      this.settleBookSize++;
      return order;
    }

    await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.PUT);
    return order;
  }

  async putMarket({
    user_id,
    exchange_id,
    exchange_name,
    market,
    stock,
    money,
    side,
    amount,
    total_fee,
  }: PutMarketParams) {
    const order: Order = {
      id: uuidv4(),
      exchange_id,
      exchange_name,
      user_id,
      type: OrderType.LIMIT,
      side,
      market,
      stock,
      money,
      status: OrderStatus.COMPLETED,
      amount,
      total_fee,
      deal_money: amount - total_fee,
      deal_stock: amount - total_fee,
      create_time: getCurrentTimestamp(),
      update_time: 'infinity',
    };

    let dealOrder: Order;
    if (side === OrderSide.ASK) {
      dealOrder = this.executeAskMarketOrder(order);
    } else {
      dealOrder = this.executeBidMarketOrder(order);
    }

    if (dealOrder) {
      order.update_time = getCurrentTimestamp();
      order.price = dealOrder.price;
      const deal: Deal = await appendOrderDeal(order, dealOrder);

      await kafkaProducer.pushMessage(
        KafkaTopic.DEALS,
        OrderEvent.FINISH,
        deal
      );

      order.status = OrderStatus.COMPLETED;
      dealOrder.status = OrderStatus.COMPLETED;
      await updateOrderHistory(order, dealOrder);

      this.settleBookSize++;
      return order;
    }

    return { message: 'Order book is empty' };
  }

  async cancel({ user_id, market, order_id }: CancelParams) {
    const { asks, bids }: Market = this.getMarketByName(market);
    let orderIndex: number = asks.findIndex(
      (order) => order.id === order_id && order.user_id === user_id
    );

    if (orderIndex >= 0) {
      const [order] = asks.splice(orderIndex, 1);
      order.status = OrderStatus.CANCELED;
      db.updateOrder(order, getCurrentTimestamp());
      await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.CANCEL);
      return order;
    }
    orderIndex = bids.findIndex(
      (order) => order.id === order_id && order.user_id === user_id
    );

    if (orderIndex < 0) {
      return 'Order not found';
    }

    const [order] = bids.splice(orderIndex, 1);
    order.status = OrderStatus.CANCELED;
    db.updateOrder(order, getCurrentTimestamp());
    await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.CANCEL);
    return order;
  }

  book({ market, side, limit, offset }: OrderBookParams): any {
    const { asks, bids } = this.getMarketByName(market);

    if (!side) {
      return {
        total: {
          asks_count: asks.length, 
          bids_count: bids.length
        },
        records: {
          asks: asks.slice(offset, limit),
          bids: bids.slice(offset, limit),
        }
      };
    }

    if (side === OrderSide.ASK) {
      return {
        total: asks.length,
        records: asks.slice(offset, limit),
      };
    }

    return {
      total: bids.length,
      records: bids.slice(offset, limit),
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
    if (!market) {
      const { total, records } = getAllPending(this.marketList, user_id);
      return {
        total,
        records: records.slice(offset, limit),
      };
    }

    const { asks, bids }: Market = this.getMarketByName(market);
    const askOrders = asks.filter((order) => order.user_id == user_id);
    const bidOrders = bids.filter((order) => order.user_id == user_id);
    const userOrders = [...askOrders, ...bidOrders];

    return {
      total: userOrders.length,
      records: userOrders.reverse().slice(offset, limit),
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
