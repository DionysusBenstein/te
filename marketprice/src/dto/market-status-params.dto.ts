import { Expose } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive, IsString, Max } from "class-validator";

export class MarketStatusParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  market: string;

  @Expose()
  @IsInt()
  @IsPositive()
  period: number;
}
