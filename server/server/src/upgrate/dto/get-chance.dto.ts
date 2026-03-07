import { IsArray, IsString, ArrayMinSize, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetChanceDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  toyIds: string[];

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  multiplier: number;
}
