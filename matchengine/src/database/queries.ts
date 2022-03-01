import { QueryResult, Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'b7Mg4UmK',
    port: 5432
});

class Queries {
    async getBalance(userId: number, ...assets: string[]) {
        try {
            const response: QueryResult = await pool.query(
                'SELECT * FROM balance_history WHERE user_id = $1 AND asset = ANY($2)',
                [userId, [...assets]]
            );

            return response.rows;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async updateBalance(userId: number, asset: string, business: string, businessId: number, change: number, detail: object) {
        try {
            const response: QueryResult = await pool.query(`
                UPDATE balance_history 
                SET "asset" = $2, "business" = $3, "business_id" = $4, "change" = $5, detail = $6
                WHERE "user_id" = $1;
                `, [userId, asset, business, businessId, change, detail]
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
                'SELECT * FROM market_history',
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
                'SELECT * FROM market_history WHERE ANY($1)',
                [marketList]
            );

            return response.rows;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getAssetsList() {
        try {
            const response: QueryResult = await pool.query(
                'SELECT * FROM assets_history',
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
                'SELECT * FROM asset_history WHERE ANY($1)',
                [assetList]
            );

            return response.rows;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getOrderBook(userId: number) {
        try {
            const response: QueryResult = await pool.query(
                'SELECT * FROM order_history WHERE user_id =$1',
                [userId]
            );

            return response.rows;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}

export default new Queries();