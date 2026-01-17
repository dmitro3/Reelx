import { Context } from 'telegraf';
import { TelegramBotService } from '../services/telegram-bot.service';
export declare class TelegramBotUpdate {
    private readonly telegramBotService;
    constructor(telegramBotService: TelegramBotService);
    startCommand(ctx: Context): Promise<void>;
    preCheckoutQuery(ctx: Context): Promise<void>;
    successfulPayment(ctx: Context): Promise<void>;
}
