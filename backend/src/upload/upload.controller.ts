import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Request,
    BadRequestException,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { PrismaService } from '../prisma/prisma.service';

// Max file sizes
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;  // 5MB
const MAX_VOICE_SIZE = 25 * 1024 * 1024;  // 25MB

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = /^image\/(jpeg|jpg|png|gif|webp)(;.*)?$/;
const ALLOWED_AUDIO_TYPES = /^(audio|video)\/(mpeg|mp3|wav|ogg|webm|mp4|m4a|aac|x-matroska)(;.*)?$/;

@Controller('upload')
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly prisma: PrismaService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: MAX_AVATAR_SIZE, message: 'Avatar file must be smaller than 5MB' }),
                    new FileTypeValidator({ fileType: ALLOWED_IMAGE_TYPES }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Request() req: any,
    ) {
        // Additional server-side validation of file extension
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!ext || !allowedExts.includes(ext)) {
            throw new BadRequestException(`File type .${ext} is not allowed. Allowed types: ${allowedExts.join(', ')}`);
        }

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
    async uploadAnswerVoice(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: MAX_VOICE_SIZE, message: 'Voice file must be smaller than 25MB' }),
                    new FileTypeValidator({ fileType: ALLOWED_AUDIO_TYPES }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        // Additional server-side validation of file extension
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        const allowedExts = ['mp3', 'wav', 'ogg', 'webm', 'mp4', 'm4a', 'aac'];
        if (!ext || !allowedExts.includes(ext)) {
            throw new BadRequestException(`File type .${ext} is not allowed. Allowed types: ${allowedExts.join(', ')}`);
        }

        const voiceUrl = await this.uploadService.uploadFile(file, 'voices');

        return {
            message: 'Voice answer uploaded successfully',
            voiceUrl,
        };
    }
}
