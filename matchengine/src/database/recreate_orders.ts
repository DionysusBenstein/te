import { pool } from '../config/database.config';
import { QueryResult } from 'pg';
import orderController from "../controllers/order.controller";

const cancelOrders = async (ordersList) => {
  for await (const order of ordersList) {
    const { user_id, id: order_id, market, side } = order;
    const params = {
      user_id: user_id.toUpperCase(),
      order_id,
      market,
      side
    }
    console.log('!!! cancel params', JSON.stringify(params, null, 2));
    const response = await orderController.cancel(params);
    console.log('!!! cancel resp', JSON.stringify(response, null, 2));
  }
};

const putOrders = async (ordersList) => {
  for await (const order of ordersList) {
    const {
      user_id,
      exchange_id,
      exchange_name,
      side,
      market,
      stock,
      money,
      price,
      amount,
      filled_qty,
      total_fee
    } = order;

    const params = {
      user_id: user_id.toUpperCase(),
      exchange_id,
      exchange_name,
      side,
      market,
      stock,
      money,
      price: parseFloat(price),
      amount: parseFloat(amount) - parseFloat(filled_qty),
      total_fee: parseFloat(total_fee)
    };
    console.log('::: put params', JSON.stringify(params, null, 2));
    const response = await orderController.putLimit(params);
    console.log('::: put resp', JSON.stringify(response, null, 2));
  }
};

export const recreateOrders = async ({ stage }) => {
  if (stage === 'cancel') {
    // --- stage 1 ---
    const response: QueryResult = await pool.query(`
    DROP TABLE debug_closed_orders;
    CREATE TABLE debug_closed_orders AS 
    select *
    from order_history
    where status in ('active', 'partially');
  `);

    const queryString: string = `select * from debug_closed_orders`;
    const { rows }: QueryResult = await pool.query(queryString);

    await cancelOrders(rows);
  }

  if (stage === 'place') {
    // --- stage 2 ---
    const queryString: string = `select * from debug_closed_orders`;
    const { rows }: QueryResult = await pool.query(queryString);
    await putOrders(rows);
  }
};