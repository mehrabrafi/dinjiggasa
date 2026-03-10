import { Module } from '@nestjs/common';
import { LiveStreamGateway } from './live-stream.gateway';
import { LiveStreamService } from './live-stream.service';
import { LiveStreamController } from './live-stream.controller';
import { LiveChatGateway } from './live-chat.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [LiveStreamController],
  providers: [LiveStreamGateway, LiveStreamService, LiveChatGateway],
  exports: [LiveStreamService],
})
export class LiveStreamModule {}
