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
    finished: redirect(services.readhistory),
    finished_detail: redirect(services.readhistory),
  },
} as const;
