import { pool } from '../config/database.config';
import { QueryResult } from 'pg';
import { Order } from '../types/types';
import { getCurrentTimestamp } from '../utils/time.util';

class Queries {
  async getOrderHistory(userId: number, asset: string) {
    try {
      const response: QueryResult = await pool.query(
        'SELECT * FROM order_history WHERE userId = $1 AND asset = $2',
        [userId, asset]
      );

      return response.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async appendOrderHistory({
    id,
    user_id,
    type,
    side,
    price,
    amount,
    market,
    taker_fee,
    maker_fee,
    deal_money,
    deal_stock,
    deal_fee,
    create_time,
    finish_time,
  }: Order): Promise<Order[]>{
    try {
      const queryString: string = `
        INSERT INTO "order_history" (
          "id",
          "user_id",
          "type",
          "side",
          "price",
          "amount",
          "market",
          "deal_money",
          "deal_stock",
          "taker_fee",
          "maker_fee",
          "deal_fee",
          "create_time",
          "finish_time"
        )
        VALUES            
          (
            '${id}',
            ${user_id},
            '${type}',
            '${side}',
            ${price},
            ${amount},
            '${market}',
            ${deal_money},
            ${deal_stock},
            ${taker_fee},
            ${maker_fee},
            ${deal_fee},
            '${create_time}',
            '${finish_time}'
          )`;

      const response: QueryResult = await pool.query(queryString);

      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async updateOrder(order_id: string): Promise<Order[]>{
    try {
      const queryString: string = `
      UPDATE "order_history"
      SET finish_time = '${getCurrentTimestamp()}',
      WHERE id = '${order_id}';`;

      const response: QueryResult = await pool.query(queryString);

      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getBalanceHistory(user_id: number, assets: string[]) {
    try {      
      const response: QueryResult = await pool.query(
        // 'SELECT * FROM balance_history WHERE user_id = $1 AND asset = ANY($2)',
        'SELECT * FROM balance_history WHERE ($1::int IS NULL OR user_id=$1) AND asset = ANY($2)',
        [user_id, [...assets]]
      );

      return response.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getLastBalance(user_id: number, assets: string) {
    try {
      const response: QueryResult = await pool.query(
        'SELECT * FROM balance_history WHERE user_id = $1 AND asset = $2 ORDER BY time DESC LIMIT 1',
        [user_id, assets]
      );

      return response.rows[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async updateBalance(
    id: number,
    user_id: number,
    time: string,
    asset: string,
    business: string,
    change: number,
    balance: number,
    detail: string
  ) {
    try {
      const queryString: string = `
                INSERT INTO balance_history (id, user_id, time, asset, business, change, balance, detail)
                VALUES (${id}, ${user_id}, '${time}', '${asset}', '${business}', ${change}, ${balance}, '${detail}');
            `;
      const response: QueryResult = await pool.query(queryString);

      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getBalanceSlice(asset: string) {
    try {
      const response: QueryResult = await pool.query(
        'SELECT * FROM slice_balance WHERE asset = $1',
        [asset]
      );

      return response.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export default new Queries();
