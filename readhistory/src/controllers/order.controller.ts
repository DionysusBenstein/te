import { FinishedDetailParams } from "../dto/finished-detail-params.dto";
import { OrderDealsParams } from "../dto/order-deals-params.dto";
import { OrderFinishedParams } from "../dto/order-finished-params.dto";
import orderService from "../services/order.service";
import { validateAndConvert } from "../utils/validation.util";

class OrderController {
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
      records: await orderService.getDeals(data),
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
      records: await orderService.getOrderFinished(data),
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
      records: await orderService.getFinishedDetail(data),
    };
  }
}

export default new OrderController();
