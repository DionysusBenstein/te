import { BalanceService } from "../../../services/balance.service";
import { balanceHistoryMock } from "../mocks/balance.mocks";
import { createInstance } from "../utils/create-instance.util";

describe("BalanceService", () => {
  describe("BalanceService.getHistory", () => {
    it("should return array of `records`", async () => {
      const balanceService = createInstance(BalanceService, {
        query: () => {
          console.log(balanceHistoryMock);

          return { rows: balanceHistoryMock };
        },
      }) as BalanceService;

      const params = {
        limit: 1,
        end_time: "2019-09-09",
        start_time: "2021-09-09",
        offset: 1,
        user_id: 1,
      };

      expect(await balanceService.getHistory(params)).toStrictEqual(
        balanceHistoryMock
      );
    });
  });
});
