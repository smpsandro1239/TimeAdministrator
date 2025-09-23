import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { EmailService } from './services/email.service';
import { WhatsAppService } from './services/whatsapp.service';
import { ClientsModule } from '../clients/clients.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ClientsModule, SubscriptionsModule, UsersModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService, WhatsAppService],
  exports: [NotificationsService, EmailService, WhatsAppService],
})
export class NotificationsModule {}