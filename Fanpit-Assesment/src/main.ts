import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Add global prefix to match frontend config
  app.setGlobalPrefix('api');
  
  // Add validation pipe with more permissive settings
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false, // Don't strip unknown properties
    forbidNonWhitelisted: false, // Don't forbid unknown properties
    transform: true, // Transform payloads to DTO instances
  }));

  // Listen on port 3001 by default to avoid conflict with Next.js
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
