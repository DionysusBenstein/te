import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from "class-transformer";

export class MarketLastParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  market: string;
}
