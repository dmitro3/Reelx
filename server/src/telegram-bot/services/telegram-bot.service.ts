import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { UsersService } from '@/src/users/services/users.service';

@Injectable()
export class TelegramBotService {
  private readonly staticsPath = path.join(process.cwd(), 'libs', 'statics');

  constructor(
    private readonly userService: UsersService
  ) {
    if (!fs.existsSync(this.staticsPath)) {
      fs.mkdirSync(this.staticsPath, { recursive: true });
    }
  }

  getUserData(ctx: Context): { telegramId: number; username?: string } {
    const telegramId = ctx.from?.id;
    const username = ctx.from?.username;

    if (!telegramId) {
      throw new Error('Telegram ID not found in context');
    }

    return {
      telegramId,
      username,
    };
  }

  async getUserPhoto(ctx: Context): Promise<string | null> {
    try {
      const telegramId = ctx.from?.id;
      if (!telegramId) {
        return null;
      }

      const photos = await ctx.telegram.getUserProfilePhotos(telegramId, 0, 1);
      
      if (!photos.photos || photos.photos.length === 0) {
        return null;
      }

      const photo = photos.photos[0];
      if (!photo || photo.length === 0) {
        return null;
      }

      const fileId = photo[photo.length - 1].file_id;
      const file = await ctx.telegram.getFile(fileId);
      
      const filePath = file.file_path;
      if (!filePath) {
        return null;
      }

      const token = process.env.TELEGRAM_BOT_TOKEN;
      if (!token) {
        throw new Error('TELEGRAM_BOT_TOKEN is not set');
      }

      const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
      const fileName = `${telegramId}_${Date.now()}${path.extname(filePath)}`;
      const localFilePath = path.join(this.staticsPath, fileName);

      await this.downloadFile(fileUrl, localFilePath);

      const user = await this.userService.findUserByTelegramId(String(telegramId))

      if(!user)
        await this.userService.createUser(String(telegramId), String(ctx?.from.username), fileName);

      return fileName;
    } catch (error) {
      console.error('Error getting user photo:', error);
      return null;
    }
  }

  private downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      https
        .get(url, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        })
        .on('error', (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
    });
  }

  sendStartMessage(link: string) {
    return {
      text: 'Добро пожаловать!',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Открыть приложение',
              url: link,
            },
          ],
        ],
      },
    };
  }
}
