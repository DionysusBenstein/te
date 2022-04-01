import { Expose } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive, IsString, Max } from "class-validator";

export class MarketDealsParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  market: string;

  @Expose()
  @IsInt()
  @IsPositive()
  @Max(10000)
  limit: number;
  
  @Expose()
  @IsInt()
  @IsPositive()
  last_id: number;
}
