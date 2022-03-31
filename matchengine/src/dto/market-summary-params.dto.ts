import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';
import { IsEachIn } from '../validators/each-in.validator';
import { getMarketList } from '../utils/config.util';

export class MarketSummaryParams {
  @Expose()
  @IsArray()
  @IsEachIn(getMarketList())
  markets: string[];
}
