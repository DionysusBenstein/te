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
  }: MarketUserDealsParams) {
    const queryString = `
      SELECT
        (SELECT COUNT(*) 
         FROM deal_history
         WHERE ${fieldMatch(params)}
        ) as count, 
        (SELECT json_agg(t.*) FROM (
            SELECT * FROM deal_history
            WHERE ${fieldMatch(params)}
            OFFSET ${offset}
            LIMIT ${limit}
        ) AS t) AS rows 
    `;

    const { rows } = await this.pool.query(
      queryString
    );
      
    return {
      records: rows[0].rows,
      total: parseInt(rows[0].count)
    };
  }
}

export default new MarketService(pool);
