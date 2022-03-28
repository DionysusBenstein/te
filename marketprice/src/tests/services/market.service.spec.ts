import { MarketDealsParams } from "../../dto/market-deals-params.dto";
import { MarketLastParams } from "../../dto/market-last-params.dto";
import { MarketStatusParams } from "../../dto/market-status-params.dto";
import { MarketStatusTodayParams } from "../../dto/market-status-today-params.dto";
import { MarketService } from "../../services/market.service";
import {
  marketDealsMock,
  marketStatusMock,
  marketStatusTodayMock,
} from "../mocks/market.mocks";
import { createInstance } from "../utils/create-instance.util";

describe("MarketService", () => {
  const marketService = createInstance(MarketService, {
    get: () =>
      JSON.stringify({
        deals: marketDealsMock,
      }),
  }) as MarketService;

  const marketServiceNulled = createInstance(MarketService, {
    get: () => null,
  }) as MarketService;

  describe("MarketService.getLast", () => {
    it("should return the last deal", async () => {
      const params: MarketLastParams = {
        market: "BTC",
      };
      expect(await marketService.getLast(params)).toStrictEqual(
        marketDealsMock[marketDealsMock.length - 1]
      );
    });
    it("should return null", async () => {
      const params = {
        market: "non existing market",
      } as any;

      expect(await marketServiceNulled.getLast(params)).toStrictEqual(null);
    });
  });

  describe("MarketService.getDeals", () => {
    it("should return deals", async () => {
      const params: MarketDealsParams = {
        market: "BTC",
        last_id: 2,
        limit: 4,
      };

      expect(await marketService.getDeals(params)).toStrictEqual(
        marketDealsMock.slice(params.last_id, params.limit + params.last_id)
      );
    });
    it("should return null", async () => {
      const params = {
        market: "non existing market",
        last_id: 2,
        limit: 4,
      } as any;

      expect(await marketServiceNulled.getDeals(params)).toStrictEqual(null);
    });
  });

  describe("MarketController.getStatus", () => {
    it("should return market status", async () => {
      const params: MarketStatusParams = {
        market: "BTC",
        period: 1,
      };

      expect(await marketService.getStatus(params)).toStrictEqual(
        marketStatusMock
      );
    });
    it("should return null", async () => {
      const params = {
        market: "non existing market",
        last_id: 2,
        limit: 4,
      } as any;

      expect(await marketServiceNulled.getStatus(params)).toStrictEqual(null);
    });
  });
  describe("MarketService.getStatusToday", () => {
    it("should return market status for today", async () => {
      const params: MarketStatusTodayParams = {
        market: "BTC",
      };

      expect(await marketService.getStatusToday(params)).toStrictEqual(
        marketStatusTodayMock
      );
    });
    it("should return null", async () => {
      const params = {
        market: "non existing market",
      } as any;

      expect(await marketServiceNulled.getStatus(params)).toStrictEqual(null);
    });
  });
});
