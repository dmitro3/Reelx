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
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
let JwtService = class JwtService {
    constructor() { }
    generateTokens(user) {
        const payload = {
            userId: user.id,
            username: user.username,
            photoUrl: user.photoUrl,
            tonBalance: user.tonBalance,
            starsBalance: user.starsBalance,
        };
        const accessToken = this.generateToken(payload, '1h');
        const refreshToken = this.generateToken(payload, '7d');
        return { accessToken, refreshToken };
    }
    validateToken(token) {
        try {
            const secret = this.getJwtSecret();
            const decoded = jwt.verify(token, secret);
            return decoded;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    generateToken(payload, expiresIn) {
        const secret = this.getJwtSecret();
        return jwt.sign(payload, secret, { expiresIn });
    }
    getJwtSecret() {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not set in environment variables');
        }
        return secret;
    }
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtService);
//# sourceMappingURL=jwt.service.js.map