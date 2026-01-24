import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserRepository } from '../users/repositorys/user.repository';
import { WithdrawNftResponse } from './dto/withdraw-nft.dto';

@Injectable()
export class WithdrawGiftsService {
  private readonly logger = new Logger(WithdrawGiftsService.name);
  private readonly nftBuyerUrl: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    this.nftBuyerUrl = this.configService.get<string>('NFT_BUYER_URL', 'http://localhost:3001');
  }

  /**
   * Отмечает подарки пользователя как выведенные (isOut = true)
   */
  async withdrawUserGifts(userId: string, giftIds: string[]) {
    if (!giftIds || giftIds.length === 0) {
      throw new BadRequestException('Список подарков пуст');
    }

    const result = await this.userRepository.markUserGiftsAsOut(userId, giftIds);

    if (!result.count || result.count === 0) {
      throw new BadRequestException('Подарки не найдены или уже выведены');
    }

    return {
      success: true,
      updatedCount: result.count,
    };
  }

  /**
   * Выводит NFT на кошелек пользователя
   */
  async withdrawNftToWallet(
    userId: string,
    giftId: string,
    walletAddress: string,
  ): Promise<WithdrawNftResponse> {
    // 1. Получаем подарок пользователя
    const userGift = await this.userRepository.findUserGiftById(userId, giftId);

    if (!userGift) {
      throw new BadRequestException('Подарок не найден');
    }

    if (userGift.isOut) {
      throw new BadRequestException('Подарок уже выведен');
    }

    if (!userGift.giftAddress) {
      throw new BadRequestException('У подарка нет NFT адреса');
    }

    this.logger.log(`Withdrawing NFT ${userGift.giftAddress} to wallet ${walletAddress}`);

    try {
      // 2. Вызываем nftbuyber API для трансфера
      const url = `${this.nftBuyerUrl}/api/nft/purchase/transfer`;
      const response = await axios.post<WithdrawNftResponse>(url, {
        nft_address: userGift.giftAddress,
        new_owner_address: walletAddress,
      });

      if (!response.data.success) {
        this.logger.error(`NFT transfer failed: ${response.data.error}`);
        throw new BadRequestException(response.data.error || 'Ошибка при выводе NFT');
      }

      // 3. Помечаем подарок как выведенный
      await this.userRepository.markUserGiftsAsOut(userId, [giftId]);

      this.logger.log(`NFT ${userGift.giftAddress} successfully transferred to ${walletAddress}`);

      return {
        success: true,
        transactionHash: response.data.transactionHash,
        message: 'NFT успешно выведен на кошелек',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(`Error withdrawing NFT: ${error.message}`);
      throw new BadRequestException(
        error.response?.data?.message || 'Ошибка при выводе NFT',
      );
    }
  }
}

