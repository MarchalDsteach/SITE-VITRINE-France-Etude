import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

type AuthenticatedRequest = { user: { id: string } };

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Dossier créé.' })
  create(@Request() request: AuthenticatedRequest, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(request.user.id, dto);
  }

  @Get()
  @ApiOkResponse({ description: 'Dossiers de l’étudiant connecté.' })
  findMine(@Request() request: AuthenticatedRequest) {
    return this.applicationsService.findMine(request.user.id);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Détail d’un dossier.' })
  findOne(@Request() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.applicationsService.findOneForUser(id, request.user.id);
  }
}
