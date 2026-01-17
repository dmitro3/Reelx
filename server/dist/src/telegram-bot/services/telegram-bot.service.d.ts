import { Context } from 'telegraf';
import { Telegraf } from 'telegraf';
import { UsersService } from '@/src/users/services/users.service';
export declare class TelegramBotService {
    private readonly bot;
    private readonly userService;
    private readonly staticsPath;
    constructor(bot: Telegraf, userService: UsersService);
    getUserData(ctx: Context): {
        telegramId: number;
        username?: string;
    };
    getUserPhoto(ctx: Context): Promise<string | null>;
    private downloadFile;
    sendStartMessage(link: string): {
        text: string;
        reply_markup: {
            inline_keyboard: {
                text: string;
                web_app: {
                    url: string;
                };
            }[][];
        };
    };
    createInvoiceLink(starsAmount: number, payload?: string): Promise<string>;
    handlePreCheckoutQuery(queryId: string): Promise<void>;
    handleSuccessfulPayment(userId: string, amount: number): Promise<void>;
    parsePayload(payload: string): {
        userId: string;
    } | null;
}
