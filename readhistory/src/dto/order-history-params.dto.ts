import { Expose } from 'class-transformer';
import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsUUID,
  Min,
  IsOptional
} from 'class-validator';

export class OrderHistoryParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  market?: string;

  @Expose()
  @IsInt()
  @Min(0)
  offset: number;

  @Expose()
  @IsPositive()
  @IsInt()
  limit: number;
}

export class OrderHistoryReportParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @Expose()
  @IsString()
  @IsOptional()
  date_start: string;

  @Expose()
  @IsString()
  @IsOptional()
  date_end: string;
}