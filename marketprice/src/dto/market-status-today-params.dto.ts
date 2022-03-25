import { Expose } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive, IsString, Max } from "class-validator";

export class MarketStatusTodayParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  market: string;
}
