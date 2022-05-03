import { Expose } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive, IsString, Max, Min } from "class-validator";

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
  @Min(0)
  offset: number;
}
