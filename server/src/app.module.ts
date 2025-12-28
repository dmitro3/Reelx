import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GiftsModule } from './gifts/gifts.module';
import { PrismaModule } from '../libs/infrustructure/prisma/prisma.module';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';

@Module({
  imports: [PrismaModule, UsersModule, GiftsModule, TelegramBotModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
