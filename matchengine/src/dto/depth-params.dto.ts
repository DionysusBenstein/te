import { Expose } from 'class-transformer';
import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsPositive,
  IsIn,
  Max
} from 'class-validator';
import { getMarketList } from '../utils/config.util';

export class DepthParams {  
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(getMarketList())
  market: string;
 
  @Expose()
  @IsInt()
  @IsPositive()
  @Max(10000)
  limit: number;

}
