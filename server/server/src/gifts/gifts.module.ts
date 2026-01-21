import { Module } from '@nestjs/common';
import { GiftsController } from './gifts.controller';
import { GiftsService } from './gifts.service';
import { UsersModule } from '../users/users.module';
import { WithdrawGiftsService } from './withdraw-gifts.service';

@Module({
  imports: [UsersModule],
  controllers: [GiftsController],
  providers: [GiftsService, WithdrawGiftsService],
  exports: [GiftsService, WithdrawGiftsService],
})
export class GiftsModule {}
