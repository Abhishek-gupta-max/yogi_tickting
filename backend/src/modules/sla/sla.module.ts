import { Module } from '@nestjs/common';
import { SLAService } from './sla.service';
import { SLAController } from './sla.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [SLAController],
  providers: [SLAService, PrismaService],
  exports: [SLAService],
})
export class SLAModule {}
