import { QueryTypes } from 'sequelize';
import { OrderEvent, OrderSide } from '../typings/enums';
import { sequelize } from '../config/database.config';
import orderController from '../controllers/order.controller';
import { PutLimitParams } from '../dto/put-limit-params.dto';

const exchangeName = 'globiance';
const exchangeId = '2e54a010-4063-11eb-820e-27bfaf6f90c6';

async function openOrders() {
  const ordersQueryResult: any = await sequelize.query(
    `
      SELECT
        pairName, userId, price, [type], originalQty, filledQty, fee, createdAt, updatedAt,
        CASE WHEN filledQty <> '0' THEN originalQty - filledQty  ELSE originalQty END as amount,
        CASE WHEN filledQty <> '0' THEN (originalQty - filledQty) * price  ELSE originalQty* price END as total
		  FROM
		  	TradeOrders with (nolock)
		  WHERE
		  	deletedAt IS NULL
		  	AND exchangeId = '${exchangeId}'
		  	AND [status] IN('active','partially')
		  ORDER BY id DESC;
    `, {
    // plain: true,
    // raw: true,
    type: QueryTypes.SELECT
  });

  const l = ordersQueryResult.length;
  let i = 0;
  for await (const orderOrig of ordersQueryResult) {
    console.log(`${++i}/${l}`);
    const putLimitParams: PutLimitParams = {
      exchange_id: exchangeId,
      exchange_name: exchangeName,
      user_id: orderOrig.userId,
      side: orderOrig.type,
      market: orderOrig.pairName.replace("-", ""),
      stock: orderOrig.pairName.split('-')[0],
      money: orderOrig.pairName.split('-')[1],
      price: orderOrig.price || 0,
      amount: Math.abs(orderOrig.amount) || 0,
      total_fee: orderOrig.fee,
      create_time: orderOrig.createdAt.toISOString(),
      update_time: orderOrig.updatedAt.toISOString()
    }

    const resp = await orderController.putLimit(putLimitParams);
    console.log(JSON.stringify(resp));
  }
}

async function deals() {
  const tradeMapping: any = await sequelize.query(
    `
    SELECT * FROM TradeMapping tm
    LEFT JOIN TradeOrders AS tor ON tor.orderId = (CASE WHEN tm.type = 'buy' THEN tm.buyerOrderId ELSE tm.sellerOrderId )  
    WHERE tm.createdAt >= getdate()-1 ORDER BY CONVERT(datetime, tm.createdAt)
    `
    , {
    type: QueryTypes.SELECT
  });

  const l = tradeMapping.length;
  let i = 0;

  for await (const orderOrig of tradeMapping) {
    // console.log(`${++i}/${l}`);
    const putLimitParams: PutLimitParams = {
      exchange_id: orderOrig.exchangeId,
      exchange_name: orderOrig.type === 'buy' ? orderOrig.buyerExchangeName : orderOrig.sellerExchangeName,
      user_id: orderOrig.type === 'buy' ? orderOrig.buyerUserId : orderOrig.sellerUserId,
      side: orderOrig.type,
      market: orderOrig.pair.replace("-", ""),
      stock: orderOrig.pair.split('-')[0],
      money: orderOrig.pair.split('-')[1],
      price: orderOrig.triggerPrice || 0,
      amount: orderOrig.triggerQty || 0,
      total_fee: orderOrig.side === 'buy' ? orderOrig.buyerFee : orderOrig.sellerFee,
      create_time: orderOrig.createdAt.toISOString(),
      update_time: orderOrig.updatedAt.toISOString()
    }

    const putLimitParams1: PutLimitParams = {
      exchange_id: orderOrig.exchangeId,
      exchange_name: orderOrig.type !== 'buy' ? orderOrig.buyerExchangeName : orderOrig.sellerExchangeName,
      user_id: orderOrig.type !== 'buy' ? orderOrig.buyerUserId : orderOrig.sellerUserId,
      side: orderOrig.type === 'buy' ? OrderSide.ASK : OrderSide.BID,
      market: orderOrig.pair.replace("-", ""),
      stock: orderOrig.pair.split('-')[0],
      money: orderOrig.pair.split('-')[1],
      price: orderOrig.triggerPrice || 0,
      amount: orderOrig.triggerQty || 0,
      total_fee: orderOrig.side !== 'buy' ? orderOrig.buyerFee : orderOrig.sellerFee,
      create_time: orderOrig.createdAt.toISOString(),
      update_time: orderOrig.updatedAt.toISOString()
    }

    const resp = await orderController.putLimit(putLimitParams);
    const resp1 = await orderController.putLimit(putLimitParams1);

    // console.log(JSON.stringify(resp));
    // console.log(JSON.stringify(resp1));
  }
}

export const transfer = async () => {
  const startTime = new Date();
  console.log('Start migrate order: ', startTime.toString());

  // await deals();
  await openOrders();

  console.log('Finish migrate order:', (new Date()).toString());
  console.log('Duration:', (((new Date()).valueOf() - startTime.valueOf()) / 1000 / 60).toString(), 'min');
};
