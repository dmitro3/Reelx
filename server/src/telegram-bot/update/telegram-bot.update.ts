import { Injectable } from '@nestjs/common';
import { Update, Command, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramBotService } from '../services/telegram-bot.service';

@Update()
@Injectable()
export class TelegramBotUpdate {
  constructor(private readonly telegramBotService: TelegramBotService) {}

  @Command('start')
  async startCommand(@Ctx() ctx: Context) {
    const userData = this.telegramBotService.getUserData(ctx);
    const photoFileName = await this.telegramBotService.getUserPhoto(ctx);

    console.log('User data:', {
      telegramId: userData.telegramId,
      username: userData.username,
      photoFileName,
    });

    const link = process.env.APP_LINK || 'https://example.com';
    const message = this.telegramBotService.sendStartMessage(link);
    await ctx.reply(message.text, { reply_markup: message.reply_markup });
  }
}

