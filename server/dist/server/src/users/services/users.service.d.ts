import { UserRepository } from '../repositorys/user.repository';
import { ChangeUsernameDto } from '../dto/change-username.dto';
import { TransactionType } from '@prisma/client';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    createUser(telegramId: string, username: string, photo_url: string): Promise<void>;
    changeUsername(userId: string, changeUsernameDto: ChangeUsernameDto): Promise<void>;
    findUserByTelegramId(telegramId: string): Promise<{
        id: string;
        username: string;
        telegramId: string | null;
        photoUrl: string | null;
        tonBalance: number;
        starsBalance: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateStarsBalance(userId: string, amount: number): Promise<void>;
    findUserById(userId: string): Promise<{
        id: string;
        username: string;
        telegramId: string | null;
        photoUrl: string | null;
        tonBalance: number;
        starsBalance: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getBalance(userId: string): Promise<{
        tonBalance: number;
        starsBalance: number;
    }>;
    getLatestTransaction(userId: string, type?: TransactionType): Promise<{
        type: import(".prisma/client").$Enums.TransactionType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
    } | null>;
    getTransactionsByUserId(userId: string): Promise<{
        type: import(".prisma/client").$Enums.TransactionType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
    }[]>;
}
