import { QueryResult, Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "exchange_db",
  password: "b7Mg4UmK",
  port: 5432,
});

class Queries {
  async getBalance(userId: number, ...assets: string[]) {
    try {
      const response: QueryResult = await pool.query(
        "SELECT * FROM balance_history WHERE user_id = $1 AND asset = ANY($2)",
        [userId, [...assets]]
      );

      return response.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async updateBalance(
    userId: number,
    asset: string,
    business: string,
    businessId: number,
    change: number,
    detail: object
  ) {
    try {
      const response: QueryResult = await pool.query(
        `
                UPDATE balance_history
                SET asset = $2, business = $3, business_id = $4, change = $5, detail = $6
                WHERE user_id = $1;
                `,
        [userId, asset, business, businessId, change, detail]
      );

      return "success";
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getBalanceHistory(
    userId: number,
    asset: string,
    business: string,
    startTime: Date,
    endTime: Date,
    offset: number,
    limit: number
  ) {
    try {
      const response: QueryResult = await pool.query(
        "SELECT * FROM balance_history WHERE user_id = $1 asset = $2, business = $3, start_time = $4, end_time = $5, offset = $6, limit = $7",
        [userId, asset, business, startTime, endTime, offset, limit]
      );

      return response.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getMarketList() {
    try {
      const response: QueryResult = await pool.query(
        "SELECT * FROM market_history",
        []
      );

      return response.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getMarketSummary(marketList: string) {
    try {
      const response: QueryResult = await pool.query(
        "SELECT * FROM market_history WHERE ANY($1)",
        [marketList]
      );

      return response.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getAssetList() {
    try {
      const response: QueryResult = await pool.query(
        "SELECT * FROM assets",
        []
      );

      return response.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getAssetSummary(assetList: string) {
    try {
      const response: QueryResult = await pool.query(
        "SELECT * FROM assets WHERE ANY($1)",
        [assetList]
      );

      return response.rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

export default new Queries();
