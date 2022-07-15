import { Expose } from 'class-transformer';
import {
    IsInt,
    Min,
    IsPositive,
    IsString,
    IsNotEmpty,
    IsUUID,
} from 'class-validator';

export class OrderDealsParams {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    order_id: string;

    @Expose()
    @IsInt()
    @Min(0)
    offset: number;

    @Expose()
    @IsInt()
    @IsPositive()
    limit: number;
}
