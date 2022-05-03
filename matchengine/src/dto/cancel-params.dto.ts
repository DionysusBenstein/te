import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsIn
} from 'class-validator';
import { getMarketList } from '../utils/config.util';

export class CancelParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  user_id: string;
  
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(getMarketList())
  market: string;
 
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  order_id: string;

}
