import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "postgres",
  database: "trade_history",
  password: "b7Mg4UmK",
  port: 5432,
});
