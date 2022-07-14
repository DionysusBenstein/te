import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Expose } from "class-transformer";

export class MarketSummaryParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  market?: string;
}
