import { Expose } from 'class-transformer';
import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsPositive,
  IsIn
} from 'class-validator';
import { getMarketList } from '../utils/config.util';

export class CancelParams {
  @Expose()
  @IsInt()
  @IsPositive()
  user_id: number;
  
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(getMarketList())
  market: string;
 
  @Expose()
  @IsString()
  @IsNotEmpty()
  order_id: string;

}
