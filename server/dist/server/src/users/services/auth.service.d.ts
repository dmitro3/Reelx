import { UserLoginInterface } from '../interface/user-login.interface';
import { UserRepository } from '../repositorys/user.repository';
import { JwtService } from './jwt.service';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    register(registerDto: any): Promise<any>;
    login(userData: UserLoginInterface): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    refreshToken(refreshToken: string): Promise<any>;
    validateUser(email: string, password: string): Promise<any>;
    getProfile(userId: string): Promise<any>;
}
