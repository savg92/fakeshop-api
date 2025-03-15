import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { FakestoreModule } from '../external/fakestore/fakestore.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FakestoreModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
