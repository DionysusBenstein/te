import { pool } from '../config/database.config';
import { QueryResult } from 'pg';
import { Order, Deal, Balance } from '../typings/types';
import { v4 as uuidv4 } from 'uuid';

class Queries {
  async appendOrderHistory({
    id,
    exchange_id,
    exchange_name,
    user_id,
    type,
    side,
    market,
    status,
    price,
    amount,
    total,
    total_fee,
    deal_money,
    deal_stock,
    create_time,
    update_time,
  }: Order): Promise<Order[]> {
    try {
      const queryString: string = `
        INSERT INTO "order_history" (
          "id",
          "exchange_id",
          "exchange_name",
          "user_id",
          "type",
          "side",
          "market",
          "status",
          "price",
          "amount",
          "total",
          "deal_money",
          "deal_stock",
          "total_fee",
          "create_time",
          "update_time"
        )
        VALUES            
          (
            '${id}',
            '${exchange_id}',
            '${exchange_name}',
            '${user_id}',
            '${type}',
            '${side}',
            '${market}',
            '${status}',
            ${price},
            ${amount},
            ${total},
            ${deal_money},
            ${deal_stock},
            ${total_fee},
            '${create_time}',
            '${update_time}'
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
    exchange_id,
    exchange_name,
    user_id,
    deal_user_id,
    order_id,
    deal_order_id,
    market,
    role,
    price,
    amount,
    total,
    deal,
    fee,
    deal_fee,
    time,
  }: Deal): Promise<Deal[]> {
    try {
      const queryString: string = `
        INSERT INTO "deal_history" (
          "id",
          "exchange_id",
          "exchange_name",
          "user_id",
          "deal_user_id",
          "order_id",
          "deal_order_id",
          "market",
          "role",
          "price",
          "amount",
          "total",
          "deal",
          "fee",
          "deal_fee",
          "time"
        )
        VALUES            
          (
            '${id}',
            '${exchange_id}',
            '${exchange_name}',
            '${user_id}',
            '${deal_user_id}',
            '${order_id}',
            '${deal_order_id}',
            '${market}',
            '${role}',
            ${price},
            ${amount},
            ${total},
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

  async updateOrder(order: Order, updateTime: string): Promise<Order[]> {
    try {
      const queryString: string = `
        UPDATE "order_history"
        SET
          status = '${order.status}',
          update_time = '${updateTime}'
        WHERE id = '${order.id}'
      ;`;

      const response: QueryResult = await pool.query(queryString);

      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getBalanceHistory(
    user_id: string,
    assets: string[]
  ): Promise<Balance[]> {
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
