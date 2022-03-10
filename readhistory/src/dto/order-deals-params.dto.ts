import { Expose } from "class-transformer";
import { IsInt, Min, IsPositive } from "class-validator";

export class OrderDealsParams {
  @Expose()
  @IsInt()
  @IsPositive()
  order_id: number;

  @Expose()
  @IsInt()
  @Min(0)
  offset: number;

  @Expose()
  @IsInt()
  @IsPositive()
  limit: number;
}
