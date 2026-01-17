"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBotService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const fs = require("fs");
const path = require("path");
const https = require("https");
const users_service_1 = require("@/src/users/services/users.service");
let TelegramBotService = class TelegramBotService {
    bot;
    userService;
    staticsPath = path.join(process.cwd(), 'libs', 'statics');
    constructor(bot, userService) {
        this.bot = bot;
        this.userService = userService;
        if (!fs.existsSync(this.staticsPath)) {
            fs.mkdirSync(this.staticsPath, { recursive: true });
        }
    }
    getUserData(ctx) {
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
    async getUserPhoto(ctx) {
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
            const user = await this.userService.findUserByTelegramId(String(telegramId));
            if (!user)
                await this.userService.createUser(String(telegramId), String(ctx?.from.username), fileName);
            return fileName;
        }
        catch (error) {
            console.error('Error getting user photo:', error);
            return null;
        }
    }
    downloadFile(url, dest) {
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
                fs.unlink(dest, () => { });
                reject(err);
            });
        });
    }
    sendStartMessage(link) {
        return {
            text: 'Добро пожаловать!',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Открыть приложение',
                            web_app: { url: link },
                        },
                    ],
                ],
            },
        };
    }
    async createInvoiceLink(starsAmount, payload) {
        try {
            const invoiceLink = await this.bot.telegram.createInvoiceLink({
                title: 'Пополнение баланса',
                description: `Пополнение баланса на ${starsAmount} звезд`,
                payload: payload || `stars_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                provider_token: '',
                currency: 'XTR',
                prices: [
                    {
                        label: `${starsAmount} звезд`,
                        amount: starsAmount,
                    },
                ],
            });
            return invoiceLink;
        }
        catch (error) {
            console.error('Error creating invoice link:', error);
            throw new Error('Failed to create invoice link');
        }
    }
    async handlePreCheckoutQuery(queryId) {
        try {
            await this.bot.telegram.answerPreCheckoutQuery(queryId, true);
        }
        catch (error) {
            console.error('Error answering pre-checkout query:', error);
            try {
                await this.bot.telegram.answerPreCheckoutQuery(queryId, false, 'Произошла ошибка при обработке платежа');
            }
            catch (err) {
                console.error('Error sending error response:', err);
            }
        }
    }
    async handleSuccessfulPayment(userId, amount) {
        try {
            await this.userService.updateStarsBalance(userId, amount);
        }
        catch (error) {
            console.error('Error updating user balance:', error);
            throw error;
        }
    }
    parsePayload(payload) {
        try {
            const parts = payload.split('_');
            if (parts.length >= 2 && parts[0] === 'payment') {
                return { userId: parts[1] };
            }
            return null;
        }
        catch (error) {
            console.error('Error parsing payload:', error);
            return null;
        }
    }
};
exports.TelegramBotService = TelegramBotService;
exports.TelegramBotService = TelegramBotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [telegraf_1.Telegraf, typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], TelegramBotService);
//# sourceMappingURL=telegram-bot.service.js.map