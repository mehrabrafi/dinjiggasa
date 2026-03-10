import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateReportDto {
  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsUUID()
  questionId?: string;

  @IsOptional()
  @IsUUID()
  answerId?: string;
}
