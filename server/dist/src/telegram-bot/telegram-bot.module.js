"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBotModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegram_bot_service_1 = require("./services/telegram-bot.service");
const telegram_bot_update_1 = require("./update/telegram-bot.update");
const users_module_1 = require("../users/users.module");
let TelegramBotModule = class TelegramBotModule {
};
exports.TelegramBotModule = TelegramBotModule;
exports.TelegramBotModule = TelegramBotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                useFactory: () => {
                    const token = process.env.TELEGRAM_BOT_TOKEN;
                    if (!token) {
                        throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
                    }
                    return {
                        token,
                    };
                },
            }),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule)
        ],
        providers: [telegram_bot_service_1.TelegramBotService, telegram_bot_update_1.TelegramBotUpdate],
        exports: [telegram_bot_service_1.TelegramBotService],
    })
], TelegramBotModule);
//# sourceMappingURL=telegram-bot.module.js.map