import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { Logger } from '../../common/logger/logger.service';

@Injectable()
export class WhatsAppService {
  private client: Twilio;
  private fromNumber: string;

  constructor(
    private configService: ConfigService,
    private logger: Logger,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.fromNumber = this.configService.get<string>('TWILIO_WHATSAPP_FROM', 'whatsapp:+14155238886');

    if (accountSid && authToken) {
      this.client = new Twilio(accountSid, authToken);
    }
  }

  async sendWhatsAppMessage(to: string, message: string): Promise<void> {
    if (!this.client) {
      this.logger.warn('Twilio não está configurado, mensagem WhatsApp não enviada', 'WhatsAppService');
      return;
    }

    try {
      // Garantir que o número tem o formato correto
      const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

      await this.client.messages.create({
        from: this.fromNumber,
        to: formattedTo,
        body: message,
      });

      this.logger.log(`Mensagem WhatsApp enviada para: ${to}`, 'WhatsAppService');
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem WhatsApp para ${to}`, error.stack, 'WhatsAppService');
      throw error;
    }
  }

  async sendSubscriptionExpiringMessage(
    clientPhone: string,
    clientName: string,
    daysRemaining: number,
    endDate: Date,
  ): Promise<void> {
    const message = `
Olá ${clientName}! 👋

A sua subscrição do TimeAdministrator irá expirar em *${daysRemaining} dias*.

📅 Data de Expiração: ${endDate.toLocaleDateString('pt-PT')}
⏰ Dias Restantes: ${daysRemaining}

Para renovar a sua subscrição, por favor contacte-nos.

TimeAdministrator
    `.trim();

    await this.sendWhatsAppMessage(clientPhone, message);
  }

  async sendSubscriptionExpiredMessage(
    clientPhone: string,
    clientName: string,
    endDate: Date,
  ): Promise<void> {
    const message = `
Olá ${clientName}! 👋

A sua subscrição do TimeAdministrator *expirou*.

📅 Data de Expiração: ${endDate.toLocaleDateString('pt-PT')}
❌ Estado: Expirada

Para reativar a sua subscrição, por favor contacte-nos.

TimeAdministrator
    `.trim();

    await this.sendWhatsAppMessage(clientPhone, message);
  }

  async sendAdminNotificationMessage(
    adminPhone: string,
    message: string,
  ): Promise<void> {
    const formattedMessage = `
🔔 *Notificação do Sistema*

${message}

TimeAdministrator - Admin
    `.trim();

    await this.sendWhatsAppMessage(adminPhone, formattedMessage);
  }
}