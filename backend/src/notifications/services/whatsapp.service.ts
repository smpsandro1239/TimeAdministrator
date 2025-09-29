import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { Logger } from '../../common/logger/logger.service';

@Injectable()
export class WhatsAppService {
  private twilioClient: Twilio;
  private whatsappFrom: string;

  constructor(
    private configService: ConfigService,
    private logger: Logger,
  ) {
    this.initializeTwilio();
  }

  private initializeTwilio(): void {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.whatsappFrom = this.configService.get<string>('TWILIO_WHATSAPP_FROM');

    if (accountSid && authToken) {
      this.twilioClient = new Twilio(accountSid, authToken);
    } else {
      this.logger.warn('Credenciais do Twilio não configuradas', 'WhatsAppService');
    }
  }

  async sendWhatsAppMessage(to: string, message: string): Promise<void> {
    if (!this.twilioClient) {
      this.logger.warn('Twilio não configurado, mensagem não enviada', 'WhatsAppService');
      return;
    }

    try {
      // Formatar número para WhatsApp (deve começar com whatsapp:)
      const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

      await this.twilioClient.messages.create({
        from: this.whatsappFrom,
        to: formattedTo,
        body: message,
      });

      this.logger.log(`WhatsApp enviado para: ${to}`, 'WhatsAppService');
    } catch (error) {
      this.logger.error(`Erro ao enviar WhatsApp para ${to}`, error.stack, 'WhatsAppService');
      throw error;
    }
  }

  async sendSubscriptionExpiringMessage(
    phone: string,
    clientName: string,
    daysRemaining: number,
    expirationDate: Date,
  ): Promise<void> {
    const formattedDate = expirationDate.toLocaleDateString('pt-PT');
    
    let message: string;
    if (daysRemaining === 0) {
      message = `🚨 *TimeAdministrator*\n\nOlá ${clientName}!\n\n⚠️ A sua subscrição *expira hoje* (${formattedDate}).\n\nPara continuar a usufruir dos nossos serviços, renove a sua subscrição o mais breve possível.\n\nObrigado pela sua confiança! 🙏`;
    } else {
      message = `⏰ *TimeAdministrator*\n\nOlá ${clientName}!\n\nA sua subscrição expira em *${daysRemaining} dias* (${formattedDate}).\n\nLembre-se de renovar para continuar a usufruir dos nossos serviços.\n\nObrigado! 😊`;
    }

    await this.sendWhatsAppMessage(phone, message);
  }

  async sendSubscriptionExpiredMessage(
    phone: string,
    clientName: string,
    expirationDate: Date,
  ): Promise<void> {
    const formattedDate = expirationDate.toLocaleDateString('pt-PT');
    
    const message = `❌ *TimeAdministrator*\n\nOlá ${clientName}!\n\nA sua subscrição expirou em ${formattedDate} e a sua conta foi temporariamente desativada.\n\nPara reativar os seus serviços, por favor renove a sua subscrição.\n\n💡 *Planos disponíveis:*\n• Mensal - €29.99\n• Trimestral - €79.99 (11% desconto)\n• Semestral - €149.99 (17% desconto)\n• Anual - €279.99 (22% desconto)\n\nRenove agora e continue a usufruir dos nossos serviços! 🚀`;

    await this.sendWhatsAppMessage(phone, message);
  }

  async sendPaymentConfirmationMessage(
    phone: string,
    clientName: string,
    amount: number,
    paymentMethod: string,
  ): Promise<void> {
    const message = `✅ *TimeAdministrator*\n\nOlá ${clientName}!\n\nO seu pagamento foi processado com sucesso! 🎉\n\n💰 *Detalhes:*\n• Valor: €${amount.toFixed(2)}\n• Método: ${paymentMethod}\n• Data: ${new Date().toLocaleDateString('pt-PT')}\n\nA sua subscrição foi renovada e está agora ativa.\n\nObrigado pela sua confiança! 🙏`;

    await this.sendWhatsAppMessage(phone, message);
  }

  async sendAdminNotificationMessage(
    phone: string,
    message: string,
  ): Promise<void> {
    const adminMessage = `🔔 *TimeAdministrator - Admin*\n\n${message}\n\n📅 ${new Date().toLocaleString('pt-PT')}`;
    await this.sendWhatsAppMessage(phone, adminMessage);
  }

  async sendWelcomeMessage(
    phone: string,
    clientName: string,
  ): Promise<void> {
    const message = `🎉 *Bem-vindo ao TimeAdministrator!*\n\nOlá ${clientName}!\n\nA sua conta foi criada com sucesso. Estamos muito felizes por tê-lo connosco! 😊\n\nPode agora:\n• Gerir a sua subscrição\n• Ver o histórico de pagamentos\n• Atualizar os seus dados\n\nSe tiver alguma dúvida, não hesite em contactar-nos.\n\nObrigado pela sua confiança! 🚀`;

    await this.sendWhatsAppMessage(phone, message);
  }
}