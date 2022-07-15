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
import { ContainsStockAndMoney } from '../validators/contains-stock-and-money.validator';
import { getMarketList, getAssetList } from '../utils/config.util';
import { OrderSide } from '../typings/enums';

export class PutMarketParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  exchange_id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  exchange_name: string;
  
  @Expose()
  @IsEnum(OrderSide)
  side: OrderSide;
 
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(getMarketList())
  @ContainsStockAndMoney('stock', 'money')
  market: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(getAssetList())
  stock: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(getAssetList())
  money: string;

  @Expose()
  @IsNumber()
  @IsPositive()
  amount: number;

  @Expose()
  @IsNumber()
  @Min(0)
  total_fee: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  create_time?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  update_time?: string;
}
