import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Logger } from '../../common/logger/logger.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private logger: Logger,
  ) {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM'),
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email enviado para: ${to}`, 'EmailService');
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${to}`, error.stack, 'EmailService');
      throw error;
    }
  }

  async sendSubscriptionExpiringEmail(
    email: string,
    clientName: string,
    daysRemaining: number,
    expirationDate: Date,
  ): Promise<void> {
    const subject = daysRemaining === 0 
      ? 'Subscrição Expira Hoje - TimeAdministrator'
      : `Subscrição Expira em ${daysRemaining} Dias - TimeAdministrator`;

    const html = this.getExpiringSubscriptionTemplate(
      clientName,
      daysRemaining,
      expirationDate,
    );

    await this.sendEmail(email, subject, html);
  }

  async sendSubscriptionExpiredEmail(
    email: string,
    clientName: string,
    expirationDate: Date,
  ): Promise<void> {
    const subject = 'Subscrição Expirada - TimeAdministrator';
    const html = this.getExpiredSubscriptionTemplate(clientName, expirationDate);

    await this.sendEmail(email, subject, html);
  }

  async sendPaymentConfirmationEmail(
    email: string,
    clientName: string,
    amount: number,
    paymentMethod: string,
  ): Promise<void> {
    const subject = 'Pagamento Confirmado - TimeAdministrator';
    const html = this.getPaymentConfirmationTemplate(clientName, amount, paymentMethod);

    await this.sendEmail(email, subject, html);
  }

  async sendAdminNotificationEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    const html = this.getAdminNotificationTemplate(message);
    await this.sendEmail(email, `[ADMIN] ${subject}`, html);
  }

  private getExpiringSubscriptionTemplate(
    clientName: string,
    daysRemaining: number,
    expirationDate: Date,
  ): string {
    const formattedDate = expirationDate.toLocaleDateString('pt-PT');
    const urgencyClass = daysRemaining <= 3 ? 'urgent' : 'warning';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .urgent { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TimeAdministrator</h1>
            <h2>Aviso de Expiração de Subscrição</h2>
          </div>
          <div class="content">
            <p>Olá <strong>${clientName}</strong>,</p>
            
            <div class="${urgencyClass}">
              <strong>
                ${daysRemaining === 0 
                  ? '⚠️ A sua subscrição expira hoje!'
                  : `⏰ A sua subscrição expira em ${daysRemaining} dias`
                }
              </strong>
              <br>
              Data de expiração: <strong>${formattedDate}</strong>
            </div>
            
            <p>Para continuar a usufruir dos nossos serviços, por favor renove a sua subscrição o mais breve possível.</p>
            
            <p>Pode renovar a sua subscrição através da nossa plataforma ou contactando-nos diretamente.</p>
            
            <a href="${this.configService.get('FRONTEND_URL')}/client/new-subscription" class="button">
              Renovar Subscrição
            </a>
            
            <p>Se já renovou a sua subscrição, pode ignorar este email.</p>
            
            <p>Obrigado pela sua confiança!</p>
          </div>
          <div class="footer">
            <p>TimeAdministrator - Sistema de Gestão de Subscrições</p>
            <p>Este é um email automático, por favor não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getExpiredSubscriptionTemplate(
    clientName: string,
    expirationDate: Date,
  ): string {
    const formattedDate = expirationDate.toLocaleDateString('pt-PT');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: #dc3545; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .expired { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TimeAdministrator</h1>
            <h2>Subscrição Expirada</h2>
          </div>
          <div class="content">
            <p>Olá <strong>${clientName}</strong>,</p>
            
            <div class="expired">
              <strong>❌ A sua subscrição expirou em ${formattedDate}</strong>
            </div>
            
            <p>A sua conta foi temporariamente desativada. Para reativar os seus serviços, por favor renove a sua subscrição.</p>
            
            <p>Oferecemos vários planos para atender às suas necessidades:</p>
            <ul>
              <li>Plano Mensal - €29.99</li>
              <li>Plano Trimestral - €79.99 (poupança de 11%)</li>
              <li>Plano Semestral - €149.99 (poupança de 17%)</li>
              <li>Plano Anual - €279.99 (poupança de 22%)</li>
            </ul>
            
            <a href="${this.configService.get('FRONTEND_URL')}/client/new-subscription" class="button">
              Renovar Agora
            </a>
            
            <p>Se tiver alguma dúvida, não hesite em contactar-nos.</p>
          </div>
          <div class="footer">
            <p>TimeAdministrator - Sistema de Gestão de Subscrições</p>
            <p>Este é um email automático, por favor não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPaymentConfirmationTemplate(
    clientName: string,
    amount: number,
    paymentMethod: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: #28a745; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TimeAdministrator</h1>
            <h2>Pagamento Confirmado</h2>
          </div>
          <div class="content">
            <p>Olá <strong>${clientName}</strong>,</p>
            
            <div class="success">
              <strong>✅ O seu pagamento foi processado com sucesso!</strong>
            </div>
            
            <p><strong>Detalhes do pagamento:</strong></p>
            <ul>
              <li>Valor: €${amount.toFixed(2)}</li>
              <li>Método: ${paymentMethod}</li>
              <li>Data: ${new Date().toLocaleDateString('pt-PT')}</li>
            </ul>
            
            <p>A sua subscrição foi renovada e está agora ativa.</p>
            
            <p>Obrigado pela sua confiança!</p>
          </div>
          <div class="footer">
            <p>TimeAdministrator - Sistema de Gestão de Subscrições</p>
            <p>Este é um email automático, por favor não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAdminNotificationTemplate(message: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: #6c757d; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TimeAdministrator</h1>
            <h2>Notificação Administrativa</h2>
          </div>
          <div class="content">
            <p>${message}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-PT')}</p>
          </div>
          <div class="footer">
            <p>TimeAdministrator - Sistema de Gestão de Subscrições</p>
            <p>Notificação automática do sistema</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}