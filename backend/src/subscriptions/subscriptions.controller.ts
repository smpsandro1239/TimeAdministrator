import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Logger } from '../common/logger/logger.service';
import { SubscriptionPeriod } from './enums/subscription-period.enum';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly logger: Logger,
  ) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    this.logger.log(`Criação de subscrição para cliente: ${createSubscriptionDto.clientId}`, 'SubscriptionsController');
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.subscriptionsService.findAll(paginationDto);
  }

  @Get('expiring/:days')
  async findExpiringSubscriptions(@Param('days') days: string) {
    const daysNumber = parseInt(days, 10);
    return this.subscriptionsService.findExpiringSubscriptions(daysNumber);
  }

  @Get('expired')
  async findExpiredSubscriptions() {
    return this.subscriptionsService.findExpiredSubscriptions();
  }

  @Get('calculate-dates/:period')
  async calculateDates(@Param('period') period: SubscriptionPeriod, @Query('startDate') startDate?: string) {
    const start = startDate ? new Date(startDate) : undefined;
    return this.subscriptionsService.calculateSubscriptionDates(period, start);
  }

  @Get('client/:clientId')
  async findByClientId(@Param('clientId') clientId: string) {
    return this.subscriptionsService.findByClientId(clientId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.subscriptionsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    this.logger.log(`Atualização de subscrição: ${id}`, 'SubscriptionsController');
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    this.logger.log(`Ativação de subscrição: ${id}`, 'SubscriptionsController');
    return this.subscriptionsService.activateSubscription(id);
  }

  @Patch(':id/expire')
  async expire(@Param('id') id: string) {
    this.logger.log(`Expiração de subscrição: ${id}`, 'SubscriptionsController');
    return this.subscriptionsService.expireSubscription(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Remoção de subscrição: ${id}`, 'SubscriptionsController');
    return this.subscriptionsService.remove(id);
  }
}