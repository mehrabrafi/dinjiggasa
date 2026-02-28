import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}
