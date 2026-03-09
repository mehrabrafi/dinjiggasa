import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
    private readonly s3Client: S3Client;
    private readonly logger = new Logger(UploadService.name);

    constructor(private configService: ConfigService) {
        const accessKeyId = this.configService.getOrThrow<string>('R2_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.getOrThrow<string>('R2_SECRET_ACCESS_KEY');
        const accountId = this.configService.getOrThrow<string>('R2_ACCOUNT_ID');

        this.s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    async uploadFile(file: Express.Multer.File, folder = 'avatars'): Promise<string> {
        const bucketName = this.configService.get<string>('R2_BUCKET_NAME');
        const publicUrl = this.configService.get<string>('R2_PUBLIC_URL');

        // Create unique filename
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

        try {
            const body = file.buffer || fs.createReadStream(file.path);

            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: fileName,
                    Body: body as any,
                    ContentType: file.mimetype,
                }),
            );

            // Return the public URL
            return `${publicUrl}/${fileName}`;
        } catch (error) {
            this.logger.error(`Error uploading file to R2: ${error.message}`);
            // Provide more descriptive error for debugging
            throw new InternalServerErrorException(`Failed to upload file: ${error.message}`);
        }
    }
}
