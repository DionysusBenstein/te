import { Expose } from 'class-transformer';
import {
  IsInt,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsUUID,
  IsIn,
  Min,
  IsOptional
} from 'class-validator';

export class OrderHistoryParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  user_id: string;

  @Expose()
  @IsOptional()
  @IsString()
  market: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  offset: number;

  @Expose()
  @IsOptional()
  @IsPositive()
  @IsInt()
  limit: number;
}

export class OrderHistoryReportParams {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
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