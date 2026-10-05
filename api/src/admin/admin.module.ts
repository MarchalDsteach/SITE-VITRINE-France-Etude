import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdvisorController, LeadsController } from './leads.controller';
import { AdminService } from './admin.service';

@Module({ controllers: [AdminController, AdvisorController, LeadsController], providers: [AdminService] })
export class AdminModule {}
