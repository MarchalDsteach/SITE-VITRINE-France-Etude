import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdvisorGuard } from '../auth/roles.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateAdvisorLeadDto } from './dto/update-advisor-lead.dto';
import { AdminService } from './admin.service';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.adminService.createLead(dto);
  }
}

type AdvisorRequest = { user: { id: string } };

@ApiTags('advisor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdvisorGuard)
@Controller('advisor')
export class AdvisorController {
  constructor(private readonly adminService: AdminService) {}

  @Get('leads')
  leads(@Request() request: AdvisorRequest) {
    return this.adminService.findLeads(request.user.id);
  }

  @Patch('leads/:id')
  updateLead(
    @Request() request: AdvisorRequest,
    @Param('id') id: string,
    @Body() body: UpdateAdvisorLeadDto,
  ) {
    return this.adminService.updateAdvisorLead(
      id,
      request.user.id,
      body.status,
    );
  }

  @Post('students/:id/messages')
  sendMessage(
    @Request() request: AdvisorRequest,
    @Param('id') recipientId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.adminService.sendAdvisorMessage(
      request.user.id,
      recipientId,
      dto,
    );
  }
}
