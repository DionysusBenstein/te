import { FinishedDetailParams } from "../dto/finished-detail-params.dto";
import { OrderDealsParams } from "../dto/order-deals-params.dto";
import { OrderFinishedParams } from "../dto/order-finished-params.dto";
import { OrderHistoryParams } from '../dto/order-history-params.dto';
import orderService, { OrderService } from "../services/order.service";
import { validateAndConvert } from "../utils/validation.util";

export class OrderController {
  constructor(private orderService: OrderService) {}
  async deals(params: OrderDealsParams) {
    const { data, errors } = await validateAndConvert(OrderDealsParams, params);

    if (errors) {
      return {
        errors,
        message: "Invalid params!",
      };
    }

    return {
      limit: params.limit,
      offset: params.offset,
      records: await this.orderService.getDeals(data),
    };
  }
  async finished(params: OrderFinishedParams) {
    const { data, errors } = await validateAndConvert(
      OrderFinishedParams,
      params
    );

    if (errors) {
      return {
        errors,
        message: "Invalid params!",
      };
    }

    return {
      offset: params.offset,
      limit: params.limit,
      records: await this.orderService.getOrderFinished(data),
    };
  }
  async finished_detail(params: FinishedDetailParams) {
    const { data, errors } = await validateAndConvert(
      FinishedDetailParams,
      params
    );

    if (errors) {
      return {
        errors,
        message: "Invalid params!",
      };
    }

    return {
      records: await this.orderService.getFinishedDetail(data),
    };
  }
  
  async history(params: OrderHistoryParams) {
    const { data, errors } = await validateAndConvert(
      OrderHistoryParams,
      params
    );

    if (errors) {
      return {
        errors,
        message: 'Invalid params!',
      };
    }

    const { records, total } = await this.orderService.getOrderHistory(data);

    return {
      offset: params.offset,
      limit: params.limit,
      total,
      records
    };
  }
}

export default new OrderController(orderService);
