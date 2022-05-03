import { Expose } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsPositive,
  IsIn,
  IsUUID
} from 'class-validator';
import { getAssetList } from '../utils/config.util';
import { BusinessEnum } from '../typings/enums';

export class UpdateBalanceParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  user_id: string;

  @Expose()
  @IsInt()
  @IsPositive()
  change: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(getAssetList())
  asset: string;

  @Expose()
  @IsEnum(BusinessEnum)
  business: BusinessEnum;

  @Expose()
  @IsString()
  @IsNotEmpty()
  detail: string;
}
