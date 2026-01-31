import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  TonApiNftDetailsResponse,
  TonApiAccountNftsResponse,
} from './tonapi-response.interface';

@Injectable()
export class TonApiClient {
  private readonly logger = new Logger(TonApiClient.name);
  private readonly api: AxiosInstance;
  private readonly apiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TONAPI_IO_KEY');
    this.api = axios.create({
      baseURL: 'https://tonapi.io',
      timeout: 15000,
      headers: {
        Accept: 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
    });
    if (!this.apiKey) {
      this.logger.warn('TONAPI_IO_KEY not set; using public rate limits');
    }
  }

  /**
   * GET /v2/nfts/{address} — детали NFT, включая sale (маркетплейс).
   */
  async getNftByAddress(address: string): Promise<TonApiNftDetailsResponse | null> {
    try {
      const { data } = await this.api.get<TonApiNftDetailsResponse>(`/v2/nfts/${address}`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      this.logger.warn(`TonApi getNftByAddress ${address}: ${error.response?.status ?? error.message}`);
      throw error;
    }
  }

  /**
   * GET /v2/accounts/{address}/nfts — список NFT предметов аккаунта.
   */
  async getAccountNfts(accountAddress: string): Promise<TonApiNftDetailsResponse[]> {
    try {
      const { data } = await this.api.get<TonApiAccountNftsResponse>(
        `/v2/accounts/${accountAddress}/nfts`,
      );
      const items = data?.nft_items ?? [];
      return items as TonApiNftDetailsResponse[];
    } catch (error: any) {
      this.logger.warn(
        `TonApi getAccountNfts ${accountAddress}: ${error.response?.status ?? error.message}`,
      );
      throw error;
    }
  }
}
