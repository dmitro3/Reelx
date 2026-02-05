import { IsString, IsNotEmpty } from 'class-validator';

export class BuyNFTDto {
  @IsString()
  @IsNotEmpty()
  nftId: string;
}