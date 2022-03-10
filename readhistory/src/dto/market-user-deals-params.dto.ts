import { Expose } from "class-transformer";
import { IsInt, Min, IsPositive, IsString, IsNotEmpty } from "class-validator";

export class MarketUserDealsParams {
  @Expose()
  @IsInt()
  @IsPositive()
  user_id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  market: string;

  @Expose()
  @IsInt()
  @Min(0)
  offset: number;

  @Expose()
  @IsInt()
  @IsPositive()
  limit: number;
}
