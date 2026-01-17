import { Response } from 'express';
import { UserLoginInterface } from '../interface/user-login.interface';
import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(userData: UserLoginInterface, res: Response): Promise<{
        accessToken: string;
    }>;
    refresh(refreshDto: any): Promise<{}>;
    getProfile(userId: string): Promise<any>;
}
