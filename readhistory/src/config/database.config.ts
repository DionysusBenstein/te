import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "trade_history",
  password: "b7Mg4UmK",
  port: 5432,
});
