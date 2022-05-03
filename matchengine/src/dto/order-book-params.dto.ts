import { Expose } from 'class-transformer';
import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsIn,
  Min,
} from 'class-validator';
import { OrderSide } from '../typings/enums';
import { getMarketList } from '../utils/config.util';

export class OrderBookParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(getMarketList())
  market: string;

  @Expose()
  @IsEnum(OrderSide)
  side: OrderSide;

  @Expose()
  @IsInt()
  @Min(0)
  offset: number;

  @Expose()
  @IsPositive()
  @IsInt()
  limit: number;
}
