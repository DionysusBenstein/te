import { pool } from '../config/database.config';
import { QueryResult } from 'pg';
import { Order, Deal, Balance } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

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
  }: Order): Promise<Order[]> {
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
            '${user_id}',
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

  async appendDealHistory({
    id,
    user_id,
    order_id,
    deal_order_id,
    role,
    price,
    amount,
    deal,
    fee,
    deal_fee,
    time,
  }: Deal): Promise<Deal[]> {
    try {
      const queryString: string = `
        INSERT INTO "deal_history" (
          "id",
          "user_id",
          "order_id",
          "deal_order_id",
          "role",
          "price",
          "amount",
          "deal",
          "fee",
          "deal_fee",
          "time"
        )
        VALUES            
          (
            '${id}',
            '${user_id}',
            '${order_id}',
            '${deal_order_id}',
            '${role}',
            ${price},
            ${amount},
            ${deal},
            ${fee},
            ${deal_fee},
            '${time}'
          )`;

      const response: QueryResult = await pool.query(queryString);

      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async updateOrder(order_id: string, finish_time: string): Promise<Order[]> {
    try {
      const queryString: string = `
      UPDATE "order_history"
      SET finish_time = '${finish_time}'
      WHERE id = '${order_id}';`;

      const response: QueryResult = await pool.query(queryString);

      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getBalanceHistory(user_id: string, assets: string[]): Promise<Balance[]> {
    try {
      const response: QueryResult = await pool.query(
        'SELECT * FROM balance_history WHERE ($1::uuid IS NULL OR user_id=$1) AND asset = ANY($2)',
        [user_id, [...assets]]
      );

      return response.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getLastBalance(user_id: string, assets: string[]): Promise<Balance> {
    try {
      const response: QueryResult = await pool.query(
        'SELECT * FROM balance_history WHERE user_id = $1 AND asset = ANY($2) ORDER BY time DESC LIMIT 1',
        [user_id, assets]
      );

      return response.rows[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async appendBalanceHistory({
    user_id,
    time,
    asset,
    business,
    change,
    balance,
    detail,
  }: Balance) {
    try {
      const queryString: string = `
          INSERT INTO balance_history (id, user_id, time, asset, business, change, balance, detail)
          VALUES ('${uuidv4()}', '${user_id}', '${time}', '${asset}', '${business}', ${change}, ${balance}, '${detail}');
      `;

      const response: QueryResult = await pool.query(queryString);
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export default new Queries();
