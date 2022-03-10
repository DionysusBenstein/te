import { Expose, Transform } from "class-transformer";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsPositive,
  Validate,
  IsEnum,
} from "class-validator";
import { IsZeroOrDateValidation } from "../shared/decorators/is-zero-or-date.decorator";
import { SideEnum } from "../typings/enums/side.enum";
import { tranformZeroOrDate } from "../utils/date-tranformer.util";

export class OrderFinishedParams {
  @Expose()
  @IsInt()
  @IsPositive()
  user_id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  market: string;

  @Expose()
  @IsEnum(SideEnum)
  side: SideEnum;

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
