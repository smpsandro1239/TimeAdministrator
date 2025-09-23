import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreateStripePaymentDto } from './dto/stripe-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/pagination.interface';
import { PaymentStatus } from './enums/payment-status.enum';
import { PaymentMethod } from './enums/payment-method.enum';
import { ClientsService } from '../clients/clients.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Logger } from '../common/logger/logger.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private configService: ConfigService,
    private clientsService: ClientsService,
    private subscriptionsService: SubscriptionsService,
    private logger: Logger,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16',
      });
    }
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = new this.paymentModel(createPaymentDto);
    return payment.save();
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Payment>> {
    const { page, limit, search, sortBy, sortOrder } = paginationDto;
    const skip = (page - 1) * limit;

    // Construir filtro de pesquisa
    const filter: any = {};
    if (search) {
      // Pesquisar por nome do cliente (através de populate)
      const clients = await this.clientsService.findAll({ 
        page: 1, 
        limit: 1000, 
        search 
      });
      const clientIds = clients.data.map(client => client.id);
      filter.clientId = { $in: clientIds };
    }

    // Construir ordenação
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const [data, total] = await Promise.all([
      this.paymentModel
        .find(filter)
        .populate('clientId', 'name email phone')
        .populate('subscriptionId')
        .populate('approvedBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.paymentModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }  asyn
c findById(id: string): Promise<Payment> {
    const payment = await this.paymentModel
      .findById(id)
      .populate('clientId', 'name email phone')
      .populate('subscriptionId')
      .populate('approvedBy', 'name email')
      .exec();
    
    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }
    
    return payment;
  }

  async findByClientId(clientId: string): Promise<Payment[]> {
    return this.paymentModel
      .find({ clientId })
      .populate('clientId', 'name email phone')
      .populate('subscriptionId')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPendingPayments(): Promise<Payment[]> {
    return this.paymentModel
      .find({ status: PaymentStatus.PENDING })
      .populate('clientId', 'name email phone')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const updatedPayment = await this.paymentModel
      .findByIdAndUpdate(id, updatePaymentDto, { new: true })
      .populate('clientId', 'name email phone')
      .populate('subscriptionId')
      .populate('approvedBy', 'name email')
      .exec();
    
    if (!updatedPayment) {
      throw new NotFoundException('Pagamento não encontrado');
    }
    
    return updatedPayment;
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Pagamento não encontrado');
    }
  }

  async createStripePaymentIntent(createStripePaymentDto: CreateStripePaymentDto): Promise<{
    clientSecret: string;
    paymentId: string;
  }> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe não está configurado');
    }

    try {
      // Criar o pagamento na base de dados
      const payment = await this.create({
        ...createStripePaymentDto,
        method: PaymentMethod.STRIPE,
        currency: 'EUR',
      });

      // Criar o PaymentIntent no Stripe
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(createStripePaymentDto.amount * 100), // Stripe usa centavos
        currency: 'eur',
        metadata: {
          paymentId: payment.id,
          clientId: createStripePaymentDto.clientId,
          subscriptionPeriod: createStripePaymentDto.subscriptionPeriod,
        },
      });

      // Atualizar o pagamento com o ID do Stripe
      await this.paymentModel.findByIdAndUpdate(payment.id, {
        stripePaymentIntentId: paymentIntent.id,
        status: PaymentStatus.PROCESSING,
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id,
      };
    } catch (error) {
      this.logger.error('Erro ao criar PaymentIntent do Stripe', error.stack, 'PaymentsService');
      throw new BadRequestException('Erro ao processar pagamento');
    }
  }  
async handleStripeWebhook(signature: string, payload: Buffer): Promise<void> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe não está configurado');
    }

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret não configurado');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
        default:
          this.logger.log(`Evento Stripe não tratado: ${event.type}`, 'PaymentsService');
      }
    } catch (error) {
      this.logger.error('Erro ao processar webhook do Stripe', error.stack, 'PaymentsService');
      throw new BadRequestException('Erro ao processar webhook');
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const paymentId = paymentIntent.metadata.paymentId;
    const payment = await this.paymentModel.findById(paymentId);

    if (!payment) {
      this.logger.error(`Pagamento não encontrado: ${paymentId}`, '', 'PaymentsService');
      return;
    }

    // Atualizar o pagamento
    await this.paymentModel.findByIdAndUpdate(paymentId, {
      status: PaymentStatus.COMPLETED,
      paidAt: new Date(),
      receiptUrl: paymentIntent.charges?.data[0]?.receipt_url,
    });

    // Criar a subscrição
    const dates = await this.subscriptionsService.calculateSubscriptionDates(
      payment.subscriptionPeriod
    );

    const subscription = await this.subscriptionsService.create({
      clientId: payment.clientId.toString(),
      period: payment.subscriptionPeriod,
      startDate: dates.startDate.toISOString(),
      endDate: dates.endDate.toISOString(),
      renewalDate: dates.renewalDate.toISOString(),
      price: payment.amount,
    });

    // Associar a subscrição ao pagamento
    await this.paymentModel.findByIdAndUpdate(paymentId, {
      subscriptionId: subscription.id,
    });

    this.logger.log(`Pagamento processado com sucesso: ${paymentId}`, 'PaymentsService');
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const paymentId = paymentIntent.metadata.paymentId;
    
    await this.paymentModel.findByIdAndUpdate(paymentId, {
      status: PaymentStatus.FAILED,
    });

    this.logger.log(`Pagamento falhado: ${paymentId}`, 'PaymentsService');
  }

  async approvePayment(id: string, approvedBy: string): Promise<Payment> {
    const payment = await this.findById(id);
    
    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Apenas pagamentos pendentes podem ser aprovados');
    }

    // Criar a subscrição
    const dates = await this.subscriptionsService.calculateSubscriptionDates(
      payment.subscriptionPeriod
    );

    const subscription = await this.subscriptionsService.create({
      clientId: payment.clientId.toString(),
      period: payment.subscriptionPeriod,
      startDate: dates.startDate.toISOString(),
      endDate: dates.endDate.toISOString(),
      renewalDate: dates.renewalDate.toISOString(),
      price: payment.amount,
    });

    // Atualizar o pagamento
    const updatedPayment = await this.paymentModel
      .findByIdAndUpdate(
        id,
        {
          status: PaymentStatus.COMPLETED,
          paidAt: new Date(),
          approvedBy,
          approvedAt: new Date(),
          subscriptionId: subscription.id,
        },
        { new: true }
      )
      .populate('clientId', 'name email phone')
      .populate('subscriptionId')
      .populate('approvedBy', 'name email')
      .exec();

    this.logger.log(`Pagamento aprovado: ${id} por ${approvedBy}`, 'PaymentsService');
    return updatedPayment;
  }

  async rejectPayment(id: string, reason?: string): Promise<Payment> {
    const payment = await this.findById(id);
    
    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Apenas pagamentos pendentes podem ser rejeitados');
    }

    const updatedPayment = await this.paymentModel
      .findByIdAndUpdate(
        id,
        {
          status: PaymentStatus.FAILED,
          notes: reason ? `Rejeitado: ${reason}` : 'Pagamento rejeitado',
        },
        { new: true }
      )
      .populate('clientId', 'name email phone')
      .populate('subscriptionId')
      .populate('approvedBy', 'name email')
      .exec();

    this.logger.log(`Pagamento rejeitado: ${id}`, 'PaymentsService');
    return updatedPayment;
  }
}