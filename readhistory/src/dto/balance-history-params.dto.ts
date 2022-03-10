import { Expose, Transform } from "class-transformer";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
  IsPositive,
  Validate,
} from "class-validator";
import { IsZeroOrDateValidation } from "../shared/decorators/is-zero-or-date.decorator";
import { tranformZeroOrDate } from "../utils/date-tranformer.util";

export class BalanceHistoryParams {
  @IsInt()
  @Expose()
  @IsPositive()
  user_id: number;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 4)
  asset?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  business?: string;

  @Expose()
  @Validate(IsZeroOrDateValidation)
  @Transform(tranformZeroOrDate)
  start_time: string;

  @Expose()
  @Validate(IsZeroOrDateValidation)
  @Transform(tranformZeroOrDate)
  end_time: string;

  @Expose()
  @IsInt()
  @Min(0)
  offset: number;

  @Expose()
  @IsPositive()
  @IsInt()
  limit: number;
}
