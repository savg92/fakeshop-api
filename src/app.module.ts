import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { FakestoreModule } from './external/fakestore/fakestore.module';
import configuration from './config/configuration';
import { Product } from './products/entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        ssl:
          process.env.DB_SSL_MODE === 'require'
            ? {
                rejectUnauthorized: false,
              }
            : false,
        entities: [Product],
        synchronize: process.env.NODE_ENV !== 'production', // Automatic synchronization, disable in production
        logging: process.env.NODE_ENV !== 'production',
      }),
    }),
    ProductsModule,
    FakestoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
