import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { MarketplaceNftResponse } from '../interfaces/marketplace-response.interface';

@Injectable()
export class MarketplaceAdapter {
  private readonly logger = new Logger(MarketplaceAdapter.name);
  private readonly api: AxiosInstance;
  private readonly baseUrl = 'https://api.marketapp.ws/v1';
  private readonly apiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('MARKETPLACE_API_KEY');
    
    const headers: Record<string, string> = {};
    
    // Если есть API ключ, добавляем его в заголовки
    if (this.apiKey) {
      this.logger.debug('Marketplace API key loaded');
      headers['Authorization'] = `${this.apiKey}`;
      headers['X-API-Key'] = this.apiKey;
    } else {
      this.logger.warn('Marketplace API key not found in environment variables');
    }

    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers,
    });
  }

  async getNftData(nftAddress: string): Promise<MarketplaceNftResponse | null> {
    try {
      // Пробуем разные варианты формата запроса
      let response;
      
      // Вариант 1: с trailing slash
      try {
        response = await this.api.get(`/nfts/${nftAddress}/`, {
          headers: this.apiKey ? {
            'Authorization': `Bearer ${this.apiKey}`,
            'X-API-Key': this.apiKey,
          } : {},
        });
        
     
        return response.data;
      } catch (e) {
        // Если 404, пробуем без слэша
        if (e.response?.status === 404) {
          try {
            response = await this.api.get(`/nfts/${nftAddress}`, {
              headers: this.apiKey ? {
                'Authorization': `Bearer ${this.apiKey}`,
                'X-API-Key': this.apiKey,
              } : {},
            });
            
            if (response.data) {
              this.logger.debug(`Marketplace API response (no slash) for ${nftAddress}: ${JSON.stringify(response.data)}`);
            }
            
            return response.data;
          } catch (e2) {
            // Если всё равно ошибка, логируем и пробуем только с X-API-Key
            if (e2.response?.status === 401 && this.apiKey) {
              try {
                response = await this.api.get(`/nfts/${nftAddress}`, {
                  headers: {
                    'X-API-Key': this.apiKey,
                  },
                });
                
                if (response.data) {
                  this.logger.debug(`Marketplace API response (X-API-Key only) for ${nftAddress}: ${JSON.stringify(response.data)}`);
                }
                
                return response.data;
              } catch (e3) {
                throw e3;
              }
            }
            throw e2;
          }
        } else if (e.response?.status === 401 && this.apiKey) {
          // Если 401, пробуем только с X-API-Key без Bearer
          try {
            response = await this.api.get(`/nfts/${nftAddress}/`, {
              headers: {
                'X-API-Key': this.apiKey,
              },
            });
            
            if (response.data) {
              this.logger.debug(`Marketplace API response (X-API-Key, slash) for ${nftAddress}: ${JSON.stringify(response.data)}`);
            }
            
            return response.data;
          } catch (e3) {
            throw e;
          }
        } else {
          throw e;
        }
      }
    } catch (error) {
      // Логируем детали ошибки для отладки
      if (error.response?.status === 401) {
        this.logger.warn(`Marketplace API authentication failed for NFT ${nftAddress}. Status: ${error.response.status}, API Key present: ${!!this.apiKey}`);
        if (error.response.data) {
          this.logger.debug(`Marketplace API error response: ${JSON.stringify(error.response.data)}`);
        }
      } else {
        this.logger.warn(`Failed to fetch marketplace data for NFT ${nftAddress}: ${error.message}`);
        if (error.response) {
          this.logger.debug(`Marketplace API response status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        }
      }
      return null;
    }
  }
}

