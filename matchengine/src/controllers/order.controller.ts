import { PutLimitParams } from '../dto/put-limit-params.dto';
import { OrderBookParams } from '../dto/order-book-params.dto';
import { PendingParams } from '../dto/pending-params.dto';
import { PendingDetailParams } from '../dto/pending-detail-params.dto';
import { validateAndConvert } from '../utils/validation.util';
import orderService from '../services/order.service';
import { Order } from 'src/types/types';

class OrderController {
  async putLimit(params: PutLimitParams) {
    const { data, errors } = await validateAndConvert(PutLimitParams, params);

    if (errors) {
      return {
        errors,
        message: 'Invalid params!',
      };
    }

    return await orderService.putLimit(data);
  }

  async book(params: OrderBookParams) {
    const { data, errors } = await validateAndConvert(OrderBookParams, params);

    if (errors) {
      return {
        errors,
        message: 'Invalid params!',
      };
    }

    const { total, records } = orderService.book(data);

    return {
      offset: params.offset,
      limit: params.limit,
      total,
      records,
    };
  }

  async pending(params: PendingParams) {
    const { data, errors } = await validateAndConvert(PendingParams, params);

    if (errors) {
      return {
        errors,
        message: 'Invalid params!',
      };
    }

    const { total, records } = orderService.pending(data);

    return {
      offset: params.offset,
      limit: params.limit,
      total,
      records,
    };
  }

  async pending_detail(params: PendingDetailParams) {
    const { data, errors } = await validateAndConvert(PendingDetailParams, params);

    if (errors) {
      return {
        errors,
        message: 'Invalid params!',
      };
    }

    return orderService.pending_detail(data);
  }
}

export default new OrderController();
