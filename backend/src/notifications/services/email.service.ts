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
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('SMTP_PORT', 587),
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
        from: this.configService.get<string>('SMTP_FROM', 'noreply@timeadministrator.com'),
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
    clientEmail: string,
    clientName: string,
    daysRemaining: number,
    endDate: Date,
  ): Promise<void> {
    const subject = `Subscrição a expirar em ${daysRemaining} dias`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Olá ${clientName},</h2>
        
        <p>A sua subscrição do TimeAdministrator irá expirar em <strong>${daysRemaining} dias</strong>.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Detalhes da Subscrição:</h3>
          <p><strong>Data de Expiração:</strong> ${endDate.toLocaleDateString('pt-PT')}</p>
          <p><strong>Dias Restantes:</strong> ${daysRemaining}</p>
        </div>
        
        <p>Para renovar a sua subscrição, por favor contacte-nos ou aceda à sua área de cliente.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px;">
            Este é um email automático. Por favor não responda a este email.
          </p>
        </div>
      </div>
    `;

    await this.sendEmail(clientEmail, subject, html);
  }

  async sendSubscriptionExpiredEmail(
    clientEmail: string,
    clientName: string,
    endDate: Date,
  ): Promise<void> {
    const subject = 'Subscrição Expirada - TimeAdministrator';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Olá ${clientName},</h2>
        
        <p>A sua subscrição do TimeAdministrator <strong>expirou</strong>.</p>
        
        <div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <h3 style="color: #721c24; margin-top: 0;">Subscrição Expirada</h3>
          <p><strong>Data de Expiração:</strong> ${endDate.toLocaleDateString('pt-PT')}</p>
        </div>
        
        <p>Para reativar a sua subscrição, por favor contacte-nos ou proceda ao pagamento de uma nova subscrição.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px;">
            Este é um email automático. Por favor não responda a este email.
          </p>
        </div>
      </div>
    `;

    await this.sendEmail(clientEmail, subject, html);
  }

  async sendAdminNotificationEmail(
    adminEmail: string,
    subject: string,
    message: string,
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Notificação do Sistema</h2>
        
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p>${message}</p>
        </div>
        
        <p>Aceda ao painel de administração para mais detalhes.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px;">
            TimeAdministrator - Sistema de Gestão de Subscrições
          </p>
        </div>
      </div>
    `;

    await this.sendEmail(adminEmail, subject, html);
  }
}