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
  Request,
  Headers,
  RawBody,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreateStripePaymentDto } from './dto/stripe-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Logger } from '../common/logger/logger.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    this.logger.log(`Criação de pagamento para cliente: ${createPaymentDto.clientId}`, 'PaymentsController');
    return this.paymentsService.create(createPaymentDto);
  }

  @Post('stripe/create-intent')
  @UseGuards(JwtAuthGuard)
  async createStripePaymentIntent(@Body() createStripePaymentDto: CreateStripePaymentDto) {
    this.logger.log(`Criação de PaymentIntent Stripe para cliente: ${createStripePaymentDto.clientId}`, 'PaymentsController');
    return this.paymentsService.createStripePaymentIntent(createStripePaymentDto);
  }

  @Post('stripe/webhook')
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @RawBody() payload: Buffer,
  ) {
    return this.paymentsService.handleStripeWebhook(signature, payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.paymentsService.findAll(paginationDto);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findPendingPayments() {
    return this.paymentsService.findPendingPayments();
  }

  @Get('my-payments')
  @UseGuards(JwtAuthGuard)
  async getMyPayments(@Request() req) {
    // Cliente pode ver os seus próprios pagamentos
    const client = await this.paymentsService.findByClientId(req.user.id);
    return client;
  }

  @Get('client/:clientId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findByClientId(@Param('clientId') clientId: string) {
    return this.paymentsService.findByClientId(clientId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    this.logger.log(`Atualização de pagamento: ${id}`, 'PaymentsController');
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async approve(@Param('id') id: string, @Request() req) {
    this.logger.log(`Aprovação de pagamento: ${id} por ${req.user.id}`, 'PaymentsController');
    return this.paymentsService.approvePayment(id, req.user.id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async reject(@Param('id') id: string, @Body() body: { reason?: string }) {
    this.logger.log(`Rejeição de pagamento: ${id}`, 'PaymentsController');
    return this.paymentsService.rejectPayment(id, body.reason);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    this.logger.log(`Remoção de pagamento: ${id}`, 'PaymentsController');
    return this.paymentsService.remove(id);
  }
}