import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { ScholarsModule } from './scholars/scholars.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [PrismaModule, AuthModule, QuestionsModule, ScholarsModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
