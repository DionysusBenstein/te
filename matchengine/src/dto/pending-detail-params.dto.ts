import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class PendingDetailParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  market: string;
}
