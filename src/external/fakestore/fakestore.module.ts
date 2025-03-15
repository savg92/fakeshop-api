import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FakestoreService } from './fakestore.service';

@Module({
  imports: [ConfigModule],
  providers: [FakestoreService],
  exports: [FakestoreService],
})
export class FakestoreModule {}
