import { v4 as uuidv4 } from 'uuid';
import config from '../config/matchengine.config';
import db from '../database/queries';
import { client } from '../config/database.config';
import { getCurrentTimestamp, getMilliseconds } from '../utils/time.util';
import kafkaProducer from '../kafka/kafka.producer';
import { Market, Order, Deal, MatchEngineConfig } from '../typings/types';
import AwaitLock from 'await-lock';
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
  MarketRole,
} from '../typings/enums';

import { PutLimitParams } from '../dto/put-limit-params.dto';
import { PutMarketParams } from '../dto/put-market-params.dto';
import { OrderBookParams } from '../dto/order-book-params.dto';
import { PendingParams } from '../dto/pending-params.dto';
import { PendingDetailParams } from '../dto/pending-detail-params.dto';
import { CancelParams } from '../dto/cancel-params.dto';
import { DepthParams } from '../dto/depth-params.dto';

import { getAssetConfigByName } from '../utils/config.util';
import { getAssetUsdPrice } from '../utils/price.util';

class OrderService {
  marketList: Market[] = [];
  // NOTE: this is property for testing
  settleBookSize: number;
  lock: AwaitLock;

  constructor(config: MatchEngineConfig) {
    for (const marketConf of config.markets) {
      const { name, stock, money } = marketConf;
      this.settleBookSize = 0;
      this.lock = new AwaitLock();

      const asks = [];
      const bids = [];

      const market: Market = {
        name,
        stock,
        money,
        asks,
        bids,
      };

      this.marketList.push(market);
    }
  }

  async initOrderBook() {
    const ordersList: Order[] = await db.getActiveOrders();

    for (const order of ordersList) {
      switch (order.side) {
        case OrderSide.ASK:
          this.addAskOrder(order);
          break;
        case OrderSide.BID:
          this.addBidOrder(order);
          break;
      }
    }

    return this;
  }

  clearOrderBook() {
    for (const market of this.marketList) {
      market.asks = [];
      market.bids = [];
    }
  }

  async refreshOrderBook() {
    this.clearOrderBook();
    await this.initOrderBook();
  }

  getMarketByName(marketName: string): Market {
    const market = this.marketList.find((market) => market.name === marketName);

    if (!market) {
      throw Error(`Market '${marketName}' not found`);
    }

    return market; 
  }

  isEnoughtLiquidity({ amount, side, market }: Order) {
    const orders: Order[] = this.getMarketByName(market)[side === OrderSide.ASK ? 'bids' : 'asks'];

    let i: number = 0;
    while (amount > 0 && i < orders.length) {
      amount -= orders[i].amount - orders[i].filled_qty;
      i++;
    }

    return amount <= 0;
  }

  addAskOrder(order: Order) {
    if (!order) return;
    let { asks }: Market = this.getMarketByName(order.market);
    asks.push(order);

    asks.sort((a, b) => 
      b.price - a.price || getMilliseconds(b.create_time) - getMilliseconds(a.create_time)
    );
  }


  addBidOrder(order: Order) {
    if (!order) return;
    let { bids }: Market = this.getMarketByName(order.market);
    bids.push(order);

    bids.sort((a, b) => 
      a.price - b.price || getMilliseconds(b.create_time) - getMilliseconds(a.create_time)
    );
  }

