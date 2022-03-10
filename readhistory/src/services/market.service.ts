import { QueryResult } from "pg";
import { pool } from "../config/database.config";
import { MarketUserDealsParams } from "../dto/market-user-deals-params.dto";
import { fieldMatch } from "../utils/fields-match.util";

class MarketService {
  async getUserDeals({ limit, offset, ...params }: MarketUserDealsParams) {
    const queryString = `
    SELECT * FROM user_deal_history WHERE ${fieldMatch(
      params
    )} LIMIT ${limit} OFFSET ${offset};
    `;

    const { rows }: QueryResult = await pool.query(queryString);

    return rows;
  }
}

export default new MarketService();
