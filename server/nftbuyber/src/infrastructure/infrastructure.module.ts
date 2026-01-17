import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { GetGemsModule } from './getgems/getgems.module';

@Module({
  imports: [RedisModule, GetGemsModule],
  exports: [RedisModule, GetGemsModule],
})
export class InfrastructureModule {}
