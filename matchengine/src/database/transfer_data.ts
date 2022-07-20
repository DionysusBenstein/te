import { QueryTypes } from 'sequelize';
import { OrderEvent, OrderSide, OrderType, KafkaTopic, MarketRole } from '../typings/enums';
import { sequelize, client as redisClient } from '../config/database.config';
import orderController from '../controllers/order.controller';
import { PutLimitParams } from '../dto/put-limit-params.dto';
import kafkaProducer from '../kafka/kafka.producer';
import db from '../database/queries';

const exchangeName = 'globiance';
const exchangeId = '2e54a010-4063-11eb-820e-27bfaf6f90c6';

async function openOrders() {
  const ordersQueryResult: any = await sequelize.query(
    `
      SELECT
        uniqueId, pairName, userId, price, [type], originalQty, filledQty, fee, createdAt, updatedAt,
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
    // console.log(JSON.stringify(resp));
  }
}

async function deals() {
  const tradeMapping: any = await sequelize.query(
    `
      SELECT
	    	tm.uniqueId,Pairs.[name],tm.[triggerPrice] as price,tm.[triggerQty] as amount,[triggerTotal],tm.updatedAt,tm.createdAt,tm.type
	    	,CASE WHEN tm.type <> 'sell' THEN [buyerUserId] ELSE [sellerUserId]  END AS userId
	    	,CASE WHEN tm.type = 'sell' THEN [buyerUserId] ELSE [sellerUserId]  END AS dealUserId
	    	,CASE WHEN tm.type <> 'sell' THEN [buyerOrderId] ELSE [sellerOrderId]  END AS orderId
	    	,CASE WHEN tm.type = 'sell' THEN [buyerOrderId] ELSE [sellerOrderId]  END AS dealOrderId
        ,CASE WHEN tm.type <> 'sell' THEN [buyerExchangeName] ELSE [sellerExchangeName]  END AS exchangeName
        ,CASE WHEN tm.type <> 'sell' THEN [buyerOrderId] ELSE [sellerOrderId]  END AS orderId
        ,CASE WHEN tm.type <> 'sell' THEN [buyerEmail] ELSE [sellerEmail]  END AS email
        ,CASE WHEN tm.type <> 'sell' THEN [buyerFee] ELSE [sellerFee]  END AS fee
        ,CASE WHEN tm.type <> 'sell' THEN [buyerTotal] ELSE [sellerTotal]  END AS total
	    FROM 
	    	[TradeMapping] as tm WITH (NOLOCK)
	    	join Pairs on Pairs.name = tm.pair
	    WHERE
	    	tm.deletedAt IS NULL
	    	AND tm.exchangeId = '${exchangeId}'
      AND
        tm.createdAt >= getdate()-5
      ORDER BY CONVERT(datetime, tm.updatedAt)
    `
    , {
      type: QueryTypes.SELECT
    });


  for await (const orderOrig of tradeMapping) {
    const deal = {
      id: orderOrig.uniqueId,
      exchange_id: exchangeId,
      exchange_name: exchangeName,
      user_id: orderOrig.userId,
      deal_user_id: orderOrig.dealUserId,
      order_id: orderOrig.orderId,
      deal_order_id: orderOrig.dealUserId,
      side: orderOrig.type,
      market: orderOrig.name.replace("-", ""),
      stock: orderOrig.name.split('-')[0],
      money: orderOrig.name.split('-')[1],
      role: MarketRole.TAKER,
      price: orderOrig.price,
      amount: orderOrig.amount,
      total: orderOrig.total,
      deal: 1,
      fee: 1,
      deal_fee: 1,
      time: orderOrig.updatedAt,
    }

    console.log(deal);

    await kafkaProducer.pushMessage(
      KafkaTopic.DEALS,
      OrderEvent.FINISH,
      deal
    );
  }
}

async function tradeHistory() {
  const tradeOrders: any = await sequelize.query(
    `
	    SELECT
		    tro.uniqueId,tro.pairId, pr.name, tro.tradeType, tro.price,tro.averagePrice,tro.receivedTotal,tro.updatedTotal,tro.type, tro.fee, tro.status, tro.updatedAt,tro.userId,tro.status,tro.filledQty,tro.createdAt,
        CASE WHEN tro.filledQty <> '0' THEN tro.originalQty-tro.filledQty  ELSE tro.originalQty END as amount,
        CASE WHEN tro.filledQty <> '0' THEN tro.originalQty-tro.filledQty * tro.price  ELSE tro.originalQty * tro.price END as total,
		    tro.filledQty, tro.originalQty
	    FROM
	    	[TradeOrders] as tro
	    	left join Pairs as pr on pr.uniqueId = tro.pairId
	    WHERE
	    	tro.deletedAt IS NULL
	    	AND tro.exchangeId = '${exchangeId}' 
		    AND tro.[status] <> 'active';
    `
    , {
      type: QueryTypes.SELECT
    });


  for await (const orderOrig of tradeOrders) {
    const order = {
      id: orderOrig.uniqueId,
      exchange_id: exchangeId,
      exchange_name: exchangeName,
      user_id: orderOrig.userId,
      type: OrderType.LIMIT,
      side: orderOrig.type,
      market: orderOrig.name.replace('-', ''),
      stock: orderOrig.name.split('-')[0],
      money: orderOrig.name.split('-')[1],
      status: orderOrig.status,
      price: orderOrig.price,      
      amount: orderOrig.amount,
      filled_qty: orderOrig.filledQty,
      total: orderOrig.receivedTotal ,
      executed_total: orderOrig.updatedTotal,
      total_fee: orderOrig.fee,
      deal_money: 1,
      deal_stock: 1,
      create_time: orderOrig.createdAt.toISOString(),
      update_time: orderOrig.updatedAt.toISOString(),
    }

    console.log(order);
    
    db.appendOrderHistory(order);
  }
}

export const transfer = async () => {
  const startTime = new Date();
  console.log('Start migrate order: ', startTime.toString());

   // await deals();
   // await tradeHistory();

  console.log('Finish migrate order:', (new Date()).toString());
  console.log('Duration:', (((new Date()).valueOf() - startTime.valueOf()) / 1000 / 60).toString(), 'min');
};
