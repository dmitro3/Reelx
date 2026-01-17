import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '../../../src/users/services/jwt.service';
declare module 'express' {
    interface Request {
        user?: {
            userId: string;
        };
    }
}
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    canActivate(context: ExecutionContext): boolean;
    private extractTokenFromHeader;
}
