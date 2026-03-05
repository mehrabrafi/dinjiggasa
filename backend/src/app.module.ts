import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { ScholarsModule } from './scholars/scholars.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadModule } from './upload/upload.module';
import { ReportsModule } from './reports/reports.module';
import { MailModule } from './mail/mail.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ── Global Rate Limiting ────────────────────────────────────────
    // Default: 60 requests per 60 seconds per IP
    // Individual endpoints can override with @Throttle()
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,   // 1 second window
          limit: 3,    // max 3 requests per second
        },
        {
          name: 'medium',
          ttl: 10000,  // 10 second window
          limit: 20,   // max 20 requests per 10 seconds
        },
        {
          name: 'long',
          ttl: 60000,  // 60 second window
          limit: 100,  // max 100 requests per minute
        },
      ],
    }),

    PrismaModule,
    AuthModule,
    QuestionsModule,
    ScholarsModule,
    NotificationsModule,
    UploadModule,
    ReportsModule,
    MailModule
  ],

  controllers: [AppController],
  providers: [
    AppService,
    // Apply rate limiting globally to all endpoints
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
