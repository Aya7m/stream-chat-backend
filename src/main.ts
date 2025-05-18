



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { Response } from 'express';


import * as dotenv from 'dotenv';
import { ExpressAdapter } from '@nestjs/platform-express';

import { join } from 'path';
dotenv.config();

async function bootstrap() {
  // تأكد من أنك تستخدم ExpressAdapter

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.use(cookieParser());

  // إعداد CORS بناءً على البيئة
app.enableCors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://stream-frontend-gllrovn08-ayas-projects-ecef4715.vercel.app', process.env.CLIENT_URL]
    : ['http://localhost:5173'],
  credentials: true,
});


  // Serve React build
  // app.use(express.static(join(__dirname, '..', 'public', 'dist')));




  //   server.get('*', (req, res) => {
  //   res.sendFile(join(__dirname, '..', 'public', 'dist', 'index.html'));
  // });


    // Serve frontend
  server.use(express.static(join(__dirname, 'frontend')));

  // Handle SPA routing
  server.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'frontend', 'index.html'));
  });


  // بدء السيرفر على البورت المحدد
  await app.listen(process.env.PORT ?? 5000);
  console.log(`Server is running on port ${process.env.PORT ?? 5000}`);
}

bootstrap();

