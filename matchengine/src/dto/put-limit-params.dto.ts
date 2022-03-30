import { Expose } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsPositive,
} from 'class-validator';

import { OrderSide } from '../types/enums';

export class PutLimitParams {
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
  market: string;
  
  @Expose()
  @IsNumber()
  @IsPositive()
  price: number;

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
