import { Expose } from 'class-transformer';
import {
  IsUUID,
  IsNumber,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsPositive,
  Min,
  IsIn,
} from 'class-validator';
import { getMarketList } from '../utils/config.util';
import { OrderSide } from '../types/enums';

export class PutMarketParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  user_id: string;

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
  @Min(0)
  taker_fee: number;

  @Expose()
  @IsNumber()
  @Min(0)
  maker_fee: number;
}
