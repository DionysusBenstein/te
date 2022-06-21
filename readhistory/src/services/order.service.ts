import _ from "lodash";
import { Pool, QueryResult } from "pg";
import { pool } from "../config/database.config";
import { FinishedDetailParams } from "../dto/finished-detail-params.dto";
import { OrderDealsParams } from "../dto/order-deals-params.dto";
import { OrderFinishedParams } from "../dto/order-finished-params.dto";
import { OrderHistoryParams, OrderHistoryReportParams } from '../dto/order-history-params.dto';
import { DealHistory } from "../typings/types/deal-history.return-type";
import { OrderDetail } from "../typings/types/order-detail.return-type";
import { OrderHistory } from "../typings/types/order-history.return-type";
import { betweenDateQuery } from "../utils/between-date-query.util";
import { fieldMatch } from "../utils/fields-match.util";

export class OrderService {
  constructor(private pool: Pool) {}

  async getDeals({
    offset,
    limit,
    ...params
  }: OrderDealsParams): Promise<DealHistory[]> {
    const queryString = `
       SELECT * FROM deal_history WHERE ${fieldMatch(
         params
       )} LIMIT ${limit} OFFSET ${offset} ;
    `;

    const { rows }: QueryResult<DealHistory> = await this.pool.query(
      queryString
    );

    return rows;
  }

  async getOrderFinished({
    start_time,
    end_time,
    limit,
    offset,
    ...params
  }: OrderFinishedParams): Promise<OrderHistory[]> {
    const timeBetween = betweenDateQuery(
      "create_time",
      start_time,
      end_time,
      true
    );

    const queryString = `
        SELECT * FROM order_history WHERE ${fieldMatch(
          params
        )} ${timeBetween} LIMIT ${limit} OFFSET ${offset};
    `;

    const { rows }: QueryResult<OrderHistory> = await this.pool.query(
      queryString
    );

    return rows;
  }

  async getFinishedDetail(
    params: FinishedDetailParams
  ): Promise<OrderDetail[]> {
    const queryString = `
        SELECT * FROM order_detail WHERE ${fieldMatch(
          params
        )} AND update_time <= '${new Date(Date.now()).toISOString()}';
    `;

    const { rows }: QueryResult<OrderDetail> = await this.pool.query(
      queryString
    );

    return rows;
  }

  async getOrderHistory({ offset, limit, ...params }: OrderHistoryParams) {
    try {
      const queryString = `
        SELECT
          (SELECT COUNT(*) 
           FROM order_history
           WHERE ${fieldMatch(params)}
          ) as count, 
          (SELECT json_agg(t.*) FROM (
              SELECT * FROM order_history
              WHERE ${fieldMatch(params)}
              ORDER BY create_time DESC
              OFFSET ${offset}
              LIMIT ${limit}
          ) AS t) AS rows 
      `;

      const { rows } = await pool.query(queryString);

      return {
        records: rows[0].rows,
        total: parseInt(rows[0].count)
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getOrderHistoryReport(params: OrderHistoryReportParams) {
    const dateStart = new Date(params.date_start || 0).toISOString();
    const dateEnd = new Date(params.date_end || Date.now()).toISOString();

    try {
      const queryString = `
        SELECT * FROM order_history
        WHERE
          user_id = '${params.user_id}' AND
          create_time >= '${dateStart}' AND
          create_time <= '${dateEnd}'
        ORDER BY create_time DESC
      `;

      const { rows } = await pool.query(queryString);

      return {
        records: rows,
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export default new OrderService(pool);
