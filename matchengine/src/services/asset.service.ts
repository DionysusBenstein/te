import config from '../config/matchengine.config';
import { Asset, Balance } from '../types/types';
import db from '../database/queries';

class AssetService {
  list() {
    return config.assets;
  }

  async summary({ assets }) {
    const result = [];

    for (const asset of assets) {
      const balanceHistory = await db.getBalanceHistory(null, [asset]);
      console.log(balanceHistory);

      let total_balance = balanceHistory.reduce(
        (acc: number, item: Balance) => acc + +item.balance,
        0
      );
      const available_count = balanceHistory.length;

      total_balance = total_balance.toFixed(16);

      const summary = {
        name: asset.name,
        total_balance,
        available_count,
        available_balance: total_balance,
        freeze_count: total_balance,
        freeze_balance: total_balance,
      };

      result.push(summary);
    }

    return result;
  }
}

export default new AssetService();
