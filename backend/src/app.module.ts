import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { TeamsModule } from './modules/teams/teams.module';
import { SLAModule } from './modules/sla/sla.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { ReportsModule } from './modules/reports/reports.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    TicketsModule,
    DepartmentsModule,
    TeamsModule,
    SLAModule,
    ApprovalsModule,
    ReportsModule,
    KnowledgeBaseModule,
    AuditLogsModule,
    OrganizationsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
