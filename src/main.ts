/**
 * Entry point for the FakeShop API application.
 * Sets up the NestJS application with global pipes, Swagger documentation, and starts the server.
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';

async function bootstrap() {
  // Create a new NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Set up global validation pipe for automatic request payload validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      transform: true, // Automatically transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
    }),
  );

  // Apply the global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Apply the global interceptor for standardized API responses
  app.useGlobalInterceptors(new TransformInterceptor());

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('FakeShop API')
    .setDescription('A RESTful API for fake shop products')
    .setVersion('1.0')
    .addTag('products')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server on the specified port
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation is available at: http://localhost:${port}/api`,
  );
}

// Start the application and handle any bootstrap errors
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
