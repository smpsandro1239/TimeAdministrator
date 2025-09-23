import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { Logger } from '../common/logger/logger.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly logger: Logger,
  ) {}

  @Post('check-expiring')
  async checkExpiringSubscriptions() {
    this.logger.log('Verificação manual de subscrições a expirar', 'NotificationsController');
    await this.notificationsService.checkExpiringSubscriptions();
    return { message: 'Verificação de subscrições concluída' };
  }

  @Post('send-custom')
  async sendCustomNotification(@Body() body: {
    clientId: string;
    subject: string;
    message: string;
    sendEmail?: boolean;
    sendWhatsApp?: boolean;
  }) {
    this.logger.log(`Envio de notificação personalizada para cliente: ${body.clientId}`, 'NotificationsController');
    
    await this.notificationsService.sendCustomNotification(
      body.clientId,
      body.subject,
      body.message,
      body.sendEmail,
      body.sendWhatsApp,
    );

    return { message: 'Notificação enviada com sucesso' };
  }

  @Post('notify-admins')
  async notifyAdmins(@Body() body: {
    subject: string;
    message: string;
  }) {
    this.logger.log(`Notificação para administradores: ${body.subject}`, 'NotificationsController');
    
    await this.notificationsService.notifyAdmins(body.subject, body.message);
    
    return { message: 'Administradores notificados com sucesso' };
  }
}