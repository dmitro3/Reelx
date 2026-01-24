import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { IsTonAddress } from './validators/is-ton-address.validator';
import { IsNonNegativeBigInt } from './validators/is-non-negative-bigint.validator';

export class TransferNftDto {
  @IsString()
  @IsNotEmpty()
  @IsTonAddress()
  nft_address: string;

  @IsString()
  @IsNotEmpty()
  @IsTonAddress()
  new_owner_address: string;

  @IsString()
  @IsOptional()
  @IsNonNegativeBigInt()
  query_id?: string; // Опциональный query_id для идентификации запроса

  @IsString()
  @IsOptional()
  @IsNonNegativeBigInt()
  forward_amount?: string; // Опциональная сумма для форварда сообщений (в nanotons)
}

export interface TransferNftResponse {
  success: boolean;
  transaction_hash?: string;
  message?: string;
  error?: string;
}
