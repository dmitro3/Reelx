"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateTelegramInitDataPipe = void 0;
const common_1 = require("@nestjs/common");
const init_data_node_1 = require("@telegram-apps/init-data-node");
let ValidateTelegramInitDataPipe = class ValidateTelegramInitDataPipe {
    transform(value, metadata) {
        let initData;
        if (typeof value === 'string') {
            initData = value;
        }
        else if (value && typeof value === 'object' && value.initData) {
            initData = value.initData;
        }
        else {
            throw new common_1.BadRequestException('initData must be a string or an object with initData property');
        }
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            throw new common_1.BadRequestException('TELEGRAM_BOT_TOKEN is not set');
        }
        try {
            (0, init_data_node_1.validate)(initData, botToken);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Telegram data is invalid');
        }
        const parsedData = (0, init_data_node_1.parse)(initData);
        if (!parsedData.user) {
            throw new common_1.BadRequestException('User data not found in initData');
        }
        const { user } = parsedData;
        if (!user.id) {
            throw new common_1.BadRequestException('Telegram user ID not found');
        }
        return {
            telegramId: String(user.id),
            username: user.username || '',
            photoUrl: user.photo_url || '',
        };
    }
};
exports.ValidateTelegramInitDataPipe = ValidateTelegramInitDataPipe;
exports.ValidateTelegramInitDataPipe = ValidateTelegramInitDataPipe = __decorate([
    (0, common_1.Injectable)()
], ValidateTelegramInitDataPipe);
//# sourceMappingURL=validate-telegram-init-data.pipe.js.map