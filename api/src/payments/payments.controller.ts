import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ActiveUserGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

type AuthenticatedRequest = { user: { id: string } };

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ActiveUserGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOkResponse({ description: 'Historique des paiements de l’étudiant connecté.' })
  findMine(@Request() request: AuthenticatedRequest) {
    return this.paymentsService.findMine(request.user.id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Paiement créé pour un dossier.' })
  create(@Request() request: AuthenticatedRequest, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create({
      applicationId: dto.applicationId,
      userId: request.user.id,
      amount: dto.amount,
      currency: dto.currency,
      provider: dto.provider,
      description: dto.description,
    });
  }
}
