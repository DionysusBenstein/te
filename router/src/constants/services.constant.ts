const { env } = process;

export const services = {
  marketprice: {
    host: env.MARKET_PRICE_HOST || "localhost",
    port: env.MARKET_PRICE_PORT || 3000,
  },
  matchengine: {
    host: env.MATCH_ENGINE_HOST || "localhost",
    port: env.MATCH_ENGINE_PORT || 3001,
  },
  readhistory: {
    host: env.READ_HISTORY_HOST || "localhost",
    port: env.READ_HISTORY_PORT || 3002,
  },
} as const;
