import { BalanceQueryParams } from '../dto/balance-query-params.dto';
import { UpdateBalanceParams } from '../dto/update-balance-params.dto';
import { getCurrentTimestamp } from '../utils/time.util';
import { getAssetConfigByName } from '../utils/config.util';
import { Balance } from '../typings/types';
import db from '../database/queries';
import kafkaProducer from '../kafka/kafka.producer';
import { KafkaTopic, OrderEvent } from '../typings/enums';

class BalanceService {
  idStart: number;

  constructor() {
    this.idStart = 1;
  }

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

    let lastBalance = 0
    if (balanceArr.length) {
      lastBalance = balanceArr.pop().balance;
    }

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

    return { new_balance: newBalance };
  }

  async handleWebhook({ dealInfo, error }) {
    try {
      const deal = JSON.parse(dealInfo);
      let dbError = null;

      if (error) {
        const response = await db.findDealById({ id: deal.id });

        if (response.err) {
          dbError = response.err;
        } else {
          await new Promise(resolve => setTimeout(resolve, 5000));

          kafkaProducer.pushMessage(
            `${KafkaTopic.DEALS}-retry`,
            OrderEvent.FINISH,
            deal
          );
        }
      }

      db.appendWebhookHistory({
        deal_id: deal.id,
        api_error: error,
        time: getCurrentTimestamp(),
        error: dbError
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new BalanceService();
