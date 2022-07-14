import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, } from "class-validator";

export class MarketStatusTodayParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  market: string;
}
