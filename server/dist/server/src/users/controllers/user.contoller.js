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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const change_username_dto_1 = require("../dto/change-username.dto");
const users_service_1 = require("../services/users.service");
const jwt_auth_guard_guard_1 = require("../../../libs/common/guard/jwt-auth.guard.guard");
const current_user_decorator_1 = require("../../../libs/common/decorators/current-user.decorator");
const payment_dto_1 = require("../dto/payment.dto");
const telegram_bot_service_1 = require("../../telegram-bot/services/telegram-bot.service");
let UserController = class UserController {
    userService;
    telegramBotService;
    staticsPath = path.join(process.cwd(), 'libs', 'statics');
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    constructor(userService, telegramBotService) {
        this.userService = userService;
        this.telegramBotService = telegramBotService;
    }
    async getPhoto(filename, res) {
        if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
            throw new common_1.BadRequestException('Invalid filename');
        }
        const ext = path.extname(filename).toLowerCase();
        if (!this.allowedExtensions.includes(ext)) {
            throw new common_1.BadRequestException('Invalid file extension');
        }
        const filePath = path.join(this.staticsPath, filename);
        const normalizedPath = path.normalize(filePath);
        const normalizedStaticsPath = path.normalize(this.staticsPath);
        if (!normalizedPath.startsWith(normalizedStaticsPath)) {
            throw new common_1.BadRequestException('Invalid file path');
        }
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException('File not found');
        }
        const stats = fs.statSync(filePath);
        if (!stats.isFile()) {
            throw new common_1.BadRequestException('Path is not a file');
        }
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
        };
        const mimeType = mimeTypes[ext] || 'application/octet-stream';
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }
    async changeUsername(userId, changeUsernameDto) {
        return this.userService.changeUsername(userId, changeUsernameDto);
    }
    async payment(userId, paymentDto) {
        if (paymentDto.type !== 'stars') {
            throw new common_1.BadRequestException('Only stars payment type is supported');
        }
        if (!paymentDto.amount || paymentDto.amount <= 0) {
            throw new common_1.BadRequestException('Amount must be greater than 0');
        }
        const payload = `payment_${userId}_${Date.now()}`;
        const invoiceLink = await this.telegramBotService.createInvoiceLink(paymentDto.amount, payload);
        return {
            invoiceLink,
            amount: paymentDto.amount,
            type: paymentDto.type,
        };
    }
    async getBalance(userId) {
        return this.userService.getBalance(userId);
    }
    async getTransactions(userId) {
        return this.userService.getTransactionsByUserId(userId);
    }
    async getLatestTransaction(userId) {
        const transaction = await this.userService.getLatestTransaction(userId);
        return transaction;
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('/photo/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPhoto", null);
__decorate([
    (0, common_1.Put)('/change-username'),
    (0, common_1.UseGuards)(jwt_auth_guard_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_username_dto_1.ChangeUsernameDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeUsername", null);
__decorate([
    (0, common_1.Post)('/payment'),
    (0, common_1.UseGuards)(jwt_auth_guard_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_dto_1.PaymentDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "payment", null);
__decorate([
    (0, common_1.Get)('/balance'),
    (0, common_1.UseGuards)(jwt_auth_guard_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('/transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('/latest-transaction'),
    (0, common_1.UseGuards)(jwt_auth_guard_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getLatestTransaction", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        telegram_bot_service_1.TelegramBotService])
], UserController);
//# sourceMappingURL=user.contoller.js.map