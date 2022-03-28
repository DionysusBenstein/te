import { MarketController } from "../../controllers/market.controller";
import { MarketDealsParams } from "../../dto/market-deals-params.dto";
import { MarketLastParams } from "../../dto/market-last-params.dto";
import { MarketStatusParams } from "../../dto/market-status-params.dto";
import { MarketStatusTodayParams } from "../../dto/market-status-today-params.dto";
import { MarketService } from "../../services/market.service";
import {
  marketDealsMock,
  marketLastMock,
  marketStatusMock,
  marketStatusTodayMock,
} from "../mocks/market.mocks";

describe("MarketController", () => {
  const marketController = new MarketController({
    getLast: (props) => new Promise((resolve) => resolve(marketLastMock)),
    getDeals: (props) => new Promise((resolve) => resolve(marketDealsMock)),
    getStatus: (props) => new Promise((resolve) => resolve(marketStatusMock)),
    getStatusToday: (props) =>
      new Promise((resolve) => resolve(marketStatusTodayMock)),
  } as MarketService);

  describe("MarketController.last", () => {
    it("should return the last market", async () => {
      const params: MarketLastParams = {
        market: "BTC",
      };

      expect(await marketController.last(params)).toStrictEqual(marketLastMock);
    });
    it("should fail, then return `message` and `errors`", async () => {
      // invalid params will fail and the validation messages will be returned
      const params = {
        market: 1,
      } as any;

      const result = await marketController.last(params);

      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("message");
    });
  });
  describe("MarketController.deals", () => {
    it("should return deals", async () => {
      const params: MarketDealsParams = {
        market: "BTC",
        last_id: 2,
        limit: 4,
      };

      expect(await marketController.deals(params)).toStrictEqual(
        marketDealsMock
      );
    });
    it("should fail, then return `message` and `errors`", async () => {
      // invalid params will fail and the validation messages will be returned
      const params = {
        market: 1,
      } as any;

      const result = await marketController.deals(params);

      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("message");
    });
  });
  describe("MarketController.status", () => {
    it("should return market status", async () => {
      const params: MarketStatusParams = {
        market: "BTC",
        period: 1,
      };

      expect(await marketController.status(params)).toStrictEqual(
        marketStatusMock
      );
    });
    it("should fail, then return `message` and `errors`", async () => {
      // invalid params will fail and the validation messages will be returned
      const params = {
        market: 1,
        period: "invalid",
      } as any;

      const result = await marketController.status(params);

      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("message");
    });
  });
  describe("MarketController.status_today", () => {
    it("should return market status for today", async () => {
      const params: MarketStatusTodayParams = {
        market: "BTC",
      };

      expect(await marketController.status_today(params)).toStrictEqual(
        marketStatusTodayMock
      );
    });
    it("should fail, then return `message` and `errors`", async () => {
      // invalid params will fail and the validation messages will be returned
      const params = {
        market: 1,
      } as any;

      const result = await marketController.status_today(params);

      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("message");
    });
  });
});
