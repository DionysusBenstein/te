import { Expose } from 'class-transformer';
import {
  IsArray,
  IsUUID,
  IsString,
  IsNotEmpty
} from 'class-validator';
import { IsEachIn } from '../validators/each-in.validator';
import { getAssetList } from '../utils/config.util';

export class BalanceQueryParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  user_id: string;

  @Expose()
  @IsArray()
  @IsEachIn(getAssetList())
  assets: string[];
}
