/**
 * Root module of the FakeShop API application.
 * Configures global settings, database connection, and imports feature modules.
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { FakestoreModule } from './external/fakestore/fakestore.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Global configuration module setup
    ConfigModule.forRoot({
      isGlobal: true, // Make configuration available throughout the app
      load: [configuration], // Load custom configuration
      envFilePath: ['.env'],
    }),
    // Database connection configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        ssl:
          configService.get<string>('DB_SSL_MODE') === 'require'
            ? {
                rejectUnauthorized: false,
              }
            : false,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // Auto-sync database schema in non-prod
      }),
    }),
    // Feature modules
    ProductsModule, // Handles product-related functionality
    FakestoreModule, // Integration with external FakeStore API
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
