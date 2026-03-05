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
import { MailService } from '../mail/mail.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await (this.prisma.user as any).create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        gender: dto.gender,
        madhab: dto.madhab,
        role: dto.role as Role || Role.USER,
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(user as any).isVerified) {
      throw new UnauthorizedException('Please verify your email address before logging in.');
    }

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

  async updateProfile(userId: string, dto: { name?: string; madhab?: string }) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.madhab && { madhab: dto.madhab }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        madhab: true,
        avatar: true,
      },
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
}
