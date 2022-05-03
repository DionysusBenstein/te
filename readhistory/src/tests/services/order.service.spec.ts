import { FinishedDetailParams } from "../../dto/finished-detail-params.dto";
import { OrderDealsParams } from "../../dto/order-deals-params.dto";
import { OrderFinishedParams } from "../../dto/order-finished-params.dto";
import { OrderService } from "../../services/order.service";
import { SideEnum } from "../../typings/enums/side.enum";
import {
  dealHistoryMock,
  orderDetailMock,
  orderHistoryMock,
} from "../mocks/order.mocks";
import { createInstance } from "../utils/create-instance.util";

describe("OrderService", () => {
  describe("OrderService.getDeals", () => {
    const orderService = createInstance(OrderService, {
      query: () => ({ rows: dealHistoryMock }),
    }) as OrderService;
    it("should return array of `records`", async () => {
      const params: OrderDealsParams = {
        order_id: '63a1a1d3-c117-4cf8-9a3c-17d375b2bd25',
        offset: 1,
        limit: 1,
      };

      expect(await orderService.getDeals(params)).toStrictEqual(
        dealHistoryMock
      );
    });
  });
  describe("OrderService.getOrderFinished", () => {
    const orderService = createInstance(OrderService, {
      query: () => ({ rows: orderHistoryMock }),
    }) as OrderService;
    it("should return array of `records`", async () => {
      const params: OrderFinishedParams = {
        limit: 1,
        offset: 1,
        end_time: "2019-09-09",
        start_time: "2019-08-09",
        market: "some market",
        side: SideEnum.ASK,
        user_id: 1,
      };

      expect(await orderService.getOrderFinished(params)).toStrictEqual(
        orderHistoryMock
      );
    });
  });
  describe("OrderService.getFinishedDetail", () => {
    const orderService = createInstance(OrderService, {
      query: () => ({ rows: orderDetailMock }),
    }) as OrderService;
    it("should return array of `records`", async () => {
      const params: FinishedDetailParams = {
        user_id: 1,
      };

      expect(await orderService.getFinishedDetail(params)).toStrictEqual(
        orderDetailMock
      );
    });
  });
});
