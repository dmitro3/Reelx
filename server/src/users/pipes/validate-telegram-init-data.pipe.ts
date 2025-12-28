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
  transform(value: any, metadata: ArgumentMetadata): UserLoginInterface {
    // Обрабатываем случай, когда initData приходит как объект { initData: "..." }
    let initData: string;
    if (typeof value === 'string') {
      initData = value;
    } else if (value && typeof value === 'object' && value.initData) {
      initData = value.initData;
    } else {
      throw new BadRequestException('initData must be a string or an object with initData property');
    }

    console.log('Transform received value type:', typeof value);
    console.log('InitData length:', initData.length);

    if (!this.validateInitData(initData)) {
      throw new BadRequestException('Invalid Telegram initData');
    }

    return this.extractUserData(initData);
  }

  private validateInitData(initData: string): boolean {
    try {
      console.log('Received initData:', initData.substring(0, 200) + '...');
      
      // Парсим initData вручную, чтобы сохранить исходные закодированные значения
      // для проверки hash (Telegram требует использовать исходные значения)
      const parts = initData.split('&');
      const paramsMap = new Map<string, string>();
      let hash = '';

      for (const part of parts) {
        const equalIndex = part.indexOf('=');
        if (equalIndex === -1) continue;
        
        const key = part.substring(0, equalIndex);
        const value = part.substring(equalIndex + 1);
        
        if (key === 'hash') {
          hash = value;
        } else if (key !== 'signature') {
          // Игнорируем signature, так как для WebApp используется hash
          paramsMap.set(key, value);
        }
      }

      console.log('Extracted hash:', hash);
      console.log('Params count:', paramsMap.size);

      if (!hash) {
        console.error('Hash not found in initData');
        return false;
      }

      // Сортируем параметры по ключу и создаем строку для проверки
      // Используем исходные закодированные значения
      const sortedEntries = Array.from(paramsMap.entries())
        .sort(([a], [b]) => a.localeCompare(b));
      
      const dataCheckString = sortedEntries
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      
      console.log('Data check string:', dataCheckString.substring(0, 300) + '...');

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
      console.log('Calculated hash:', calculatedHash);
      console.log('Received hash:', hash);
      
      if (calculatedHash !== hash) {
        console.error('Hash mismatch!');
        console.error('Calculated:', calculatedHash);
        console.error('Received:', hash);
        console.error('Data check string length:', dataCheckString.length);
        console.error('Bot token exists:', !!process.env.TELEGRAM_BOT_TOKEN);
        return false;
      }
      
      console.log('Hash validation passed!');

      // Проверяем время (auth_date не должен быть старше 24 часов)
      const authDate = paramsMap.get('auth_date');
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
      console.error('Error in validateInitData:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      return false;
    }
  }

  private extractUserData(initData: string): UserLoginInterface {
    try {
      // Используем URLSearchParams для декодирования значений
      const params = new URLSearchParams(initData);
      const userParam = params.get('user');

      if (!userParam) {
        throw new BadRequestException('User data not found in initData');
      }

      // userParam уже декодирован URLSearchParams, парсим JSON
      const userData = JSON.parse(userParam);

      if (!userData.id) {
        throw new BadRequestException('Telegram user ID not found');
      }

      return {
        telegramId: String(userData.id),
        username: userData.username || '',
        photoUrl: userData.photo_url || '',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to parse user data from initData');
    }
  }
}

