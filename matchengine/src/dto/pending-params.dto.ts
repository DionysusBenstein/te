import { Expose } from 'class-transformer';
import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  Min,
  IsIn,
  IsUUID
} from 'class-validator';
import { getMarketList } from '../utils/config.util';

export class PendingParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  user_id: string;

  @Expose()
  @IsString()
  @IsIn(['', ...getMarketList()])
  market: string;

  @Expose()
  @IsInt()
  @Min(0)
  offset: number;

  @Expose()
  @IsPositive()
  @IsInt()
  limit: number;
}
