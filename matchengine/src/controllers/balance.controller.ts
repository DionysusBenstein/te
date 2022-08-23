import { BalanceQueryParams } from '../dto/balance-query-params.dto';
import { UpdateBalanceParams } from '../dto/update-balance-params.dto';
import balanceService from '../services/balance.service';
import { validateAndConvert } from '../utils/validation.util';

class BalanceController {
  async query(params: BalanceQueryParams) {
    const { data, errors } = await validateAndConvert(
      BalanceQueryParams,
      params
    );

    if (errors) {
      return {
        errors,
        message: 'Invalid params!',
      };
    }

    return await balanceService.query(data);
  }

  async update(params: UpdateBalanceParams) {
    const { data, errors } = await validateAndConvert(
      UpdateBalanceParams,
      params
    );

    if (errors) {
      return {
        errors,
        message: 'Invalid params!',
      };
    }

    return await balanceService.update(data);
  }

  async webhook(params) {
    const { dealId, error } = params;

    balanceService.handleWebhook({ dealId, error });
  }
}

export default new BalanceController();
