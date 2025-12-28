import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GiftsModule } from './gifts/gifts.module';
import { PrismaModule } from '../libs/infrustructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, GiftsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
