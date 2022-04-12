import db from '../database/queries';
import { v4 as uuidv4 } from 'uuid';
import { Order } from '../types/types';
import { MarketRole, BusinessEnum } from '../types/enums';
import { getCurrentTimestamp } from './time.util';

export async function appendOrderDeal(
  order: Order,
  dealOrder: Order
): Promise<void> {
  await db.appendDealHistory({
    id: uuidv4(),
    user_id: order.user_id,
    order_id: order.id,
    deal_order_id: dealOrder.id,
    role: MarketRole.TAKER,
    price: order.price,
    amount: order.amount,
    deal: 1,
    fee: 1,
    deal_fee: 1,
    time: order.finish_time,
  });

  await db.appendDealHistory({
    id: uuidv4(),
    user_id: dealOrder.user_id,
    order_id: dealOrder.id,
    deal_order_id: order.id,
    role: MarketRole.TAKER,
    price: dealOrder.price,
    amount: dealOrder.amount,
    deal: 1,
    fee: 1,
    deal_fee: 1,
    time: dealOrder.finish_time,
  });
}

export async function appendTradeBalance(user_id: string, change: number, money: string) {
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
