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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBotUpdate = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const telegram_bot_service_1 = require("../services/telegram-bot.service");
let TelegramBotUpdate = class TelegramBotUpdate {
    telegramBotService;
    constructor(telegramBotService) {
        this.telegramBotService = telegramBotService;
    }
    async startCommand(ctx) {
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
    async preCheckoutQuery(ctx) {
        const query = ctx.preCheckoutQuery || ctx.update?.pre_checkout_query;
        if (!query) {
            return;
        }
        try {
            await this.telegramBotService.handlePreCheckoutQuery(query.id);
        }
        catch (error) {
            console.error('Error handling pre-checkout query:', error);
        }
    }
    async successfulPayment(ctx) {
        const message = ctx.message || ctx.update?.message;
        if (!message || !('successful_payment' in message)) {
            return;
        }
        const payment = message.successful_payment;
        if (!payment) {
            return;
        }
        try {
            const payload = payment.invoice_payload;
            const parsedPayload = this.telegramBotService.parsePayload(payload);
            if (!parsedPayload) {
                console.error('Failed to parse payment payload:', payload);
                return;
            }
            const amount = payment.total_amount || 0;
            await this.telegramBotService.handleSuccessfulPayment(parsedPayload.userId, amount);
            await ctx.reply(`✅ Платеж успешно обработан! Ваш баланс пополнен на ${amount} звезд.`);
        }
        catch (error) {
            console.error('Error handling successful payment:', error);
            await ctx.reply('❌ Произошла ошибка при обработке платежа. Пожалуйста, обратитесь в поддержку.');
        }
    }
};
exports.TelegramBotUpdate = TelegramBotUpdate;
__decorate([
    (0, nestjs_telegraf_1.Command)('start'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramBotUpdate.prototype, "startCommand", null);
__decorate([
    (0, nestjs_telegraf_1.On)('pre_checkout_query'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramBotUpdate.prototype, "preCheckoutQuery", null);
__decorate([
    (0, nestjs_telegraf_1.On)('successful_payment'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramBotUpdate.prototype, "successfulPayment", null);
exports.TelegramBotUpdate = TelegramBotUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [telegram_bot_service_1.TelegramBotService])
], TelegramBotUpdate);
//# sourceMappingURL=telegram-bot.update.js.map