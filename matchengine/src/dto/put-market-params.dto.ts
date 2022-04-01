import { Expose } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsPositive,
  IsIn,
} from 'class-validator';
import { getMarketList } from '../utils/config.util';
import { OrderSide } from '../types/enums';

export class PutMarketParams {
  @IsInt()
  @Expose()
  @IsPositive()
  user_id: number;

  @Expose()
  @IsEnum(OrderSide)
  side: OrderSide;
 
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(getMarketList())
  market: string;


  @Expose()
  @IsNumber()
  @IsPositive()
  amount: number;

  @Expose()
  @IsNumber()
  @IsPositive()
  taker_fee: number;

  @Expose()
  @IsNumber()
  @IsPositive()
  maker_fee: number;
}
