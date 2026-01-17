import { User } from '@prisma/client';
interface TokenPayload {
    userId: string;
    username: string;
    photoUrl: string | null;
    tonBalance: number;
    starsBalance: number;
}
interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare class JwtService {
    constructor();
    generateTokens(user: User): TokenPair;
    validateToken(token: string): TokenPayload;
    private generateToken;
    private getJwtSecret;
}
export {};
