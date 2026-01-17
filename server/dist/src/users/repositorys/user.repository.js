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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../libs/infrustructure/prisma/prisma.service");
let UserRepository = class UserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findUserByTelegramId(telegramId) {
        return (await this.prisma.user.findUnique({
            where: {
                telegramId,
            },
        }));
    }
    async createUser(user) {
        return (await this.prisma.user.create({
            data: {
                telegramId: user.telegramId,
                username: user.username,
                photoUrl: user.photoUrl,
            },
        }));
    }
    async changeUsername(userId, username) {
        return (await this.prisma.user.update({
            where: { id: userId },
            data: { username: username },
        }));
    }
    async updateStarsBalance(userId, amount) {
        return (await this.prisma.user.update({
            where: { id: userId },
            data: {
                starsBalance: { increment: amount },
            },
        }));
    }
    async findUserById(userId) {
        return (await this.prisma.user.findUnique({
            where: { id: userId },
        }));
    }
    async createTransaction(userId, amount, type) {
        return (await this.prisma.transaction.create({
            data: {
                userId,
                amount,
                type,
            },
        }));
    }
    async getTransactionsByUserId(userId) {
        return (await this.prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        }));
    }
    async getLatestTransaction(userId, type) {
        return (await this.prisma.transaction.findFirst({
            where: type ? { userId, type } : { userId },
            orderBy: { createdAt: 'desc' },
        }));
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map