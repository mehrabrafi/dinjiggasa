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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async signup(dto: SignupDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        gender: dto.gender,
        madhab: dto.madhab,
        role: dto.role as Role || Role.USER,
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

    return {
      message: 'Signup successful',
      user,
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
        isBanned: user.isBanned,
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
    return this.prisma.user.findMany({
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

    return this.prisma.user.update({
      where: { id: userId },
      data: { isBanned },
    });
  }
}
