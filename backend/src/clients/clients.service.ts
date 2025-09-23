import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/pagination.interface';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Verificar se já existe um cliente com este email
    const existingClient = await this.clientModel.findOne({ 
      email: createClientDto.email 
    }).exec();
    
    if (existingClient) {
      throw new ConflictException('Já existe um cliente com este email');
    }

    const createdClient = new this.clientModel(createClientDto);
    return createdClient.save();
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Client>> {
    const { page, limit, search, sortBy, sortOrder } = paginationDto;
    const skip = (page - 1) * limit;

    // Construir filtro de pesquisa
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Construir ordenação
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const [data, total] = await Promise.all([
      this.clientModel
        .find(filter)
        .populate('userId', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.clientModel.countDocuments(filter).exec(),
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

  async findById(id: string): Promise<Client> {
    const client = await this.clientModel
      .findById(id)
      .populate('userId', 'name email')
      .exec();
    
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }
    
    return client;
  }

  async findByEmail(email: string): Promise<Client> {
    return this.clientModel.findOne({ email }).exec();
  }

  async findByUserId(userId: string): Promise<Client> {
    return this.clientModel.findOne({ userId }).exec();
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    // Se está a atualizar o email, verificar se não existe outro cliente com o mesmo
    if (updateClientDto.email) {
      const existingClient = await this.clientModel.findOne({
        email: updateClientDto.email,
        _id: { $ne: id }
      }).exec();
      
      if (existingClient) {
        throw new ConflictException('Já existe um cliente com este email');
      }
    }

    const updatedClient = await this.clientModel
      .findByIdAndUpdate(id, updateClientDto, { new: true })
      .populate('userId', 'name email')
      .exec();
    
    if (!updatedClient) {
      throw new NotFoundException('Cliente não encontrado');
    }
    
    return updatedClient;
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Cliente não encontrado');
    }
  }

  async findExpiringSubscriptions(days: number): Promise<Client[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    
    return this.clientModel.find({
      subscriptionEndDate: {
        $lte: targetDate,
        $gte: new Date(),
      },
      isActive: true,
    }).exec();
  }

  async findExpiredSubscriptions(): Promise<Client[]> {
    return this.clientModel.find({
      subscriptionEndDate: { $lt: new Date() },
      isActive: true,
    }).exec();
  }

  async updateSubscription(
    id: string, 
    startDate: Date, 
    endDate: Date, 
    renewalDate: Date
  ): Promise<Client> {
    const updatedClient = await this.clientModel
      .findByIdAndUpdate(
        id,
        {
          subscriptionStartDate: startDate,
          subscriptionEndDate: endDate,
          nextRenewalDate: renewalDate,
          isActive: true,
        },
        { new: true }
      )
      .exec();
    
    if (!updatedClient) {
      throw new NotFoundException('Cliente não encontrado');
    }
    
    return updatedClient;
  }
}