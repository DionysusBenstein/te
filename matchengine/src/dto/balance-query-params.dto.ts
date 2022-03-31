import { Expose } from 'class-transformer';
import {
  IsInt,
  IsArray,
  IsPositive,
} from 'class-validator';
import { IsEachIn } from '../validators/each-in.validator';
import { getAssetList } from '../utils/config.util';

export class BalanceQueryParams {
  @Expose()
  @IsInt()
  @IsPositive()
  user_id: number;

  @Expose()
  @IsArray()
  @IsEachIn(getAssetList())
  assets: string[];
}
