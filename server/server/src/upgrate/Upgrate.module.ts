import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UpgrateController } from './Upgrate.controller';
import { UpgrateService } from './Upgrate.service';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '../../libs/infrustructure/redis/redis.module';

@Module({
  imports: [ConfigModule, RedisModule, UsersModule],
  controllers: [UpgrateController],
  providers: [UpgrateService],
  exports: [UpgrateService],
})
export class UpgrateModule {}
