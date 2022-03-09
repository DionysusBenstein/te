import _ from "lodash";
import { QueryResult } from "pg";
import { pool } from "../config/database.config";
import { BalanceHistoryParams } from "../dto/balance-history-params.dto";
import { generateSqlCriteria } from "../utils/generate-query-string.util";

class BalanceService {
  async getHistory({
    offset,
    limit,
    start_time,
    end_time,
    ...params
  }: BalanceHistoryParams) {
    const queryString = `
       SELECT * FROM balance_history WHERE ${generateSqlCriteria(
         params
       )} LIMIT ${limit} OFFSET ${offset};
    `;

    console.log(queryString);

    const { rows }: QueryResult = await pool.query(
      queryString,
      _.values(params)
    );

    console.log(rows);

    return rows;
  }
}

export default new BalanceService();
