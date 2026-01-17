import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { GetGemsCollectionsResponse, GiftCollection, GetGemsNftsOnSaleResponse } from './interfaces/getgems-response.interface';

@Injectable()
export class GetGemsApiClient {
  private readonly logger = new Logger(GetGemsApiClient.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GETGEMS_API_KEY', '');
    
    if (!this.apiKey) {
      this.logger.warn('GETGEMS_API_KEY not found in environment variables');
    }

    this.axiosInstance = axios.create({
      baseURL: 'https://api.getgems.io/public-api/v1',
      headers: {
        'accept': 'application/json',
        'Authorization': this.apiKey,
      },
      timeout: 30000,
    });
  }

  async getGiftsCollections(cursor?: string): Promise<GetGemsCollectionsResponse> {
    try {
      this.logger.debug(`Fetching gifts collections${cursor ? ` with cursor: ${cursor}` : ''}`);
      
      const response = await this.axiosInstance.get<GetGemsCollectionsResponse>(
        '/gifts/collections'
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        this.logger.error(`GetGems API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        this.logger.error(`Error fetching gifts collections: ${error.message}`);
      }
      throw error;
    }
  }

  async getAllGiftsCollections(): Promise<GiftCollection[]> {
    try {
      const response = await this.getGiftsCollections();
      
      if (response.success && response.response.items) {
        this.logger.log(`Successfully fetched ${response.response.items.length} gift collections`);
        return response.response.items;
      }

      this.logger.warn('GetGems API returned success but no items');
      return [];
    } catch (error) {
      this.logger.error(`Error fetching all gifts collections: ${error.message}`);
      throw error;
    }
  }

  async getNftsOnSale(collectionAddress: string): Promise<GetGemsNftsOnSaleResponse> {
    try {
      this.logger.debug(`Fetching NFTs on sale for collection: ${collectionAddress}`);
      
      const response = await this.axiosInstance.get<GetGemsNftsOnSaleResponse>(
        `/nfts/on-sale/${collectionAddress}`
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        this.logger.error(`GetGems API error for collection ${collectionAddress}: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        this.logger.error(`Error fetching NFTs on sale for ${collectionAddress}: ${error.message}`);
      }
      throw error;
    }
  }
}
