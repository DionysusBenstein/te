import { PutLimitParams } from '../dto/put-limit-params.dto';
import { PutMarketParams } from '../dto/put-market-params.dto';
import { OrderBookParams } from '../dto/order-book-params.dto';
import { PendingParams } from '../dto/pending-params.dto';
import { PendingDetailParams } from '../dto/pending-detail-params.dto';
import { CancelParams } from '../dto/cancel-params.dto';
import { DepthParams } from '../dto/depth-params.dto';
import { validateAndConvert } from '../utils/validation.util';
import { Deal } from '../typings/types';
import plainOrderService from '../services/order.service';

class OrderController {
  private orderService: any

  constructor() {
    const self = this;
    plainOrderService.initOrderBook().then(response => {
      self.orderService = response;
    })
  }

  async putLimit(params: PutLimitParams) {
    try {
      const { data, errors } = await validateAndConvert(PutLimitParams, params);

      if (errors) {
        return {
          errors,
          message: 'Invalid params!',
        };
      }

      const dealsList: Deal[] = await this.orderService.putLimit(data);

      return {
        status: 'ok',
        dealsList
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      }
    }
  }

  async putMarket(params: PutMarketParams) {
    try {
      const { data, errors } = await validateAndConvert(PutMarketParams, params);

      if (errors) {
        return {
          errors,
          message: 'Invalid params!',
        };
      }

      const dealsList: Deal[] = await this.orderService.putMarket(data);

      return {
        status: 'ok',
        dealsList
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      }
    }
  }

  async cancel(params: CancelParams) {
    const { data, errors } = await validateAndConvert(CancelParams, params);

    if (errors) {
      return {
        errors,
        message: 'Invalid params!',
      };
    }

    const result: any = await this.orderService.cancel(data)

    if (result) {
      return result;
    }

    return 'Order not found';
  }

  async depth(params: DepthParams) {
    const { data, errors } = await validateAndConvert(DepthParams, params);

    if (errors) {
      return {
        errors,
        message: 'Invalid params!',
      };
    }

    return await this.orderService.depth(data);
  }

  async book(params: OrderBookParams) {
    const { data, errors } = await validateAndConvert(OrderBookParams, params);

    if (errors) {
      return {
        errors,
        message: 'Invalid params!',
      };
    }

    const { total, records } = this.orderService.book(data);

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

    const { total, records } = this.orderService.pending(data);

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

    return this.orderService.pending_detail(data);
  }
}

export default new OrderController();