  async executeAskLimitOrder(order: Order) {
    await this.lock.acquireAsync();
    try {
      const { bids }: Market = this.getMarketByName(order.market);
      const n: number = bids.length;
      let dealOrderList: Order[] = [];

      if (n !== 0 && bids[n - 1].price >= order.price) {
        for (let i = n - 1; i >= 0; i--) {
          let bidOrder: Order = bids[i];

          if (bidOrder.price < order.price) {
            break;
          }

          let remainBidOrderAmount: number = bidOrder.amount - bidOrder.filled_qty;
          let remainOrderAmount: number = order.amount - order.filled_qty;

          if (remainBidOrderAmount >= remainOrderAmount) {
            order.filled_qty += remainOrderAmount;
            order.change_qty = remainOrderAmount;
            order.executed_total = order.filled_qty * order.price;
            bidOrder.filled_qty += remainOrderAmount;
            bidOrder.change_qty = remainOrderAmount;
            bidOrder.executed_total = bidOrder.filled_qty * bidOrder.price;

            if (bidOrder.amount <= bidOrder.filled_qty) {
              bidOrder.status = OrderStatus.COMPLETED;
              order.status = OrderStatus.COMPLETED;
              await updateOrderHistory(order, bidOrder);
              const [dealOrder] = bids.splice(i, 1);
              dealOrderList.push(dealOrder);
              await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, bidOrder);
            } else {
              bidOrder.status = OrderStatus.PARTIALLY;
              order.status = OrderStatus.COMPLETED;
              await updateOrderHistory(order, bidOrder);
              const [dealOrder] = bids.slice(i, i + 1);
              dealOrderList.push(dealOrder);
              await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.PARTIALLY_FINISH, bidOrder);
            }

            await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, order);
            return dealOrderList;
          }

          if (remainBidOrderAmount < remainOrderAmount) {
            order.filled_qty += remainBidOrderAmount;
            order.change_qty = remainBidOrderAmount;
            order.executed_total = order.filled_qty * order.price;
            bidOrder.filled_qty += remainBidOrderAmount;
            bidOrder.change_qty = remainBidOrderAmount;
            bidOrder.executed_total = bidOrder.filled_qty * bidOrder.price;

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
    } finally {
      this.lock.release();
    }
  }

  async executeBidLimitOrder(order: Order) {
    await this.lock.acquireAsync();
    try {
      const { asks }: Market = this.getMarketByName(order.market);
      const n: number = asks.length;
      let dealOrderList: Order[] = [];

      if (n !== 0 && asks[n - 1].price <= order.price) {
        for (let i = n - 1; i >= 0; i--) {
          let askOrder: Order = asks[i];

          if (askOrder.price > order.price) {
            break;
          }

          let remainAskOrderAmount: number = askOrder.amount - askOrder.filled_qty;
          let remainOrderAmount: number = order.amount - order.filled_qty;

          if (remainAskOrderAmount >= remainOrderAmount) {
            order.filled_qty += remainOrderAmount;
            order.change_qty = remainOrderAmount;
            order.executed_total = order.filled_qty * order.price;
            askOrder.filled_qty += remainOrderAmount;
            askOrder.change_qty = remainOrderAmount;
            askOrder.executed_total = askOrder.filled_qty * askOrder.price;

            if (askOrder.amount <= askOrder.filled_qty) {
              askOrder.status = OrderStatus.COMPLETED;
              order.status = OrderStatus.COMPLETED;
              await updateOrderHistory(order, askOrder);
              const [dealOrder] = asks.splice(i, 1);
              dealOrderList.push(dealOrder);
              await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, order);
            } else {
              askOrder.status = OrderStatus.PARTIALLY;
              order.status = OrderStatus.COMPLETED;
              await updateOrderHistory(order, askOrder);
              const [dealOrder] = asks.slice(i, i + 1);
              dealOrderList.push(dealOrder)
              await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.PARTIALLY_FINISH, askOrder);
            }

            await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, order);
            return dealOrderList;
          }

          if (remainAskOrderAmount < remainOrderAmount) {
            order.filled_qty += remainAskOrderAmount;
            order.change_qty = remainAskOrderAmount;
            order.executed_total = order.filled_qty * order.price;
            askOrder.filled_qty += remainAskOrderAmount;
            askOrder.change_qty = remainAskOrderAmount;
            askOrder.executed_total = askOrder.filled_qty * askOrder.price;

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
    } finally {
      this.lock.release();
    }
  }

