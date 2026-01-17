import { PrismaService } from '../../../libs/infrustructure/prisma/prisma.service';
import { UserLoginInterface } from '../interface/user-login.interface';
import { User, Transaction, TransactionType } from '@prisma/client';
export declare class UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findUserByTelegramId(telegramId: string): Promise<User | null>;
    createUser(user: UserLoginInterface): Promise<User>;
    changeUsername(userId: string, username: string): Promise<User>;
    updateStarsBalance(userId: string, amount: number): Promise<User>;
    findUserById(userId: string): Promise<User | null>;
    createTransaction(userId: string, amount: number, type: TransactionType): Promise<Transaction>;
    getTransactionsByUserId(userId: string): Promise<Transaction[]>;
    getLatestTransaction(userId: string, type?: TransactionType): Promise<Transaction | null>;
}
