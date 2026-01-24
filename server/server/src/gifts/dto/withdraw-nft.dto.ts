import { IsString, IsNotEmpty } from 'class-validator';

export class WithdrawNftDto {
  @IsString()
  @IsNotEmpty()
  giftId: string;

  @IsString()
  @IsNotEmpty()
  walletAddress: string;
}

export interface WithdrawNftResponse {
  success: boolean;
  transactionHash?: string;
  message?: string;
  error?: string;
}
