import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) { }

  async signup(dto: SignupDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      if (!(userExists as any).isVerified) {
        // User exists but not verified, re-send OTP with backoff
        return this.resendOTP(userExists.email);
      }
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await (this.prisma.user as any).create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        gender: dto.gender,
        madhab: dto.madhab,
        role: Role.USER, // Role is always USER on signup — admins assign other roles
        otpCode: otp,
        otpExpiresAt,
        otpAttempts: 1,
        lastOtpSentAt: new Date(),
        isVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        madhab: true,
      },
    });

    // Send the OTP email
    this.mailService.sendOTP({ email: user.email, name: user.name }, otp)
      .catch((err) => console.error('Failed to send signup OTP:', err));

    return {
      message:
        'Signup initiated. Please check your email for the verification code.',
      user,
      waitTime: 60, // First wait time is 60s
      nextRequestAt: new Date(Date.now() + 60 * 1000),
    };
  }

  private calculateWaitTime(attempts: number): number {
    const waitTimes = [0, 60, 120, 300, 600, 1800, 3600]; // in seconds
    return waitTimes[attempts] || 3600;
  }

  async verifyOTP(email: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isVerified) {
      return { message: 'Email already verified' };
    }

    if (!(user as any).otpCode || (user as any).otpCode !== code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    if (!(user as any).otpExpiresAt || new Date() > (user as any).otpExpiresAt) {
      throw new UnauthorizedException('Verification code has expired');
    }

    await (this.prisma.user as any).update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiresAt: null,
        otpAttempts: 0,
        lastOtpSentAt: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async resendOTP(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isVerified) {
      return { message: 'Email already verified' };
    }

    const attempts = (user as any).otpAttempts || 0;
    const lastSentAt = (user as any).lastOtpSentAt;
    const waitTime = this.calculateWaitTime(attempts);

    if (lastSentAt) {
      const nextAllowedAt = new Date(new Date(lastSentAt).getTime() + waitTime * 1000);
      if (new Date() < nextAllowedAt) {
        const remainingSeconds = Math.ceil((nextAllowedAt.getTime() - new Date().getTime()) / 1000);
        throw new BadRequestException(`Please wait ${remainingSeconds} seconds before requesting a new code.`);
      }
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const newAttempts = attempts + 1;

    await (this.prisma.user as any).update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpiresAt,
        otpAttempts: newAttempts,
        lastOtpSentAt: new Date(),
      },
    });

    await this.mailService.sendOTP({ email: user.email, name: user.name }, otp);

    return {
      message: 'Verification code resent successfully',
      waitTime: this.calculateWaitTime(newAttempts),
      nextRequestAt: new Date(Date.now() + this.calculateWaitTime(newAttempts) * 1000),
    };
  }

  // Track failed login attempts in memory (per-IP and per-email)
  private loginAttempts = new Map<string, { count: number; lockedUntil: Date | null }>();
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

  private checkLoginLockout(key: string): void {
    const record = this.loginAttempts.get(key);
    if (record?.lockedUntil && new Date() < record.lockedUntil) {
      const remainingMs = record.lockedUntil.getTime() - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      throw new UnauthorizedException(
        `Too many failed login attempts. Please try again in ${remainingMin} minute(s).`,
      );
    }
  }

  private recordFailedLogin(key: string): void {
    const record = this.loginAttempts.get(key) || { count: 0, lockedUntil: null };
    record.count += 1;
    if (record.count >= this.MAX_LOGIN_ATTEMPTS) {
      record.lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION_MS);
      record.count = 0; // reset count after lockout
    }
    this.loginAttempts.set(key, record);
  }

  private clearLoginAttempts(key: string): void {
    this.loginAttempts.delete(key);
  }

  async login(dto: LoginDto) {
    const emailKey = `email:${dto.email.toLowerCase()}`;

    // Check lockout before processing
    this.checkLoginLockout(emailKey);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      this.recordFailedLogin(emailKey);
      throw new UnauthorizedException('Invalid credentials');
    }

    if ((user as any).isBanned) {
      throw new UnauthorizedException('Your account has been suspended. Please contact support.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      this.recordFailedLogin(emailKey);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(user as any).isVerified) {
      throw new UnauthorizedException('Please verify your email address before logging in.');
    }

    // Successful login — clear lockout tracking
    this.clearLoginAttempts(emailKey);

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        gender: user.gender,
        madhab: user.madhab,
        bio: user.bio,
        educationalQualifications: (user as any).educationalQualifications,
        officeHours: (user as any).officeHours,
        specialization: (user as any).specialization,
        isVerified: user.isVerified,
        isBanned: (user as any).isBanned,
      },
    };
  }
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: 'Password successfully changed',
    };
  }

  async updateProfile(userId: string, dto: { name?: string; madhab?: string; bio?: string; educationalQualifications?: string; officeHours?: any; specialization?: string; }) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.madhab && { madhab: dto.madhab }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.educationalQualifications !== undefined && { educationalQualifications: dto.educationalQualifications }),
        ...(dto.officeHours !== undefined && { officeHours: dto.officeHours }),
        ...(dto.specialization !== undefined && { specialization: dto.specialization }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        madhab: true,
        avatar: true,
        bio: true,
        educationalQualifications: true,
        officeHours: true,
        specialization: true,
      } as any,
    });

    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

  async findAll() {
    return (this.prisma.user as any).findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        isBanned: true,
        avatar: true,
        createdAt: true,
        specialization: true
      },
    });
  }

  async updateVerification(userId: string, isVerified: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isVerified },
    });
  }

  async updateRole(userId: string, targetRole: Role, requesterRole: string) {
    const userToUpdate = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userToUpdate) throw new ConflictException('User not found');

    // Prevent any role modification of ADMINs
    if (userToUpdate.role === Role.ADMIN) {
      throw new UnauthorizedException('Cannot modify Administrator roles');
    }

    // Only allow setting ADMIN role if the requester is an ADMIN
    if (targetRole === Role.ADMIN && requesterRole !== Role.ADMIN) {
      throw new UnauthorizedException('Only administrators can promote to Admin role');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: targetRole },
    });
  }

  async updateBanStatus(userId: string, isBanned: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ConflictException('User not found');
    if (user.role === Role.ADMIN) throw new UnauthorizedException('Cannot ban Admin');

    return (this.prisma.user as any).update({
      where: { id: userId },
      data: { isBanned },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security reasons, don't confirm if user exists or not
      return { message: 'If an account exists with this email, a reset link has been sent.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await (this.prisma.user as any).update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetTokenExpiresAt: expiry,
      },
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
    await this.mailService.sendPasswordResetEmail({ email: user.email, name: user.name }, resetUrl);
    return { message: 'If an account exists with this email, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Validate password strength on reset too
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    const user = await (this.prisma.user as any).findFirst({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await (this.prisma.user as any).update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null,
      },
    });

    return { message: 'Password has been successfully reset' };
  }
}
