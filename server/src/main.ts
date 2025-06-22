import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://www.russana.vercel.app',
        'https://russana.vercel.app',
        'https://russana.vercel.app/home',
        'https://russana-web.vercel.app', // Add this
        'https://www.russana-web.vercel.app', // Add this
        'https://russana-git-main-aberoshvilis-projects.vercel.app', // Add preview URLs
        'https://russana-aberoshvilis-projects.vercel.app', // Add preview URLs
        'http://localhost:3000',
        'https://localhost:3000',
        'http://localhost:4000',
        'https://localhost:4000',
      ];

      // Allow requests with no origin (like mobile apps, curl requests)
      if (
        !origin ||
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.match(/localhost/) ||
        origin.includes('.vercel.app') // Allow all Vercel domains
      ) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'forum-id',
      'Origin',
      'Accept',
      'X-Requested-With',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use('/favicon.ico', (req, res) => res.status(204).send());

  // Setup static file serving for uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Make sure uploads directory exists
  const uploadsDir = join(__dirname, '..', 'uploads');
  const logosDir = join(uploadsDir, 'logos');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
  }

  const config = new DocumentBuilder()
    .setTitle('Russana  API')
    .setDescription('Russana E-commerce REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // დარწმუნდით, რომ როუტი არის '/docs'

  app.enableShutdownHooks();

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0'); // ვერსელისთვის საჭიროა '0.0.0.0'

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
