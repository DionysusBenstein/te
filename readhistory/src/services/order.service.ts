import _ from "lodash";
import { QueryResult } from "pg";
import { pool } from "../config/database.config";
import { FinishedDetailParams } from "../dto/finished-detail-params.dto";
import { OrderDealsParams } from "../dto/order-deals-params.dto";
import { OrderFinishedParams } from "../dto/order-finished-params.dto";
import { betweenDateQuery } from "../utils/between-date-query.util";
import { fieldMatch } from "../utils/fields-match.util";

class OrderService {
  async getDeals({ offset, limit, ...params }: OrderDealsParams) {
    const queryString = `
       SELECT * FROM deal_history WHERE ${fieldMatch(
         params
       )} LIMIT ${limit} OFFSET ${offset} ;
    `;

    const { rows }: QueryResult = await pool.query(queryString);

    return rows;
  }

  async getOrderFinished({
    start_time,
    end_time,
    limit,
    offset,
    ...params
  }: OrderFinishedParams) {
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

    const { rows }: QueryResult = await pool.query(queryString);

    return rows;
  }

  async getFinishedDetail(params: FinishedDetailParams) {
    const queryString = `
        SELECT * FROM order_detail WHERE ${fieldMatch(
          params
        )} AND finish_time <= '${new Date(Date.now()).toISOString()}';
    `;

    const { rows }: QueryResult = await pool.query(queryString);

    return rows;
  }
}

export default new OrderService();
