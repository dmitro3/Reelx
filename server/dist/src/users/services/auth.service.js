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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../repositorys/user.repository");
const jwt_service_1 = require("./jwt.service");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        return {};
    }
    async login(userData) {
        let user = await this.userRepository.findUserByTelegramId(userData.telegramId);
        if (!user) {
            user = await this.userRepository.createUser(userData);
        }
        const { accessToken, refreshToken } = this.jwtService.generateTokens(user);
        return { accessToken, refreshToken };
    }
    async logout(userId) { }
    async refreshToken(refreshToken) {
        return {};
    }
    async validateUser(email, password) {
        return null;
    }
    async getProfile(userId) {
        return {};
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        jwt_service_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map