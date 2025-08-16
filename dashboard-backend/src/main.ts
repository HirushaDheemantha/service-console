// dashboard-backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enhanced CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000' // Next.js dev server

    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Global response formatting
  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();