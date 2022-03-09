import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from "class-validator";

export class BalanceHistoryParams {
  @IsInt()
  user_id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 4)
  asset?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  business?: string;

  @IsInt()
  @Min(0)
  start_time: number;

  @IsInt()
  @Min(0)
  end_time: number;

  @IsInt()
  @Min(0)
  offset: number;

  @IsInt()
  @Min(1)
  limit: number;
}
