import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../libs/infrustructure/prisma/prisma.service';
import { UserLoginInterface } from '../interface/user-login.interface';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findUserByTelegramId(telegramId: string): Promise<User | null> {
        return (await this.prisma.user.findUnique({
            where: {
                telegramId,
            },
        }));
    }

    async createUser(user: UserLoginInterface): Promise<User> {
        return (await this.prisma.user.create({
            data: { telegramId: user.telegramId, username: user.username },
        }));
    }

    async changeUsername(userId: string, username: string): Promise<User> {
        return (await this.prisma.user.update({
            where: { id: userId },
            data: { username: username },
        }));
    }
}