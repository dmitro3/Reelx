import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class BuyNftDto {
  @IsString()
  @IsNotEmpty()
  sale_address: string;

  @IsString()
  @IsOptional()
  price?: string; // Если не указана, будет получена из sale контракта
}

export interface BuyNftResponse {
  success: boolean;
  transaction_hash?: string;
  message?: string;
  error?: string;
}

