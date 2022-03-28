import { Pool, QueryResult } from "pg";
import { pool } from "../config/database.config";
import { MarketUserDealsParams } from "../dto/market-user-deals-params.dto";
import { UserDealHistory } from "../typings/types/user-deal-history.return-type";
import { fieldMatch } from "../utils/fields-match.util";

export class MarketService {
  constructor(private pool: Pool) {}

  async getUserDeals({
    limit,
    offset,
    ...params
  }: MarketUserDealsParams): Promise<UserDealHistory[]> {
    const queryString = `
    SELECT * FROM user_deal_history WHERE ${fieldMatch(
      params
    )} LIMIT ${limit} OFFSET ${offset};
    `;

    const { rows }: QueryResult<UserDealHistory> = await this.pool.query(
      queryString
    );

    return rows;
  }
}

export default new MarketService(pool);
