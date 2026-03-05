import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,#^()\-_=+])[A-Za-z\d@$!%*?&.,#^()\-_=+]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  madhab?: string;

  // NOTE: 'role' field intentionally removed — users cannot self-assign roles.
  // Role assignment should only be done by admins via the admin panel.
}
