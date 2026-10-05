import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { basename, join } from 'path';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/roles.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { AdminService } from './admin.service';
import { uploadsDirectory } from '../documents/upload-storage';

type AdminRequest = { user: { id: string } };

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats') stats() {
    return this.adminService.stats();
  }
  @Get('users') users(@Query('search') search?: string) {
    return this.adminService.findUsers(search);
  }
  @Get('users/pending') pendingUsers() {
    return this.adminService.findPendingUsers();
  }
  @Patch('users/:id/role') updateUserRole(
    @Request() request: AdminRequest,
    @Param('id') id: string,
    @Body() body: { role: 'STUDENT' | 'ADVISOR' | 'ADMIN' },
  ) {
    return this.adminService.updateUserRole(id, body.role, request.user.id);
  }
  @Patch('users/:id/status') updateUserStatus(
    @Request() request: AdminRequest,
    @Param('id') id: string,
    @Body() body: { status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED' },
  ) {
    return this.adminService.updateUserStatus(id, body.status, request.user.id);
  }
  @Delete('users/:id') removeUser(
    @Request() request: AdminRequest,
    @Param('id') id: string,
  ) {
    return this.adminService.removeUser(id, request.user.id);
  }
  @Get('applications') applications() {
    return this.adminService.findApplications();
  }
  @Get('leads') leads() {
    return this.adminService.findLeads();
  }
  @Patch('leads/:id/assign') assignLead(
    @Param('id') id: string,
    @Body() dto: AssignLeadDto,
  ) {
    return this.adminService.assignLead(id, dto);
  }
  @Get('users/:id/applications') userApplications(@Param('id') id: string) {
    return this.adminService.findUserApplications(id);
  }
  @Get('messages') messages() {
    return this.adminService.findMessages();
  }
  @Delete('messages/:id') removeMessage(@Param('id') id: string) {
    return this.adminService.removeMessage(id);
  }
  @Post('users/:id/messages') sendMessage(
    @Request() request: AdminRequest,
    @Param('id') recipientId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.adminService.sendMessage(request.user.id, recipientId, dto);
  }
  @Get('documents/:id/download')
  async download(@Param('id') id: string, @Res() response: Response) {
    const document = await this.adminService.documentPath(id);
    response
      .type(document.mimeType)
      .download(
        join(uploadsDirectory, basename(document.storageKey)),
        document.name,
      );
  }
  @Delete('documents/:id') removeDocument(@Param('id') id: string) {
    return this.adminService.removeDocument(id);
  }
}
