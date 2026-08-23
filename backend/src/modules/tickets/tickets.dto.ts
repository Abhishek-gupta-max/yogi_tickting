import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketPriorityType, TicketStatusType } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({ example: 'Unable to access VPN after system update' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'User gets HTTP 500 error when attempting to connect to corporate gateway.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ enum: TicketPriorityType, default: TicketPriorityType.MEDIUM })
  @IsOptional()
  @IsEnum(TicketPriorityType)
  priority?: TicketPriorityType;

  @ApiPropertyOptional({ example: 'Network & Infrastructure' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ example: 'john@customer.com' })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;
}

export class UpdateTicketDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TicketStatusType })
  @IsOptional()
  @IsEnum(TicketStatusType)
  status?: TicketStatusType;

  @ApiPropertyOptional({ enum: TicketPriorityType })
  @IsOptional()
  @IsEnum(TicketPriorityType)
  priority?: TicketPriorityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class TicketQueryDto {
  @ApiPropertyOptional({ enum: TicketStatusType })
  @IsOptional()
  @IsEnum(TicketStatusType)
  status?: TicketStatusType;

  @ApiPropertyOptional({ enum: TicketPriorityType })
  @IsOptional()
  @IsEnum(TicketPriorityType)
  priority?: TicketPriorityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

export class CreateCommentDto {
  @ApiProperty({ example: 'We have updated the VPN server routes. Please re-test.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ default: false, description: 'True if internal note visible only to agents' })
  @IsOptional()
  isInternal?: boolean = false;
}
