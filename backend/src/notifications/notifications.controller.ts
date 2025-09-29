import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailService } from './services/email.service';
import { WhatsAppService } from './services/whatsapp.service';
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
    private readonly emailService: EmailService,
    private readonly whatsAppService: WhatsAppService,
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

  @Post('test-email')
  async testEmail(@Body() body: {
    email: string;
    subject: string;
    message: string;
  }) {
    this.logger.log(`Teste de email para: ${body.email}`, 'NotificationsController');
    
    await this.emailService.sendEmail(body.email, body.subject, body.message);
    
    return { message: 'Email de teste enviado com sucesso' };
  }

  @Get('status')
  getNotificationStatus() {
    return {
      email: {
        configured: !!process.env.SMTP_HOST && !!process.env.SMTP_USER,
        host: process.env.SMTP_HOST || 'Não configurado',
        user: process.env.SMTP_USER || 'Não configurado',
      },
      whatsapp: {
        configured: !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN,
        from: process.env.TWILIO_WHATSAPP_FROM || 'Não configurado',
      },
      cronJobs: {
        enabled: true,
        schedule: 'Todos os dias às 9:00',
      },
    };
  }
}