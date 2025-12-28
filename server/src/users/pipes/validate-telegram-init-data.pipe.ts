import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { UserLoginInterface } from '../interface/user-login.interface';

@Injectable()
export class ValidateTelegramInitDataPipe
  implements PipeTransform<string, UserLoginInterface>
{
  transform(value: string, metadata: ArgumentMetadata): UserLoginInterface {
    if (!this.validateInitData(value)) {
      throw new BadRequestException('Invalid Telegram initData');
    }

    return this.extractUserData(value);
  }

  private validateInitData(initData: string): boolean {
    try {
      // Парсим query string
      const params = new URLSearchParams(initData);
      const hash = params.get('hash');

      if (!hash) {
        return false;
      }

      // Удаляем hash из параметров для проверки
      params.delete('hash');

      // Сортируем параметры по ключу и создаем строку для проверки
      const dataCheckString = Array.from(params.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      // Получаем токен бота из переменных окружения
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        throw new Error('TELEGRAM_BOT_TOKEN is not set');
      }

      // Создаем секретный ключ из токена бота
      const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();

      // Вычисляем HMAC-SHA256
      const calculatedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

      // Сравниваем хеши
      if (calculatedHash !== hash) {
        return false;
      }

      // Проверяем время (auth_date не должен быть старше 24 часов)
      const authDate = params.get('auth_date');
      if (authDate) {
        const authTimestamp = parseInt(authDate, 10);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const timeDiff = currentTimestamp - authTimestamp;

        // Проверяем, что данные не старше 24 часов (86400 секунд)
        if (timeDiff > 86400 || timeDiff < 0) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  private extractUserData(initData: string): UserLoginInterface {
    try {
      const params = new URLSearchParams(initData);
      const userParam = params.get('user');

      if (!userParam) {
        throw new BadRequestException('User data not found in initData');
      }

      const userData = JSON.parse(decodeURIComponent(userParam));

      if (!userData.id) {
        throw new BadRequestException('Telegram user ID not found');
      }

      return {
        telegramId: String(userData.id),
        username: userData.username || '',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to parse user data from initData');
    }
  }
}

