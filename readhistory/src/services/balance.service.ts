import _ from "lodash";
import { QueryResult } from "pg";
import { pool } from "../config/database.config";
import { BalanceHistoryParams } from "../dto/balance-history-params.dto";
import { betweenDateQuery } from "../utils/between-date-query.util";
import { fieldMatch } from "../utils/fields-match.util";

class BalanceService {
  async getHistory({
    offset,
    limit,
    start_time,
    end_time,
    ...params
  }: BalanceHistoryParams) {
    const timeBetween = betweenDateQuery("time", start_time, end_time, true);

    const queryString = `
       SELECT * FROM balance_history WHERE ${fieldMatch(
         params
       )} ${timeBetween} LIMIT ${limit} OFFSET ${offset};
    `;

    const { rows }: QueryResult = await pool.query(queryString);

    return rows;
  }
}

export default new BalanceService();
