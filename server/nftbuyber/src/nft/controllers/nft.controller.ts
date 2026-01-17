import { Controller, Get, Post, Param, Body, Query, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { NftService } from '../services/nft.service';
import { NftResponseDto } from '../dto/nft-response.dto';
import { GetGiftsByPriceDto, GetGiftsByPriceResponse } from '../dto/get-gifts-by-price.dto';
import { GiftsSyncService } from '../../infrastructure/getgems/gifts-sync.service';
import { NftsSyncService } from '../../infrastructure/getgems/nfts-sync.service';
import { Address } from '@ton/core';

@Controller('nft')
export class NftController {
  private readonly logger = new Logger(NftController.name);

  constructor(
    private readonly nftService: NftService,
    private readonly giftsSyncService: GiftsSyncService,
    private readonly nftsSyncService: NftsSyncService,
  ) {}

  @Get(':address')
  async getNftData(@Param('address') address: string): Promise<NftResponseDto> {
    try {
      // Валидация адреса TON
      try {
        Address.parse(address);
      } catch (error) {
        throw new HttpException(
          `Invalid TON address format: ${address}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const nftData = await this.nftService.getNftData(address);
      return nftData;
    } catch (error) {
      this.logger.error(`Error fetching NFT data for ${address}: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to fetch NFT data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('gifts/by-price')
  async getGiftsByPrice(@Body() dto: GetGiftsByPriceDto): Promise<GetGiftsByPriceResponse> {
    try {
      if (dto.amount === undefined || dto.amount === null) {
        this.logger.log('Fetching all gifts (no price filter)');
      } else {
        this.logger.log(`Fetching gifts with price: ${dto.amount} TON (±20%)`);
      }
      
      const result = await this.nftService.getGiftsByPrice(dto.amount);
      return result;
    } catch (error) {
      this.logger.error(`Error fetching gifts by price: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to fetch gifts by price',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('gifts/collections')
  async getAllGiftCollections() {
    try {
      const collections = await this.giftsSyncService.getAllCollections();
      return {
        success: true,
        count: collections.length,
        collections,
      };
    } catch (error) {
      this.logger.error(`Error fetching gift collections: ${error.message}`);
      throw new HttpException(
        'Failed to fetch gift collections',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('gifts/collections/:address')
  async getGiftCollectionByAddress(@Param('address') address: string) {
    try {
      const collection = await this.giftsSyncService.getCollectionByAddress(address);
      
      if (!collection) {
        throw new HttpException(
          `Collection with address ${address} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        collection,
      };
    } catch (error) {
      this.logger.error(`Error fetching collection ${address}: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to fetch gift collection',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('gifts/sync-info')
  async getSyncInfo() {
    try {
      const info = await this.giftsSyncService.getCacheInfo();
      return {
        success: true,
        ...info,
      };
    } catch (error) {
      this.logger.error(`Error fetching sync info: ${error.message}`);
      throw new HttpException(
        'Failed to fetch sync info',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('gifts/sync-now')
  async syncNow() {
    try {
      await this.giftsSyncService.syncCollections();
      return {
        success: true,
        message: 'Synchronization completed successfully',
      };
    } catch (error) {
      this.logger.error(`Error triggering sync: ${error.message}`);
      throw new HttpException(
        'Failed to trigger synchronization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // NFTs on sale endpoints

  @Get('gifts/nfts/cheapest')
  async getCheapestNfts(@Query('limit') limit?: string) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const nfts = await this.nftsSyncService.getCheapestNfts(limitNum);
      
      return {
        success: true,
        count: nfts.length,
        nfts,
      };
    } catch (error) {
      this.logger.error(`Error fetching cheapest NFTs: ${error.message}`);
      throw new HttpException(
        'Failed to fetch cheapest NFTs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('gifts/nfts/by-price-range')
  async getNftsByPriceRange(
    @Query('min') min: string,
    @Query('max') max: string,
  ) {
    try {
      const minPrice = parseFloat(min);
      const maxPrice = parseFloat(max);

      if (isNaN(minPrice) || isNaN(maxPrice)) {
        throw new HttpException(
          'Invalid price range parameters',
          HttpStatus.BAD_REQUEST,
        );
      }

      const nfts = await this.nftsSyncService.getNftsByPriceRange(minPrice, maxPrice);
      
      return {
        success: true,
        minPrice,
        maxPrice,
        count: nfts.length,
        nfts,
      };
    } catch (error) {
      this.logger.error(`Error fetching NFTs by price range: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to fetch NFTs by price range',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('gifts/nfts/:address')
  async getNftByAddress(@Param('address') address: string) {
    try {
      const nft = await this.nftsSyncService.getNftByAddress(address);
      
      if (!nft) {
        throw new HttpException(
          `NFT with address ${address} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        nft,
      };
    } catch (error) {
      this.logger.error(`Error fetching NFT ${address}: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to fetch NFT',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('gifts/nfts-sync-info')
  async getNftsSyncInfo() {
    try {
      const info = await this.nftsSyncService.getSyncInfo();
      return {
        success: true,
        ...info,
      };
    } catch (error) {
      this.logger.error(`Error fetching NFTs sync info: ${error.message}`);
      throw new HttpException(
        'Failed to fetch NFTs sync info',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('gifts/nfts-sync-now')
  async syncNftsNow() {
    try {
      await this.nftsSyncService.syncAllNfts();
      return {
        success: true,
        message: 'NFTs synchronization completed successfully',
      };
    } catch (error) {
      this.logger.error(`Error triggering NFTs sync: ${error.message}`);
      throw new HttpException(
        'Failed to trigger NFTs synchronization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

