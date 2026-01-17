import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class GiftsService {
  private readonly logger = new Logger(GiftsService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly nftBuyerUrl: string;

  constructor(private configService: ConfigService) {
    this.nftBuyerUrl = this.configService.get<string>('NFT_BUYER_URL', 'http://localhost:3001');
    
    if (!this.nftBuyerUrl) {
      this.logger.warn('NFT_BUYER_URL not found in environment variables');
    }

    this.axiosInstance = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getGiftsByPrice(body?: { amount?: number }): Promise<any> {
    try {
      const url = `${this.nftBuyerUrl}/api/nft/gifts/by-price`;
      
      this.logger.debug(`Proxying request to ${url} with body: ${JSON.stringify(body)}`);

      const response = await this.axiosInstance.post(url, body || {});

      return response.data;
    } catch (error) {
      this.logger.error(`Error proxying request to NFT buyer: ${error.message}`);
      
      if (error.response) {
        // Если есть ответ от сервера, пробрасываем его статус и данные
        throw new HttpException(
          error.response.data || 'Error from NFT buyer service',
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      
      throw new HttpException(
        'Failed to connect to NFT buyer service',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
