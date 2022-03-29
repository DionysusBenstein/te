import { BalanceController } from "../../controllers/balance.controller";
import { BalanceService } from "../../services/balance.service";
import { balanceHistoryMock } from "../mocks/balance.mocks";
describe("BalanceController", () => {
  const balanceController = new BalanceController({
    getHistory: (props) =>
      new Promise((resolve) => resolve(balanceHistoryMock)),
  } as BalanceService);
  describe("BalanceController.history", () => {
    it("should return `limit`, `offset` and `records`", async () => {
      const params = {
        limit: 1,
        end_time: "2019-09-09",
        start_time: "2021-09-09",
        offset: 1,
        user_id: 1,
      };

      expect(await balanceController.history(params)).toStrictEqual({
        limit: 1,
        offset: 1,
        records: balanceHistoryMock,
      });
    });
    it("should fail, then return `message` and `errors`", async () => {
      // invalid params will fail and the validation messages will be returned
      const params = {
        limit: "sdfsd",
        end_time: "alskdkasd",
        start_time: "dasfasodkm",
        offset: "1",
        user_id: "1",
      } as any;
      const result = await balanceController.history(params);

      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("message");
    });
  });
});
