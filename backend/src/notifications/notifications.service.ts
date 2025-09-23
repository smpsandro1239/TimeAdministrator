import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './services/email.service';
import { WhatsAppService } from './services/whatsapp.service';
import { ClientsService } from '../clients/clients.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';
import { Logger } from '../common/logger/logger.service';

@Injectable()
export class NotificationsService {
  constructor(
    private emailService: EmailService,
    private whatsAppService: WhatsAppService,
    private clientsService: ClientsService,
    private subscriptionsService: SubscriptionsService,
    private usersService: UsersService,
    private configService: ConfigService,
    private logger: Logger,
  ) {}

  // Executar todos os dias às 9:00
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkExpiringSubscriptions(): Promise<void> {
    this.logger.log('Verificação de subscrições a expirar iniciada', 'NotificationsService');

    try {
      // Verificar subscrições que expiram em 15 dias
      await this.notifyExpiringSubscriptions(15);
      
      // Verificar subscrições que expiram hoje
      await this.notifyExpiringSubscriptions(0);
      
      // Verificar subscrições expiradas
      await this.notifyExpiredSubscriptions();

    } catch (error) {
      this.logger.error('Erro na verificação de subscrições', error.stack, 'NotificationsService');
    }
  }

  async notifyExpiringSubscriptions(days: number): Promise<void> {
    const expiringClients = await this.clientsService.findExpiringSubscriptions(days);
    
    if (expiringClients.length === 0) {
      return;
    }

    this.logger.log(`Encontrados ${expiringClients.length} clientes com subscrições a expirar em ${days} dias`, 'NotificationsService');

    // Notificar cada cliente
    for (const client of expiringClients) {
      try {
        // Enviar email
        await this.emailService.sendSubscriptionExpiringEmail(
          client.email,
          client.name,
          days,
          client.subscriptionEndDate,
        );

        // Enviar WhatsApp se o telefone estiver disponível
        if (client.phone) {
          await this.whatsAppService.sendSubscriptionExpiringMessage(
            client.phone,
            client.name,
            days,
            client.subscriptionEndDate,
          );
        }

        this.logger.log(`Notificações enviadas para cliente: ${client.name}`, 'NotificationsService');
      } catch (error) {
        this.logger.error(`Erro ao notificar cliente ${client.name}`, error.stack, 'NotificationsService');
      }
    }

    // Notificar administradores
    await this.notifyAdmins(
      `Subscrições a Expirar em ${days} Dias`,
      `${expiringClients.length} cliente(s) têm subscrições a expirar em ${days} dias.`
    );
  }

  async notifyExpiredSubscriptions(): Promise<void> {
    const expiredClients = await this.clientsService.findExpiredSubscriptions();
    
    if (expiredClients.length === 0) {
      return;
    }

    this.logger.log(`Encontrados ${expiredClients.length} clientes com subscrições expiradas`, 'NotificationsService');

    // Notificar cada cliente
    for (const client of expiredClients) {
      try {
        // Enviar email
        await this.emailService.sendSubscriptionExpiredEmail(
          client.email,
          client.name,
          client.subscriptionEndDate,
        );

        // Enviar WhatsApp se o telefone estiver disponível
        if (client.phone) {
          await this.whatsAppService.sendSubscriptionExpiredMessage(
            client.phone,
            client.name,
            client.subscriptionEndDate,
          );
        }

        // Desativar o cliente
        await this.clientsService.update(client.id, { isActive: false });

        this.logger.log(`Cliente desativado e notificado: ${client.name}`, 'NotificationsService');
      } catch (error) {
        this.logger.error(`Erro ao notificar cliente expirado ${client.name}`, error.stack, 'NotificationsService');
      }
    }

    // Notificar administradores
    await this.notifyAdmins(
      'Subscrições Expiradas',
      `${expiredClients.length} cliente(s) têm subscrições expiradas e foram desativados.`
    );
  }

  async notifyAdmins(subject: string, message: string): Promise<void> {
    try {
      // Buscar todos os administradores
      const admins = await this.usersService.findAll({
        page: 1,
        limit: 100,
      });

      const adminUsers = admins.data.filter(user => user.role === UserRole.ADMIN);

      for (const admin of adminUsers) {
        try {
          // Enviar email
          await this.emailService.sendAdminNotificationEmail(
            admin.email,
            subject,
            message,
          );

          // Enviar WhatsApp se o telefone estiver disponível
          if (admin.phone) {
            await this.whatsAppService.sendAdminNotificationMessage(
              admin.phone,
              message,
            );
          }
        } catch (error) {
          this.logger.error(`Erro ao notificar admin ${admin.name}`, error.stack, 'NotificationsService');
        }
      }

      this.logger.log(`Administradores notificados: ${subject}`, 'NotificationsService');
    } catch (error) {
      this.logger.error('Erro ao notificar administradores', error.stack, 'NotificationsService');
    }
  }

  async sendCustomNotification(
    clientId: string,
    subject: string,
    message: string,
    sendEmail: boolean = true,
    sendWhatsApp: boolean = true,
  ): Promise<void> {
    try {
      const client = await this.clientsService.findById(clientId);

      if (sendEmail) {
        await this.emailService.sendEmail(client.email, subject, message);
      }

      if (sendWhatsApp && client.phone) {
        await this.whatsAppService.sendWhatsAppMessage(client.phone, message);
      }

      this.logger.log(`Notificação personalizada enviada para cliente: ${client.name}`, 'NotificationsService');
    } catch (error) {
      this.logger.error(`Erro ao enviar notificação personalizada para cliente ${clientId}`, error.stack, 'NotificationsService');
      throw error;
    }
  }
}