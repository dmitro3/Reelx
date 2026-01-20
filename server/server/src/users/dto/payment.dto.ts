import { IsIn, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentDto {
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsIn(['stars'])
    type: 'stars';
}