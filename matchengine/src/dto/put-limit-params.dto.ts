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
import { OrderSide } from '../typings/enums';

export class PutLimitParams {
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
  price: number;

  @Expose()
  @IsNumber()
  @IsPositive()
  amount: number;

  @Expose()
  @IsNumber()
  @Min(0)
  total_fee: number;
}
