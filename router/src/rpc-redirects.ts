import { services } from "./constants/services.constant";
import { redirect } from "./util/redirect.util";

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
  order: {
    put_limit: redirect(services.matchengine),
    put_market: redirect(services.matchengine),
    cancel: redirect(services.matchengine),
    deals: redirect(services.readhistory),
    book: redirect(services.matchengine),
    depth: redirect(services.matchengine),
    pending: redirect(services.matchengine),
    pending_detail: redirect(services.matchengine),
    history: redirect(services.readhistory),
    finished: redirect(services.readhistory),
    finished_detail: redirect(services.readhistory),
    // temp
    settle_book: redirect(services.matchengine),
  },
  market: {
    last: redirect(services.marketprice),
    deals: redirect(services.marketprice),
    user_deals: redirect(services.readhistory),
    kline: redirect(services.marketprice),
    status: redirect(services.marketprice),
    status_today: redirect(services.marketprice),
    list: redirect(services.matchengine),
    summary: redirect(services.matchengine),
  },
} as const;
