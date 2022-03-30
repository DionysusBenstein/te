import { BalanceQueryParams } from '../dto/balance-query-params.dto';
import { UpdateBalanceParams } from '../dto/update-balance-params.dto';
import { getCurrentTimestamp } from '../utils/time.util';
import { Balance } from '../types/types';
import db from '../database/queries';

class BalanceService {
  idStart: number;

  constructor() {
    this.idStart = 1;
  }

  unfreezeBalance() {}

  freezeBalance() {}

  async getStatus(assetName: string) {
    const balanceSlice = await db.getBalanceSlice(assetName);
    const status = {
      name: '',
      totalBalance: 0,
      availableBalance: 0,
      availableCount: 0,
      freezeBalance: 0,
      freezeCount: 0,
    };

    const result = balanceSlice.reduce((acc, slice) => {
      if (slice.type == 'freeze') {
        acc.freezeCount += 1;
        acc.freezeBalance += +slice.balance;
      } else {
        acc.availableCount += 1;
        acc.availableBalance += +slice.balance;
      }

      acc.name = assetName;
      acc.totalBalance += +slice.balance;

      return acc;
    }, status);

    return result;
  }

  async query({ user_id, assets, ...params }: BalanceQueryParams) {
    const response = await db.getBalanceHistory(user_id, assets);
    const { asset, balance } = response[0];

    const available = response.reduce((acc: number, item: Balance) => acc + +item.balance, 0);
    
    const resObj = {
      [asset]: {
        available: available.toFixed(16),
        freeze: balance,
      },
    };

    return resObj;
  }

  async update({
    id,
    userId,
    asset,
    business,
    change,
    detail,
    ...params
  }) {
    const balanceArr = await db.getBalanceHistory(userId, asset);
    const { balance: lastBalance, id: lastId } = balanceArr.pop();

    if (change < 0 && lastBalance < Math.abs(change)) {
      return { message: 'Balance is not enough' };
    }

    if (lastId >= id) {
      return { message: `id ${id} already exist` };
    }

    const newBalance = +lastBalance + change;
    const time = getCurrentTimestamp();
    const response = await db.updateBalance(
      id,
      userId,
      time,
      asset,
      business,
      change,
      newBalance,
      detail
    );

    return { ...response };
  }
}

export default new BalanceService();
