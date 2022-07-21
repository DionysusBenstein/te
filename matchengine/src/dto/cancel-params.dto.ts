import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsIn,
  IsEnum
} from 'class-validator';
import { getMarketList } from '../utils/config.util';
import { OrderSide } from '../typings/enums';

export class CancelParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;
  
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(getMarketList())
  market: string;
 
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  order_id: string;
  
  @Expose()
  @IsEnum(OrderSide)
  side: OrderSide;
}
