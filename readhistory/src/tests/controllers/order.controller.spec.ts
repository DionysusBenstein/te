import { OrderController } from "../../controllers/order.controller";
import { FinishedDetailParams } from "../../dto/finished-detail-params.dto";
import { OrderDealsParams } from "../../dto/order-deals-params.dto";
import { OrderFinishedParams } from "../../dto/order-finished-params.dto";
import { OrderService } from "../../services/order.service";
import { resolved } from "../../utils/resolved.util";
import {
  dealHistoryMock,
  orderDetailMock,
  orderHistoryMock,
} from "../mocks/order.mocks";

describe("OrderController", () => {
  const orderController = new OrderController({
    getDeals: (props) => resolved(dealHistoryMock),
    getOrderFinished: (props) => resolved(orderHistoryMock),
    getFinishedDetail: (props) => resolved(orderDetailMock),
  } as OrderService);
  describe("OrderController.deals", () => {
    it("should return `limit`, `offset` and `records`", async () => {
      const params: OrderDealsParams = {
        limit: 1,
        order_id: 1,
        offset: 1,
      };

      expect(await orderController.deals(params)).toStrictEqual({
        limit: 1,
        offset: 1,
        records: dealHistoryMock,
      });
    });
    it("should fail, then return `message` and `errors`", async () => {
      // invalid params will fail and the validation messages will be returned
      const params = {
        limit: "invalid",
        order_id: "invalid",
        offset: "invalid",
      } as any;

      const result = await orderController.deals(params);

      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("message");
    });
  });
  describe("OrderController.finished", () => {
    it("should return `limit`, `offset` and `records`", async () => {
      const params: OrderFinishedParams = {
        limit: 1,
        offset: 1,
        end_time: "2019-09-09",
        start_time: "2019-08-09",
        market: "some market",
        side: 1,
        user_id: 1,
      };

      expect(await orderController.finished(params)).toStrictEqual({
        limit: 1,
        offset: 1,
        records: orderHistoryMock,
      });
    });
    it("should fail, then return `message` and `errors`", async () => {
      // invalid params will fail and the validation messages will be returned
      const params = {
        limit: "invalid",
        offset: "invalid",
        end_time: "invalid",
        start_time: "invalid",
        market: 0,
        side: "invalid",
        user_id: "invalid",
      } as any;

      const result = await orderController.finished(params);

      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("message");
    });
  });
  describe("OrderController.finished_detail", () => {
    it("should return `limit`, `offset` and `records`", async () => {
      const params: FinishedDetailParams = {
        user_id: 1,
      };

      expect(await orderController.finished_detail(params)).toStrictEqual({
        records: orderDetailMock,
      });
    });
    it("should fail, then return `message` and `errors`", async () => {
      // invalid params will fail and the validation messages will be returned
      const params = {
        order_id: "invalid",
      } as any;

      const result = await orderController.finished_detail(params);

      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("message");
    });
  });
});
