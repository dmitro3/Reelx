import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GiftsController } from './gifts.controller';
import { GiftsService } from './gifts.service';
import { UsersModule } from '../users/users.module';
import { WithdrawGiftsService } from './withdraw-gifts.service';
import { PrismaModule } from '../../libs/infrustructure/prisma/prisma.module';
import { GiftsRepository } from './repositorys/gifts.repository';

@Module({
  imports: [UsersModule, ConfigModule, PrismaModule],
  controllers: [GiftsController],
  providers: [GiftsService, WithdrawGiftsService, GiftsRepository],
  exports: [GiftsService, WithdrawGiftsService],
})
export class GiftsModule {}
