import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';
import { IsEachIn } from '../validators/each-in.validator';
import { getAssetList } from '../utils/config.util';

export class AssetSummaryParams {
  @Expose()
  @IsArray()
  @IsEachIn(getAssetList())
  assets: string[];
}
