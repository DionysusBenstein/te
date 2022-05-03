import { MarketUserDealsParams } from "../../dto/market-user-deals-params.dto";
import { MarketService } from "../../services/market.service";
import { userDealsMock } from "../mocks/market.mocks";
import { createInstance } from "../utils/create-instance.util";

describe("MarketService", () => {
  describe("MarketService.getUserDeals", () => {
    it("should return array of `records`", async () => {
      const marketService = createInstance(MarketService, {
        query: () => ({ rows: userDealsMock }),
      });
      const params: MarketUserDealsParams = {
        user_id: '79A79A10-A7F7-4649-A01C-5F84D802450F',
        market: "some market",
        limit: 1,
        offset: 1,
      };

      expect(await marketService.getUserDeals(params)).toStrictEqual(
        userDealsMock
      );
    });
  });
});
