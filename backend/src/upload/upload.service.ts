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
    const accessKeyId = this.configService.getOrThrow<string>('WASABI_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.getOrThrow<string>(
      'WASABI_SECRET_ACCESS_KEY',
    );
    const region = this.configService.getOrThrow<string>('WASABI_REGION');
    const endpoint = this.configService.getOrThrow<string>('WASABI_ENDPOINT');

    this.s3Client = new S3Client({
      region: region,
      endpoint: endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // Recommended for Wasabi
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'avatars',
  ): Promise<string> {
    const bucketName = this.configService.getOrThrow<string>('WASABI_BUCKET_NAME');
    const endpoint = this.configService.getOrThrow<string>('WASABI_ENDPOINT');

    // Construct public URL if not provided in env
    const publicUrl = this.configService.get<string>('WASABI_PUBLIC_URL') || `${endpoint}/${bucketName}`;

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
          ACL: 'public-read',
        }),
      );

      // Return the public URL
      return `${publicUrl}/${fileName}`;
    } catch (error) {
      this.logger.error(`Error uploading file to Wasabi: ${error.message}`);
      // Provide more descriptive error for debugging
      throw new InternalServerErrorException(
        `Failed to upload file: ${error.message}`,
      );
    }
  }
}
