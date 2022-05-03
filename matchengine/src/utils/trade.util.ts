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
  await db.updateOrder(order, updateTime);
  await db.updateOrder(dealOrder, updateTime);
}

export async function appendOrderDeal(
  order: Order,
  dealOrder: Order
): Promise<Deal> {
  const firstDeal: Deal = {
    id: uuidv4(),
    user_id: order.user_id,
    order_id: order.id,
    deal_order_id: dealOrder.id,
    market: order.market,
    role: MarketRole.TAKER,
    price: order.price,
    amount: order.amount,
    total: order.price * order.amount,
    deal: 1,
    fee: 1,
    deal_fee: 1,
    time: order.update_time,
  };

  const secondDeal: Deal = {
    id: uuidv4(),
    user_id: dealOrder.user_id,
    order_id: dealOrder.id,
    deal_order_id: order.id,
    market: dealOrder.market,
    role: MarketRole.TAKER,
    price: dealOrder.price,
    amount: dealOrder.amount,
    total: dealOrder.price * dealOrder.amount,
    deal: 1,
    fee: 1,
    deal_fee: 1,
    time: dealOrder.update_time,
  };

  await db.appendDealHistory(firstDeal);
  await db.appendDealHistory(secondDeal);

  return firstDeal;
}

export async function appendTradeBalance(
  user_id: string,
  change: number,
  money: string
) {
  const time = getCurrentTimestamp();
  const { balance } = await db.getLastBalance(user_id, [money]);
  const newBalance = +balance + change;

  console.log('');
  console.log('::::::::::::::::: appendTradeBalances');
  console.log('-------------------------------------');
  console.log('user_id:', user_id);
  console.log('money:', money);
  console.log('change:', change);
  console.log('balance:', balance);
  console.log('newBalance:', newBalance);
  console.log('');

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
