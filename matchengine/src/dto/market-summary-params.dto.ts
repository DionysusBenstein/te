import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';

export class MarketSummaryParams {
  @Expose()
  @IsArray()
  markets: string[];
}