  // NOTE: strongly needs to refactor
  async executeAskMarketOrder(order: Order) {
    await this.lock.acquireAsync();
    try {
      const { bids }: Market = this.getMarketByName(order.market);
      const n: number = bids.length;
      let dealOrderList: Order[] = [];

      const precision = 10 ** getAssetConfigByName(order.money).prec;

      for (let i = n - 1; i >= 0; i--) {
        let bidOrder = bids[i];
        let remainBidOrderAmount: number = bidOrder.amount - bidOrder.filled_qty;
        let remainOrderAmount: number = order.amount - order.filled_qty;

        if (remainBidOrderAmount >= remainOrderAmount) {
          const price = remainOrderAmount * bidOrder.price / order.amount;
          const pricePrec = Math.round((price + Number.EPSILON) * precision) / precision;

          order.price += pricePrec;
          order.filled_qty += remainOrderAmount;
          order.change_qty = remainOrderAmount;
          order.executed_total = order.price * order.filled_qty;
          bidOrder.filled_qty += remainOrderAmount;
          bidOrder.change_qty = remainOrderAmount;
          bidOrder.executed_total = bidOrder.filled_qty * bidOrder.price;

          if (bidOrder.amount <= bidOrder.filled_qty) {
            bidOrder.status = OrderStatus.COMPLETED;
            order.status = OrderStatus.COMPLETED;
            await updateOrderHistory(order, bidOrder);
            const [dealOrder] = bids.splice(i, 1);
            dealOrderList.push(dealOrder);
            await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, bidOrder);
          } else {
            bidOrder.status = OrderStatus.PARTIALLY;
            order.status = OrderStatus.COMPLETED;
            await updateOrderHistory(order, bidOrder);
            const [dealOrder] = bids.slice(i, i + 1);
            dealOrderList.push(dealOrder);
            await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.PARTIALLY_FINISH, bidOrder);
          }

          await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, order);
          return { dealOrderList, order };
        }

