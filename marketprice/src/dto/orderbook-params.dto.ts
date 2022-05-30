import { Expose } from 'class-transformer';
import {
    IsNotEmpty,
    IsString
} from 'class-validator';

export class OrderbookParams {
    @Expose()
    @IsString()
    @IsNotEmpty()
    market: string;
}