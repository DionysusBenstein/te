import config from '../config/matchengine.config';

export function getAssetList() {
  return config.assets.map((asset) => asset.name);
}

export function getMarketList() {
  return config.markets.map((market) => market.name);
}