        if (remainBidOrderAmount < remainOrderAmount) {
          const price = remainBidOrderAmount * bidOrder.price / order.amount;
          const pricePrec = Math.round((price + Number.EPSILON) * precision) / precision;

          order.price += pricePrec;
          order.filled_qty += remainBidOrderAmount;
          order.change_qty = remainBidOrderAmount;
          order.executed_total = order.price * order.filled_qty;
          bidOrder.filled_qty += remainBidOrderAmount;
          bidOrder.change_qty = remainBidOrderAmount;
          bidOrder.executed_total = bidOrder.filled_qty * bidOrder.price;

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

      this.addAskOrder(order);
      return { dealOrderList, order };
    } finally {
      this.lock.release();
    }
  }

  // NOTE: strongly needs to refactor
  async executeBidMarketOrder(order: Order) {
    await this.lock.acquireAsync();
    try {
      const { asks }: Market = this.getMarketByName(order.market);
      const n: number = asks.length;
      let dealOrderList: Order[] = [];

      const precision = 10 ** getAssetConfigByName(order.money).prec;

      for (let i = n - 1; i >= 0; i--) {
        let askOrder = asks[i];
        let remainAskOrderAmount: number = askOrder.amount - askOrder.filled_qty;
        let remainOrderAmount: number = order.amount - order.filled_qty;

        if (remainAskOrderAmount >= remainOrderAmount) {
          const price = remainOrderAmount * askOrder.price / order.amount;
          const pricePrec = Math.round((price + Number.EPSILON) * precision) / precision;

          order.price += pricePrec;
          order.filled_qty += remainOrderAmount;
          order.change_qty = remainOrderAmount;
          order.executed_total = order.price * order.filled_qty;
          askOrder.filled_qty += remainOrderAmount;
          askOrder.change_qty = remainOrderAmount;
          askOrder.executed_total = askOrder.filled_qty * askOrder.price;

          if (askOrder.amount <= askOrder.filled_qty) {
            askOrder.status = OrderStatus.COMPLETED;
            order.status = OrderStatus.COMPLETED;
            await updateOrderHistory(order, askOrder);
            const [dealOrder] = asks.splice(i, 1);
            dealOrderList.push(dealOrder);
            await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, order);
          } else {
            askOrder.status = OrderStatus.PARTIALLY;
            order.status = OrderStatus.COMPLETED;
            await updateOrderHistory(order, askOrder);
            const [dealOrder] = asks.slice(i, i + 1);
            dealOrderList.push(dealOrder)
            await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.PARTIALLY_FINISH, askOrder);
          }

          await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, order);
          return { dealOrderList, order };
        }

        if (remainAskOrderAmount < remainOrderAmount) {
          const price = remainAskOrderAmount * askOrder.price / order.amount;
          const pricePrec = Math.round((price + Number.EPSILON) * precision) / precision;

          order.price += pricePrec;
          order.filled_qty += remainAskOrderAmount;
          order.change_qty = remainAskOrderAmount;
          order.executed_total = order.price * order.filled_qty;
          askOrder.filled_qty += remainAskOrderAmount;
          askOrder.change_qty = remainAskOrderAmount;
          askOrder.executed_total = askOrder.filled_qty * askOrder.price;

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

      this.addBidOrder(order);
      return { dealOrderList, order };
    } finally {
      this.lock.release();
    }
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
    create_time,
    update_time
  }: PutLimitParams): Promise<Deal[] | Order> {
    try {
      await client.query('BEGIN');
      const precision = 10 ** getAssetConfigByName(stock).prec;
      const pricePrec = Math.round((price + Number.EPSILON) * precision) / precision;
      const total = amount * pricePrec;
      create_time = create_time || getCurrentTimestamp();
      update_time = update_time || getCurrentTimestamp();

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
        price: pricePrec,
        amount,
        filled_qty: 0,
        change_qty: 0,
        total,
        executed_total: 0,
        status: OrderStatus.ACTIVE,
        total_fee,
        deal_money: side === OrderSide.ASK ? total - total_fee : total,
        deal_stock: side === OrderSide.BID ? amount - total_fee : amount,
        create_time,
        update_time: update_time === 'infinity' ? getCurrentTimestamp() : update_time
      };

      await db.appendOrderHistory(order);

      let dealOrderList: Order[] = [];
      if (side === OrderSide.ASK) {
        dealOrderList = await this.executeAskLimitOrder(order);
      } else {
        dealOrderList = await this.executeBidLimitOrder(order);
      }

      if (dealOrderList && dealOrderList.length > 0) {
        const dealsList: Deal[] = [];

        for (const dealOrder of dealOrderList) {
          if (!dealOrder) {
            throw Error(`dealOrderList contains undefined: ${JSON.stringify(dealOrderList, null, 2)}`)
          };

          const updateTime = update_time === 'infinity' ? getCurrentTimestamp() : update_time;

          order.update_time = updateTime;
          dealOrder.update_time = updateTime;

          db.updateOrder(order);
          db.updateOrder(dealOrder);

          const [firstDeal]: Deal[] = await appendOrderDeal(order, dealOrder);
          dealsList.push(firstDeal);

          await kafkaProducer.pushMessage(
            KafkaTopic.DEALS,
            OrderEvent.FINISH,
            firstDeal
          );

          this.settleBookSize++;
        }

        await client.query('COMMIT');
        return dealsList;
      }

      await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.PUT, order);
      await client.query('COMMIT');
      return [];
    } catch (err) {
      console.log(err);
      await client.query('ROLLBACK');
      this.refreshOrderBook();
    }
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
    create_time,
    update_time
  }: PutMarketParams) {
    try {
      await client.query('BEGIN');
      const order: Order = {
        id: uuidv4(),
        exchange_id,
        exchange_name,
        user_id,
        type: OrderType.MARKET,
        side,
        market,
        stock,
        money,
        status: OrderStatus.COMPLETED,
        price: 0,
        amount,
        filled_qty: 0,
        total: 0,
        executed_total: 0,
        total_fee,
        deal_money: 0,
        deal_stock: side === OrderSide.BID ? amount - total_fee : amount,
        create_time: create_time || getCurrentTimestamp(),
        update_time: update_time || 'infinity',
      };

      if (!this.isEnoughtLiquidity(order)) {
        return { message: 'There are not enought liquidity!' };
      }

      let executedResult: { dealOrderList: Order[], order: Order };

      if (side === OrderSide.ASK) {
        executedResult = await this.executeAskMarketOrder(order);
      } else {
        executedResult = await this.executeBidMarketOrder(order);
      }

      await db.appendOrderHistory(order);

      const { dealOrderList, order: executedOrder } = executedResult;

      if (dealOrderList && dealOrderList.length > 0) {
        const dealsList: Deal[] = [];
        order.price = executedOrder.price;
        order.total = executedOrder.total;
        order.executed_total = executedOrder.executed_total;
        order.filled_qty = executedOrder.filled_qty;
        order.status = executedOrder.status;

        for (let i = 0; i < dealOrderList.length; i++) {
          const dealOrder = dealOrderList[i];

          if (!dealOrder) {
            throw Error(`dealOrderList contains undefined: ${JSON.stringify(dealOrderList, null, 2)}`)
          };

          order.update_time = getCurrentTimestamp();
          order.deal_stock = dealOrder.price;
          
          const [firstDeal]: Deal[] = await appendOrderDeal(order, dealOrder);
          dealsList.push(firstDeal);

          await kafkaProducer.pushMessage(
            KafkaTopic.DEALS,
            OrderEvent.FINISH,
            firstDeal
          );

          order.status = OrderStatus.COMPLETED;
          dealOrder.status = OrderStatus.COMPLETED;
          await updateOrderHistory(order, dealOrder);
          await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.FINISH, order);

          this.settleBookSize++;
        }

        await client.query('COMMIT');
        return dealsList;
      }

      await client.query('COMMIT');
      return { message: 'Order book is empty' };
    } catch (err) {
      console.log(err);
      await client.query('ROLLBACK');
      this.refreshOrderBook();
    }
  }

  async cancel({ user_id, market, order_id, side }: CancelParams) {
    await this.lock.acquireAsync();
    try {
      const removeOrder = async (user_id, order_id, orderbook): Promise<Order | void> => {
        let orderIndex: number = orderbook.findIndex(
          (order) =>
            order.id.toLowerCase() === order_id.toLowerCase()
            && order.user_id.toLowerCase() === user_id.toLowerCase()
        );

        if (orderIndex >= 0) {
          const [order] = orderbook.splice(orderIndex, 1);

          order.status = order.filled_qty > 0 ? OrderStatus.PARTIALLY_CANCELED : OrderStatus.CANCELED;
          order.update_time = getCurrentTimestamp();
          db.updateOrder(order);
          await kafkaProducer.pushMessage(KafkaTopic.ORDERS, OrderEvent.CANCEL, order);
          return order;
        }
      };

      const { asks, bids }: Market = this.getMarketByName(market);

      if (side === OrderSide.ASK) {
        return await removeOrder(user_id, order_id, asks);
      }
      return await removeOrder(user_id, order_id, bids);
    } finally {
      this.lock.release();
    }
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
          asks: [...asks].reverse().slice(offset, limit),
          bids: [...bids].reverse().slice(offset, limit),
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
    const askOrders = asks.filter((order) =>
      order.user_id.toLowerCase() === user_id.toLowerCase());
    const bidOrders = bids.filter((order) =>
      order.user_id.toLowerCase() === user_id.toLowerCase());
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

  // debug
  getSettleBookSize() {
    return this.settleBookSize;
  }

  async sendTestDeal({ market, stock, money, price, amount }) {
    const deal: Deal = {
      id: uuidv4(),
      exchange_id: '',
      exchange_name: '',
      user_id: '',
      deal_user_id: '',
      order_id: '',
      deal_order_id: '',
      side: OrderSide.ASK,
      market,
      stock,
      money,
      role: MarketRole.TAKER,
      price,
      amount,
      total: price * amount,
      deal: 1,
      fee: 1,
      deal_fee: 1,
      stock_usd_price: await getAssetUsdPrice(stock),
      money_usd_price: await getAssetUsdPrice(money),
      time: getCurrentTimestamp(),
    };

    await kafkaProducer.pushMessage(
      KafkaTopic.DEALS,
      OrderEvent.FINISH,
      deal
    );
  }
}

export default new OrderService(config);
