import _ from "lodash";
import { Pool, QueryResult } from "pg";
import { pool } from "../config/database.config";
import { BalanceHistoryParams } from "../dto/balance-history-params.dto";
import { BalanceHistory } from "../typings/types/balance-history.return-type";
import { betweenDateQuery } from "../utils/between-date-query.util";
import { fieldMatch } from "../utils/fields-match.util";

export class BalanceService {
  constructor(private pool: Pool) {}
  async getHistory({
    offset,
    limit,
    start_time,
    end_time,
    ...params
  }: BalanceHistoryParams): Promise<BalanceHistory[]> {
    const timeBetween = betweenDateQuery("time", start_time, end_time, true);

    const queryString = `
       SELECT * FROM balance_history WHERE ${fieldMatch(
         params
       )} ${timeBetween} LIMIT ${limit} OFFSET ${offset};
    `;

    const { rows }: QueryResult<BalanceHistory> = await this.pool.query(
      queryString
    );

    return rows;
  }
}

export default new BalanceService(pool);
