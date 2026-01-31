import { Module } from '@nestjs/common';
import { TonApiClient } from './tonapi.client';

@Module({
  providers: [TonApiClient],
  exports: [TonApiClient],
})
export class TonApiModule {}
