import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription, SubscriptionDocument } from './schemas/subscription.schema';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/pagination.interface';
import { SubscriptionPeriod, SubscriptionPeriodMonths } from './enums/subscription-period.enum';
import { SubscriptionStatus } from './enums/subscription-status.enum';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    private clientsService: ClientsService,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = new this.subscriptionModel(createSubscriptionDto);
    const savedSubscription = await subscription.save();

    // Atualizar o cliente com as datas da subscrição
    await this.clientsService.updateSubscription(
      createSubscriptionDto.clientId,
      new Date(createSubscriptionDto.startDate),
      new Date(createSubscriptionDto.endDate),
      new Date(createSubscriptionDto.renewalDate)
    );

    return savedSubscription;
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Subscription>> {
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
      const clientIds = clients.data.map(client => (client as any).id);
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
      this.subscriptionModel
        .find(filter)
        .populate('clientId', 'name email phone')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.subscriptionModel.countDocuments(filter).exec(),
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
  }

  async findById(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findById(id)
      .populate('clientId', 'name email phone')
      .exec();
    
    if (!subscription) {
      throw new NotFoundException('Subscrição não encontrada');
    }
    
    return subscription;
  }

  async findByClientId(clientId: string): Promise<Subscription[]> {
    return this.subscriptionModel
      .find({ clientId })
      .populate('clientId', 'name email phone')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    const updatedSubscription = await this.subscriptionModel
      .findByIdAndUpdate(id, updateSubscriptionDto, { new: true })
      .populate('clientId', 'name email phone')
      .exec();
    
    if (!updatedSubscription) {
      throw new NotFoundException('Subscrição não encontrada');
    }

    // Se atualizou as datas, atualizar também no cliente
    if (updateSubscriptionDto.startDate || updateSubscriptionDto.endDate || updateSubscriptionDto.renewalDate) {
      await this.clientsService.updateSubscription(
        updatedSubscription.clientId.toString(),
        updateSubscriptionDto.startDate ? new Date(updateSubscriptionDto.startDate) : updatedSubscription.startDate,
        updateSubscriptionDto.endDate ? new Date(updateSubscriptionDto.endDate) : updatedSubscription.endDate,
        updateSubscriptionDto.renewalDate ? new Date(updateSubscriptionDto.renewalDate) : updatedSubscription.renewalDate
      );
    }
    
    return updatedSubscription;
  }

  async remove(id: string): Promise<void> {
    const result = await this.subscriptionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Subscrição não encontrada');
    }
  }

  async findExpiringSubscriptions(days: number): Promise<Subscription[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    
    return this.subscriptionModel
      .find({
        endDate: {
          $lte: targetDate,
          $gte: new Date(),
        },
        status: SubscriptionStatus.ACTIVE,
      })
      .populate('clientId', 'name email phone')
      .exec();
  }

  async findExpiredSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionModel
      .find({
        endDate: { $lt: new Date() },
        status: SubscriptionStatus.ACTIVE,
      })
      .populate('clientId', 'name email phone')
      .exec();
  }

  async calculateSubscriptionDates(period: SubscriptionPeriod, startDate?: Date): Promise<{
    startDate: Date;
    endDate: Date;
    renewalDate: Date;
  }> {
    const start = startDate || new Date();
    const months = SubscriptionPeriodMonths[period];
    
    const end = new Date(start);
    end.setMonth(end.getMonth() + months);
    
    // Data de renovação é 7 dias antes do fim
    const renewal = new Date(end);
    renewal.setDate(renewal.getDate() - 7);
    
    return {
      startDate: start,
      endDate: end,
      renewalDate: renewal,
    };
  }

  async activateSubscription(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findByIdAndUpdate(
        id,
        { status: SubscriptionStatus.ACTIVE },
        { new: true }
      )
      .populate('clientId', 'name email phone')
      .exec();
    
    if (!subscription) {
      throw new NotFoundException('Subscrição não encontrada');
    }
    
    return subscription;
  }

  async expireSubscription(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findByIdAndUpdate(
        id,
        { status: SubscriptionStatus.EXPIRED },
        { new: true }
      )
      .populate('clientId', 'name email phone')
      .exec();
    
    if (!subscription) {
      throw new NotFoundException('Subscrição não encontrada');
    }
    
    return subscription;
  }
}