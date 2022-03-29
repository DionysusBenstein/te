import { BalanceHistoryParams } from "../dto/balance-history-params.dto";
import balanceService, { BalanceService } from "../services/balance.service";
import { validateAndConvert } from "../utils/validation.util";

export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  async history(params: BalanceHistoryParams) {
    const { data, errors } = await validateAndConvert(
      BalanceHistoryParams,
      params
    );

    if (errors) {
      return {
        errors,
        message: "Invalid params!",
      };
    }

    return {
      limit: params.limit,
      offset: params.offset,
      records: await this.balanceService.getHistory(data),
    };
  }
}

export default new BalanceController(balanceService);
