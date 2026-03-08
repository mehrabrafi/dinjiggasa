import { Module } from '@nestjs/common';
import { LiveStreamGateway } from './live-stream.gateway';
import { LiveStreamService } from './live-stream.service';
import { LiveStreamController } from './live-stream.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [LiveStreamController],
    providers: [LiveStreamGateway, LiveStreamService],
    exports: [LiveStreamService],
})
export class LiveStreamModule { }
