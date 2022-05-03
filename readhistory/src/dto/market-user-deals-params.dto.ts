import { Expose } from 'class-transformer';
import {
    IsInt,
    Min,
    IsPositive,
    IsString,
    IsNotEmpty,
    IsUUID
} from 'class-validator';
export class MarketUserDealsParams {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @IsUUID('4')
    user_id: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    market: string;

    @Expose()
    @IsInt()
    @Min(0)
    offset: number;

    @Expose()
    @IsInt()
    @IsPositive()
    limit: number;
}
