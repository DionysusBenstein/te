import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';

export class AssetSummaryParams {
  @Expose()
  @IsArray()
  assets: string[];
}
