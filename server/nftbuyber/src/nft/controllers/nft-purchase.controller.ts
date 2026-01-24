import { Controller, Post, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { NftPurchaseService } from '../services/nft-purchase.service';
import { BuyNftDto, BuyNftResponse } from '../dto/buy-nft.dto';
import { TransferNftDto, TransferNftResponse } from '../dto/transfer-nft.dto';
import { SendTonDto, SendTonResponse } from '../dto/send-ton.dto';
import { Address } from 'ton-core';

@Controller('nft/purchase')
export class NftPurchaseController {
  private readonly logger = new Logger(NftPurchaseController.name);

  constructor(private readonly nftPurchaseService: NftPurchaseService) {}

  @Post()
  async buyNft(@Body() buyDto: BuyNftDto): Promise<BuyNftResponse> {
    try {
      // Валидация адреса sale контракта
      try {
        Address.parse(buyDto.sale_address);
      } catch (error) {
        throw new HttpException(
          `Invalid sale contract address format: ${buyDto.sale_address}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Валидация цены, если указана
      if (buyDto.price) {
        try {
          const priceBigInt = BigInt(buyDto.price);
          if (priceBigInt <= 0n) {
            throw new HttpException(
              'Price must be greater than 0',
              HttpStatus.BAD_REQUEST,
            );
          }
        } catch (error) {
          if (error instanceof HttpException) {
            throw error;
          }
          throw new HttpException(
            `Invalid price format: ${buyDto.price}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const result = await this.nftPurchaseService.buyNft(
        buyDto.sale_address,
        buyDto.price,
      );

      if (!result.success) {
        throw new HttpException(
          result.error || 'Failed to buy NFT',
          HttpStatus.BAD_REQUEST,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(`Error buying NFT: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to buy NFT',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('transfer')
  async transferNft(@Body() transferDto: TransferNftDto): Promise<TransferNftResponse> {
    try {
      const result = await this.nftPurchaseService.transferNft(
        transferDto.nft_address,
        transferDto.new_owner_address,
        transferDto.query_id,
      );

      if (!result.success) {
        throw new HttpException(
          result.error || 'Failed to transfer NFT',
          HttpStatus.BAD_REQUEST,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(`Error transferring NFT: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to transfer NFT',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}

