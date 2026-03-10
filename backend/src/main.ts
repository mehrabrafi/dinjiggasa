import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Security Headers ──────────────────────────────────────────────
  app.use(helmet());

  // ── Trust Proxy ───────────────────────────────────────────────────
  // Trust only the first proxy (e.g., Nginx) — not all proxies
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // ── CORS ──────────────────────────────────────────────────────────
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://dinjiggasa.info',
    'https://www.dinjiggasa.info',
    'https://deenjiggasa.info',
    'https://www.deenjiggasa.info',
  ].filter(Boolean);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ── Global Prefix ─────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── Validation ────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  const port = process.env.PORT ?? 3001;
  const server = await app.listen(port, '0.0.0.0');
  server.setTimeout(300000); // 5 minutes (for large file upload)
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
