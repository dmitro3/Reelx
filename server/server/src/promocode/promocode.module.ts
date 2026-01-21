import { Module } from '@nestjs/common';
import { PromocodeController } from './controllers/promocode.controller';
import { PromocodeService } from './service/promocode.service';
import { PromocodeRepository } from './repository/promocode.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PromocodeController],
  providers: [PromocodeService, PromocodeRepository],
  exports: [PromocodeService],
})
export class PromocodeModule {}

