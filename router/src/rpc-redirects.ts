import { Client, HttpClientOptions } from "jayson";

const env = process.env;

const services = {
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
};

const redirect = (service: HttpClientOptions) => Client.http(service);

export const redirects = {
  balance: {
    query: redirect(services.matchengine),
    update: redirect(services.matchengine),
    history: redirect(services.readhistory),
  },
  asset: {
    list: redirect(services.matchengine),
    summary: redirect(services.matchengine),
  },
};
