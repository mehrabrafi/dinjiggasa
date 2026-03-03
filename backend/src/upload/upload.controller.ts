import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('upload')
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly prisma: PrismaService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
        const userId = req.user.id;
        const avatarUrl = await this.uploadService.uploadFile(file, 'avatars');

        // Update user's avatar in database
        await this.prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarUrl },
        });

        return {
            message: 'Avatar uploaded successfully',
            avatarUrl,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('answer-voice')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAnswerVoice(@UploadedFile() file: Express.Multer.File) {
        const voiceUrl = await this.uploadService.uploadFile(file, 'voices');

        return {
            message: 'Voice answer uploaded successfully',
            voiceUrl,
        };
    }
}
