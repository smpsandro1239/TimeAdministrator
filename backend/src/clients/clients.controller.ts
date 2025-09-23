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
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Logger } from '../common/logger/logger.service';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createClientDto: CreateClientDto) {
    this.logger.log(`Criação de cliente: ${createClientDto.email}`, 'ClientsController');
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.clientsService.findAll(paginationDto);
  }

  @Get('my-profile')
  async getMyProfile(@Request() req) {
    // Cliente pode ver o seu próprio perfil
    const client = await this.clientsService.findByUserId(req.user.id);
    if (!client) {
      return { message: 'Perfil de cliente não encontrado' };
    }
    return client;
  }

  @Get('expiring/:days')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findExpiringSubscriptions(@Param('days') days: string) {
    const daysNumber = parseInt(days, 10);
    return this.clientsService.findExpiringSubscriptions(daysNumber);
  }

  @Get('expired')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findExpiredSubscriptions() {
    return this.clientsService.findExpiredSubscriptions();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    this.logger.log(`Atualização de cliente: ${id}`, 'ClientsController');
    return this.clientsService.update(id, updateClientDto);
  }

  @Patch(':id/subscription')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateSubscription(
    @Param('id') id: string,
    @Body() body: { startDate: string; endDate: string; renewalDate: string }
  ) {
    this.logger.log(`Atualização de subscrição para cliente: ${id}`, 'ClientsController');
    return this.clientsService.updateSubscription(
      id,
      new Date(body.startDate),
      new Date(body.endDate),
      new Date(body.renewalDate)
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    this.logger.log(`Remoção de cliente: ${id}`, 'ClientsController');
    return this.clientsService.remove(id);
  }
}