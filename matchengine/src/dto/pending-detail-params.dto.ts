import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsUUID
} from 'class-validator';
import { getMarketList } from '../utils/config.util';

export class PendingDetailParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  order_id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(getMarketList())
  market: string;
}
