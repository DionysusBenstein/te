import db from '../database/queries';
import { v4 as uuidv4 } from 'uuid';
import { Deal, Market, Order } from '../typings/types';
import { MarketRole, BusinessEnum } from '../typings/enums';
import { getCurrentTimestamp } from './time.util';

export function getAllPending(marketList: Market[], user_id: string) {
  let userOrders: Order[];
  const result: Order[] = marketList.reduce((acc: Order[], market: Market) => {
    const { asks, bids } = market;
    const askOrders = asks.filter((order) => order.user_id == user_id);
    const bidOrders = bids.filter((order) => order.user_id == user_id);
    userOrders = [...askOrders, ...bidOrders];

    return [...userOrders, ...acc];
  }, []);

  return {
    total: result.length,
    records: result,
  };
}

export async function updateOrderHistory(
  order: Order,
  dealOrder: Order
): Promise<void> {  
  const updateTime = getCurrentTimestamp();
  order.update_time = updateTime;
  dealOrder.update_time = updateTime;

  await (order.type === 'limit' ? db.updateOrder(order) : db.updateMarketOrder(order));
  await db.updateOrder(dealOrder);
}

export async function appendOrderDeal(
  order: Order,
  dealOrder: Order
): Promise<Deal[]> {
  const firstDeal: Deal = {
    id: uuidv4(),
    exchange_id: order.exchange_id,
    exchange_name: order.exchange_name,
    user_id: order.user_id,
    deal_user_id: dealOrder.user_id,
    order_id: order.id,
    deal_order_id: dealOrder.id,
    side: order.side,
    market: order.market,
    stock: order.stock,
    money: order.money,
    role: MarketRole.TAKER,
    price: dealOrder.price,
    amount: order.change_qty, 
    total: order. change_qty * dealOrder.price,
    deal: 1,
    fee: 1,
    deal_fee: 1,
    time: order.update_time,
  };

  const secondDeal: Deal = {
    id: uuidv4(),
    exchange_id: dealOrder.exchange_id,
    exchange_name: dealOrder.exchange_name,
    user_id: dealOrder.user_id,
    deal_user_id: order.user_id,
    order_id: dealOrder.id,
    deal_order_id: order.id,
    side: dealOrder.side,
    market: dealOrder.market,
    stock: dealOrder.stock,
    money: dealOrder.money,
    role: MarketRole.MAKER,
    price: order.price,
    amount: order.change_qty, 
    total: order.change_qty * order.price,
    deal: 1,
    fee: 1,
    deal_fee: 1,
    time: dealOrder.update_time,
  };

  await db.appendDealHistory(firstDeal);
  await db.appendDealHistory(secondDeal);

  return [firstDeal, secondDeal];
}

export async function appendTradeBalance(
  user_id: string,
  change: number,
  money: string
) {
  const time = getCurrentTimestamp();
  const { balance } = await db.getLastBalance(user_id, [money]);
  const newBalance = +balance + change;

  await db.appendBalanceHistory({
    user_id: user_id,
    time,
    asset: money,
    business: BusinessEnum.TRADE,
    change: change,
    balance: newBalance,
    detail: '',
  });
}
