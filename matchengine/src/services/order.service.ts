import { v4 as uuidv4 } from 'uuid';
import PromiseBlue from 'bluebird';

import config from '../config/matchengine.config';
import db from '../database/queries';
import { getCurrentTimestamp } from '../utils/time.util';
import kafkaProducer from '../kafka/kafka.producer';
import { Market, Order, Deal, MatchEngineConfig } from '../typings/types';
import {
  appendOrderDeal,
  getAllPending,
  updateOrderHistory,
} from '../utils/trade.util';
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

import redisClient from '../config/database.config';

class OrderService {
  marketList: Market[] = [];
  // NOTE: this is property for testing
  settleBookSize: number;

  constructor(config: MatchEngineConfig) {
    for (const marketConf of config.markets) {
      const { name, stock, money } = marketConf;
      this.settleBookSize = 0;

      const asks = [];
      const bids = [];

      PromiseBlue.props({
        askIds: redisClient.lRange(`${name}:asks`, 0, -1),
        bidIds: redisClient.lRange(`${name}:bids`, 0, -1)
      }).then(async response => {
        // for (const id of response.askIds) {
        //   asks.push(JSON.parse(await redisClient.get(`${name}:asks:${id}`)));
        // }

        // for (const id of response.bidIds) {
        //   bids.push(JSON.parse(await redisClient.get(`${name}:bids:${id}`)));
        // }

        const market: Market = {
          name,
          stock,
          money,
          asks,
          bids,
        };

        this.marketList.push(market);
      }).catch(console.log);
    }
  }

  getMarketByName(marketName: string): Market {
    return this.marketList.find((market) => market.name === marketName);
  }

  addAskOrder(order: Order) {
    const { asks }: Market = this.getMarketByName(order.market);
    const samePriceOrder = asks.find(x => {
      return x.price === order.price &&
        x.exchange_id === order.exchange_id &&
        x.exchange_name === order.exchange_name &&
        x.user_id === order.user_id
    });

    if (samePriceOrder) {
      samePriceOrder.amount += order.amount;
      samePriceOrder.total += order.total;
      samePriceOrder.total_fee += order.total_fee;
      samePriceOrder.deal_money += order.deal_money;
      samePriceOrder.deal_stock += order.deal_stock;
      samePriceOrder.update_time = getCurrentTimestamp();
      return samePriceOrder;
    }

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
    const samePriceOrder = bids.find(x => {
      return x.price === order.price &&
        x.exchange_id === order.exchange_id &&
        x.exchange_name === order.exchange_name &&
        x.user_id === order.user_id
    });

    if (samePriceOrder) {
      samePriceOrder.amount += order.amount;
      samePriceOrder.total += order.total;
      samePriceOrder.total_fee += order.total_fee;
      samePriceOrder.deal_money += order.deal_money;
      samePriceOrder.deal_stock += order.deal_stock;
      samePriceOrder.update_time = getCurrentTimestamp();
      return samePriceOrder;
    }

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
    let dealOrderList: Order[] = [];

    if (n !== 0 && bids[n - 1].price >= order.price) {
      for (let i = bids.length - 1; i >= 0; i--) {
        let bidOrder = bids[i];

        if (bidOrder.price < order.price) {
          break;
        }

        let remainBidOrderAmount: number = bidOrder.amount - bidOrder.filledQty;
        let remainOrderAmount: number = order.amount - order.filledQty;

        if (remainBidOrderAmount >= remainOrderAmount) {
          order.filledQty += remainOrderAmount;
          order.executedTotal = order.filledQty * order.price;
          bidOrder.filledQty += remainOrderAmount;
          bidOrder.executedTotal = bidOrder.filledQty * bidOrder.price;

          if (bidOrder.amount === bidOrder.filledQty) {
            bidOrder.status = OrderStatus.COMPLETED;
            const [dealOrder] = bids.splice(i, 1); 
            dealOrderList.push(dealOrder);
            await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, bidOrder);
          } else {
            bidOrder.status = OrderStatus.PARTIALLY;
            const [dealOrder] = bids.slice(i, i + 1);
            dealOrderList.push(dealOrder);
            await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.PARTIALLY_FINISH, bidOrder);
          }

          order.status = OrderStatus.COMPLETED;

          await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, order);
          await updateOrderHistory(order, bidOrder);
          return dealOrderList;
        }

