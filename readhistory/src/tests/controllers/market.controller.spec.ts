import { MarketController } from "../../controllers/market.controller";
import { MarketUserDealsParams } from "../../dto/market-user-deals-params.dto";
import { MarketService } from "../../services/market.service";
import { userDealsMock } from "../mocks/market.mocks";

// describe("MarketController", () => {
//   const marketController = new MarketController({
//     getUserDeals: (props) => new Promise((resolve) => resolve(userDealsMock)),
//   } as MarketService);
//   describe("MarketController.user_deals", () => {
//     it("should return `limit`, `offset` and `records`", async () => {
//       const params: MarketUserDealsParams = {
//         user_id: '79A79A10-A7F7-4649-A01C-5F84D802450F',
//         market: "some market",
//         limit: 1,
//         offset: 1,
//       };

//       expect(await marketController.user_deals(params)).toStrictEqual({
//         limit: 1,
//         offset: 1,
//         records: userDealsMock,
//       });
//     });
//     it("should fail, then return `message` and `errors`", async () => {
//       // invalid params will fail and the validation messages will be returned
//       const params = {
//         limit: "sdfsd",
//         offset: "1",
//         user_id: "1",
//         market: "some market",
//       } as any;

//       const result = await marketController.user_deals(params);

//       expect(result).toHaveProperty("errors");
//       expect(result).toHaveProperty("message");
//     });
//   });
// });
