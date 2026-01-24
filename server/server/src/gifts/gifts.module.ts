import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GiftsController } from './gifts.controller';
import { GiftsService } from './gifts.service';
import { UsersModule } from '../users/users.module';
import { WithdrawGiftsService } from './withdraw-gifts.service';

@Module({
  imports: [UsersModule, ConfigModule],
  controllers: [GiftsController],
  providers: [GiftsService, WithdrawGiftsService],
  exports: [GiftsService, WithdrawGiftsService],
})
export class GiftsModule {}