        if (remainBidOrderAmount < remainOrderAmount) {
          order.filledQty += remainBidOrderAmount;
          order.executedTotal = order.filledQty * order.price;
          bidOrder.filledQty += remainOrderAmount;
          bidOrder.executedTotal = bidOrder.filledQty * bidOrder.price;

          const [dealOrder] = bids.splice(i, 1);
          dealOrderList.push(dealOrder);
          order.status = OrderStatus.PARTIALLY;
          bidOrder.status = OrderStatus.COMPLETED;

          await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.PARTIALLY_FINISH, order);
          await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, bidOrder);

          await updateOrderHistory(order, bidOrder);
          continue;
        }
      }
    }

    this.addAskOrder(order);
    return dealOrderList;
  }

  async executeBidLimitOrder(order: Order) {
    const { asks }: Market = this.getMarketByName(order.market);
    const n: number = asks.length;
    let dealOrderList: Order[] = [];

    if (n !== 0 && asks[n - 1].price <= order.price) {
      for (let i = asks.length - 1; i >= 0; i--) {
        let askOrder = asks[i];

        if (askOrder.price > order.price) {
          break;
        }

        let remainAskOrderAmount: number = askOrder.amount - askOrder.filledQty;
        let remainOrderAmount: number = order.amount - order.filledQty;

        if (remainAskOrderAmount >= remainOrderAmount) {
          
          order.filledQty += remainOrderAmount;
          order.executedTotal = order.filledQty * order.price;
          askOrder.filledQty += remainOrderAmount;
          askOrder.executedTotal = askOrder.filledQty * askOrder.price;

          if (askOrder.amount === askOrder.filledQty) {
            askOrder.status = OrderStatus.COMPLETED;
            const [dealOrder] = asks.splice(i, 1);
            dealOrderList.push(dealOrder);
            await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, order);
          } else {
            askOrder.status = OrderStatus.PARTIALLY;
            const [dealOrder] = asks.slice(i, i + 1);
            dealOrderList.push(dealOrder)
            await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.PARTIALLY_FINISH, askOrder);
          }

          order.status = OrderStatus.COMPLETED;
          await updateOrderHistory(order, askOrder);
          await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, order);

          return dealOrderList;
        }

        if (remainAskOrderAmount < remainOrderAmount) {
          order.filledQty += remainAskOrderAmount;
          order.executedTotal = order.filledQty * order.price;
          askOrder.filledQty += remainOrderAmount;
          askOrder.executedTotal = askOrder.filledQty * askOrder.price;

          const [dealOrder] = asks.splice(i, 1);
          dealOrderList.push(dealOrder);
          order.status = OrderStatus.PARTIALLY;
          askOrder.status = OrderStatus.COMPLETED;

          await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.PARTIALLY_FINISH, order);
          await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, askOrder);

          await updateOrderHistory(order, askOrder);
          continue;
        }
      }
    }

    this.addBidOrder(order);
    return dealOrderList;
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
      filledQty: 0,
      total: amount * price,
      executedTotal: 0,
      status: OrderStatus.ACTIVE,
      total_fee,
      deal_money: amount - total_fee,
      deal_stock: amount / price - total_fee,
      create_time: getCurrentTimestamp(),
      update_time: 'infinity',
    };

    db.appendOrderHistory(order);

    let dealOrderList: Order[] = [];
    if (side === OrderSide.ASK) {
      dealOrderList = await this.executeAskLimitOrder(order);
    } else {
      dealOrderList = await this.executeBidLimitOrder(order);
    }

    if (dealOrderList && dealOrderList.length > 0 && !dealOrderList.includes(undefined)) {
      for (const dealOrder of dealOrderList) {
        const updateTime = getCurrentTimestamp();

        order.update_time = updateTime;
        dealOrder.update_time = updateTime;

        db.updateOrder(order, updateTime);
        db.updateOrder(dealOrder, updateTime);

        const [firstDeal, secondDeal]: Deal[] = await appendOrderDeal(order, dealOrder);

        await kafkaProducer.pushMessage(
          KafkaTopic.DEALS,
          OrderEvent.FINISH,
          firstDeal
        );

        this.settleBookSize++;
      }
      return order;
    }

    await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.PUT, order);
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
      filledQty: amount,
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
      await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, order);

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
    await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.CANCEL, order);
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
