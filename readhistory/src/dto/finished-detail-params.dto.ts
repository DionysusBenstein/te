import { Expose } from "class-transformer";
import { IsInt, IsPositive } from "class-validator";

export class FinishedDetailParams {
  @Expose()
  @IsInt()
  @IsPositive()
  user_id: number;
}
