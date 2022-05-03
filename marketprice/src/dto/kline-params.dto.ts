import { Expose } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsOptional
} from 'class-validator';
import config from '../config/marketprice.config';

export class KlineParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  market: string;

  @Expose()
  @IsInt()
  @IsPositive()
  @IsOptional()
  start?: number;

  @Expose()
  @IsInt()
  @IsPositive()
  @IsOptional()
  end?: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.keys(config.timeframes))
  interval: number;
}
