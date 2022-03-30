import { Expose } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsPositive,
} from 'class-validator';

import { BusinessEnum } from '../types/enums';

export class UpdateBalanceParams {
  @IsInt()
  @Expose()
  @IsPositive()
  user_id: number;

  @Expose()
  @IsInt()
  @IsPositive()
  balance: number;

  @Expose()
  @IsInt()
  @IsPositive()
  change: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  asset: string;

  @Expose()
  @IsEnum(BusinessEnum)
  business: BusinessEnum;

  @Expose()
  @IsString()
  @IsNotEmpty()
  detail: string;
}
