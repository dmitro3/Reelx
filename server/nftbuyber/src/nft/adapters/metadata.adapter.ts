import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { NftMetadataDto } from '../dto/nft-response.dto';

@Injectable()
export class MetadataAdapter {
  private readonly logger = new Logger(MetadataAdapter.name);
  private readonly http: AxiosInstance;
  private readonly ipfsGateways = [
    'https://ipfs.io/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
  ];

  constructor() {
    this.http = axios.create({
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
      },
    });
  }

  async fetchMetadata(contentUrl: string): Promise<NftMetadataDto | null> {
    try {
      const url = this.normalizeUrl(contentUrl);
      const response = await this.http.get(url);
      return response.data;
    } catch (error) {
      this.logger.warn(`Failed to fetch metadata from ${contentUrl}: ${error.message}`);
      return null;
    }
  }

  extractImageUrl(metadata: NftMetadataDto | null): string | null {
    if (!metadata) {
      return null;
    }

    // Пробуем разные варианты полей для изображения
    if (metadata.image) {
      return typeof metadata.image === 'string' ? metadata.image : null;
    }
    if (metadata.image_url) {
      return typeof metadata.image_url === 'string' ? metadata.image_url : null;
    }
    if (metadata.imageUrl) {
      return typeof metadata.imageUrl === 'string' ? metadata.imageUrl : null;
    }

    return null;
  }

  normalizeImageUrl(imageUrl: string): string {
    return this.normalizeUrl(imageUrl);
  }

  private normalizeUrl(url: string): string {
    const trimmed = url.trim();

    // Если это IPFS ссылка, преобразуем в HTTPS
    if (trimmed.startsWith('ipfs://')) {
      const ipfsHash = trimmed.replace('ipfs://', '');
      // Используем первый доступный gateway
      return `${this.ipfsGateways[0]}${ipfsHash}`;
    }

    // Если это IPFS CID без префикса
    if (trimmed.match(/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/) || trimmed.match(/^baf[A-Za-z0-9]{56}$/)) {
      return `${this.ipfsGateways[0]}${trimmed}`;
    }

    // Возвращаем как есть для HTTPS
    return trimmed;
  }
}

