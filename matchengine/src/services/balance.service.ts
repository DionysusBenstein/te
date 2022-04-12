import { BalanceQueryParams } from '../dto/balance-query-params.dto';
import { UpdateBalanceParams } from '../dto/update-balance-params.dto';
import { getCurrentTimestamp } from '../utils/time.util';
import { getAssetConfigByName } from '../utils/config.util';
import { Balance } from '../types/types';
import db from '../database/queries';

class BalanceService {
  idStart: number;

  constructor() {
    this.idStart = 1;
  }

  unfreezeBalance() {}

  freezeBalance() {}

  async query({ user_id, assets, ...params }: BalanceQueryParams) {
    const result: any = [];

    for (const asset of assets) {
      const { balance } = await db.getLastBalance(user_id, [asset]);

      result.push({
        [asset]: {
          available: balance,
          freeze: 0,
        },
      });
    }

    return result;
  }

  async update({
    user_id,
    asset,
    business,
    change,
    detail,
    ...params
  }: UpdateBalanceParams) {
    const balanceArr = await db.getBalanceHistory(user_id, [asset]);
    const { balance: lastBalance } = balanceArr.pop();

    if (change < 0 && lastBalance < Math.abs(change)) {
      return { message: 'Balance is not enough' };
    }

    const balance: number = +lastBalance + change;
    const time = getCurrentTimestamp();
    const newBalance = {
      user_id,
      time,
      asset,
      business,
      change,
      balance,
      detail,
    };

    await db.appendBalanceHistory(newBalance);

    return { newBalance: newBalance };
  }
}

export default new BalanceService();
