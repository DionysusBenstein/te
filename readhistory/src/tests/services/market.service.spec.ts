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
        limit: 1,
        offset: 1,
        user_id: 1,
        market: "some market",
      };

      expect(await marketService.getUserDeals(params)).toStrictEqual(
        userDealsMock
      );
    });
  });
});
