import { Response } from 'express';
import { ChangeUsernameDto } from '../dto/change-username.dto';
import { UsersService } from '../services/users.service';
import { PaymentDto } from '../dto/payment.dto';
import { TelegramBotService } from '../../telegram-bot/services/telegram-bot.service';
export declare class UserController {
    private readonly userService;
    private readonly telegramBotService;
    private readonly staticsPath;
    private readonly allowedExtensions;
    constructor(userService: UsersService, telegramBotService: TelegramBotService);
    getPhoto(filename: string, res: Response): Promise<void>;
    changeUsername(userId: string, changeUsernameDto: ChangeUsernameDto): Promise<void>;
    payment(userId: string, paymentDto: PaymentDto): Promise<{
        invoiceLink: string;
        amount: number;
        type: "stars";
    }>;
    getBalance(userId: string): Promise<{
        tonBalance: number;
        starsBalance: number;
    }>;
    getTransactions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.TransactionType;
        amount: number;
    }[]>;
    getLatestTransaction(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.TransactionType;
        amount: number;
    } | null>;
}
