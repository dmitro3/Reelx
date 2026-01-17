import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { validate, parse } from '@telegram-apps/init-data-node';
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

    // Получаем токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new BadRequestException('TELEGRAM_BOT_TOKEN is not set');
    }

    try {
      // Валидируем initData
      validate(initData, botToken);
    } catch (error) {
      throw new UnauthorizedException('Telegram data is invalid');
    }

    // Парсим отвалидированные данные
    const parsedData = parse(initData);

    // Извлекаем данные пользователя
    if (!parsedData.user) {
      throw new BadRequestException('User data not found in initData');
    }

    const { user } = parsedData;

    if (!user.id) {
      throw new BadRequestException('Telegram user ID not found');
    }

    return {
      telegramId: String(user.id),
      username: user.username || '',
      photoUrl: user.photo_url || '',
    };
  }
}

