import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../users/repositorys/user.repository';

@Injectable()
export class WithdrawGiftsService {
  constructor(private readonly userRepository: UserRepository) {}

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
}

