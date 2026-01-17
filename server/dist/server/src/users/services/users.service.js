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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../repositorys/user.repository");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(telegramId, username, photo_url) {
        await this.userRepository.createUser({ telegramId, username, photoUrl: photo_url });
    }
    async changeUsername(userId, changeUsernameDto) {
        await this.userRepository.changeUsername(userId, changeUsernameDto.username);
    }
    async findUserByTelegramId(telegramId) {
        return (await this.userRepository.findUserByTelegramId(telegramId));
    }
    async updateStarsBalance(userId, amount) {
        await this.userRepository.updateStarsBalance(userId, amount);
        await this.userRepository.createTransaction(userId, amount, client_1.TransactionType.stars);
    }
    async findUserById(userId) {
        return (await this.userRepository.findUserById(userId));
    }
    async getBalance(userId) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            return { tonBalance: 0, starsBalance: 0 };
        }
        return {
            tonBalance: user.tonBalance || 0,
            starsBalance: user.starsBalance || 0,
        };
    }
    async getLatestTransaction(userId, type) {
        return (await this.userRepository.getLatestTransaction(userId, type));
    }
    async getTransactionsByUserId(userId) {
        return (await this.userRepository.getTransactionsByUserId(userId));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map