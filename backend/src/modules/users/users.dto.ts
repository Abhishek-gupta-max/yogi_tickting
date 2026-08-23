import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'Sophia Martinez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'sophia@acme.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: 'Password123!' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string = 'ChangeMe123!';

  @ApiPropertyOptional({ enum: RoleType, default: RoleType.AGENT })
  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType = RoleType.AGENT;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiPropertyOptional({ example: '+1 555-0188' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: RoleType })
  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
