import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto, RegisterDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'inactive') {
      throw new UnauthorizedException('User account is deactivated');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role, user.organizationId);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        organizationId: user.organizationId,
        organizationName: user.organization.name,
        departmentId: user.departmentId,
        teamId: user.teamId,
      },
      ...tokens,
    };
  }

  async register(dto: RegisterDto) {
    // Check if organization code or email exists
    const existingOrg = await this.prisma.organization.findUnique({
      where: { code: dto.organizationCode.toUpperCase().trim() },
    });
    if (existingOrg) {
      throw new ConflictException('Organization code is already registered');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existingUser) {
      throw new ConflictException('User email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Atomic transaction creating Organization + Organization Admin User + Default SLA Policies
    const result = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: dto.organizationName,
          code: dto.organizationCode.toUpperCase().trim(),
          email: dto.email.toLowerCase().trim(),
          status: 'active',
          subscriptionPlan: 'enterprise',
        },
      });

      const user = await tx.user.create({
        data: {
          organizationId: organization.id,
          name: dto.name,
          email: dto.email.toLowerCase().trim(),
          passwordHash: hashedPassword,
          phone: dto.phone,
          role: 'ORGANIZATION_ADMIN',
          status: 'active',
          isEmailVerified: true,
        },
      });

      // Default SLA Policy
      await tx.sLAPolicy.create({
        data: {
          organizationId: organization.id,
          name: 'Default Standard SLA',
          description: 'Standard resolution times for general tickets',
          priority: 'MEDIUM',
          responseTimeMinutes: 60,
          resolutionTimeMinutes: 1440,
          isDefault: true,
        },
      });

      // Default Department
      await tx.department.create({
        data: {
          organizationId: organization.id,
          name: 'IT Support & Operations',
          code: 'IT-OPS',
          description: 'Primary IT support tier',
        },
      });

      return { organization, user };
    });

    const tokens = this.generateTokens(result.user.id, result.user.email, result.user.role, result.organization.id);

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        organizationId: result.organization.id,
        organizationName: result.organization.name,
      },
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'itsm_refresh_secret_key_2026',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.status === 'inactive') {
        throw new UnauthorizedException('User account invalid or inactive');
      }

      return this.generateTokens(user.id, user.email, user.role, user.organizationId);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) {
      // Always return success message to prevent user enumeration security attacks
      return { message: 'If an account exists for this email, password reset instructions have been sent.' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, purpose: 'password_reset' },
      { expiresIn: '1h' },
    );

    // Audit event for reset request
    await this.prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: 'USER_PASSWORD_RESET_REQUESTED',
        entity: 'User',
        entityId: user.id,
      },
    });

    return {
      message: 'If an account exists for this email, password reset instructions have been sent.',
      resetToken, // Returned in API payload for developer ease in dev environments
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(dto.token);
      if (payload.purpose !== 'password_reset') {
        throw new BadRequestException('Invalid password reset token');
      }

      const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { passwordHash: hashedPassword },
      });

      return { message: 'Password updated successfully. You can now log in.' };
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
        department: true,
        team: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateTokens(userId: string, email: string, role: string, organizationId: string) {
    const payload = { sub: userId, email, role, organizationId };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'itsm_super_secret_jwt_key_2026',
      expiresIn: '24h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'itsm_refresh_secret_key_2026',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
