import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    madhab?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    educationalQualifications?: string;

    @IsOptional()
    officeHours?: any;
}
