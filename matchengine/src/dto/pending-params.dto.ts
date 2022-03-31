import { Expose } from 'class-transformer';
import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  Min,
  IsIn,
} from 'class-validator';
import { getMarketList } from '../utils/config.util';

export class PendingParams {
  @IsInt()
  @Expose()
  @IsPositive()
  user_id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(getMarketList())
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
