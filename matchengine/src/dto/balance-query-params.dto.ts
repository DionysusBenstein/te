import { Expose } from 'class-transformer';
import {
  IsInt,
  IsArray,
  IsPositive,
} from 'class-validator';

export class BalanceQueryParams {
  @Expose()
  @IsInt()
  @IsPositive()
  user_id: number;

  @Expose()
  @IsArray()
  assets: string[];
}
