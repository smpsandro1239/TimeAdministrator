import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'whatsapp';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationHistory {
  id: string;
  templateId: string;
  templateName: string;
  type: 'email' | 'whatsapp';
  recipient: string;
  recipientName: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  subject?: string;
  content: string;
  sentAt: Date;
  deliveredAt?: Date;
  errorMessage?: string;
}

export interface NotificationStats {
  totalSent: number;
  delivered: number;
  failed: number;
  pending: number;
  deliveryRate: number;
  lastSent?: Date;
}

export interface NotificationSchedule {
  id: string;
  name: string;
  templateId: string;
  type: 'email' | 'whatsapp';
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  isActive: boolean;
  lastRun?: Date;
  nextRun: Date;
  recipients: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  // Templates
  getTemplates(): Observable<NotificationTemplate[]> {
    // Mock data para demonstração
    const mockTemplates: NotificationTemplate[] = [
      {
        id: '1',
        name: 'Lembrete de Expiração - 15 dias',
        type: 'email',
        subject: 'A sua subscrição expira em 15 dias',
        content: 'Olá {{clientName}}, a sua subscrição do plano {{planName}} expira em 15 dias. Renove já para continuar a usufruir dos nossos serviços.',
        variables: ['clientName', 'planName', 'expirationDate'],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Lembrete de Expiração - 3 dias',
        type: 'email',
        subject: 'URGENTE: A sua subscrição expira em 3 dias',
        content: 'Olá {{clientName}}, a sua subscrição expira em apenas 3 dias! Não perca o acesso aos nossos serviços.',
        variables: ['clientName', 'planName', 'expirationDate'],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '3',
        name: 'Bem-vindo',
        type: 'email',
        subject: 'Bem-vindo ao TimeAdministrator!',
        content: 'Olá {{clientName}}, bem-vindo ao TimeAdministrator! A sua subscrição do plano {{planName}} está activa.',
        variables: ['clientName', 'planName'],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '4',
        name: 'WhatsApp - Expiração',
        type: 'whatsapp',
        content: 'Olá {{clientName}}! A sua subscrição expira em {{daysLeft}} dias. Renove em: {{renewLink}}',
        variables: ['clientName', 'daysLeft', 'renewLink'],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    return of(mockTemplates);
  }

  createTemplate(template: Partial<NotificationTemplate>): Observable<NotificationTemplate> {
    return this.http.post<NotificationTemplate>(`${this.apiUrl}/templates`, template);
  }

  updateTemplate(id: string, template: Partial<NotificationTemplate>): Observable<NotificationTemplate> {
    return this.http.put<NotificationTemplate>(`${this.apiUrl}/templates/${id}`, template);
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/templates/${id}`);
  }

  // Histórico
  getHistory(type?: 'email' | 'whatsapp', limit = 50): Observable<NotificationHistory[]> {
    const mockHistory: NotificationHistory[] = [
      {
        id: '1',
        templateId: '1',
        templateName: 'Lembrete de Expiração - 15 dias',
        type: 'email',
        recipient: 'joao.silva@email.com',
        recipientName: 'João Silva',
        status: 'delivered',
        subject: 'A sua subscrição expira em 15 dias',
        content: 'Olá João Silva, a sua subscrição do plano Mensal expira em 15 dias.',
        sentAt: new Date('2024-01-15T09:30:00'),
        deliveredAt: new Date('2024-01-15T09:31:00')
      },
      {
        id: '2',
        templateId: '3',
        templateName: 'Bem-vindo',
        type: 'email',
        recipient: 'maria.santos@email.com',
        recipientName: 'Maria Santos',
        status: 'delivered',
        subject: 'Bem-vindo ao TimeAdministrator!',
        content: 'Olá Maria Santos, bem-vindo ao TimeAdministrator!',
        sentAt: new Date('2024-01-14T15:45:00'),
        deliveredAt: new Date('2024-01-14T15:46:00')
      },
      {
        id: '3',
        templateId: '4',
        templateName: 'WhatsApp - Expiração',
        type: 'whatsapp',
        recipient: '+351912345678',
        recipientName: 'Pedro Costa',
        status: 'delivered',
        content: 'Olá Pedro Costa! A sua subscrição expira em 5 dias.',
        sentAt: new Date('2024-01-14T10:15:00'),
        deliveredAt: new Date('2024-01-14T10:16:00')
      },
      {
        id: '4',
        templateId: '1',
        templateName: 'Lembrete de Expiração - 15 dias',
        type: 'email',
        recipient: 'ana.ferreira@email.com',
        recipientName: 'Ana Ferreira',
        status: 'failed',
        subject: 'A sua subscrição expira em 15 dias',
        content: 'Olá Ana Ferreira, a sua subscrição do plano Anual expira em 15 dias.',
        sentAt: new Date('2024-01-13T09:30:00'),
        errorMessage: 'Email address not found'
      }
    ];

    const filtered = type ? mockHistory.filter(h => h.type === type) : mockHistory;
    return of(filtered.slice(0, limit));
  }

  // Estatísticas
  getStats(type?: 'email' | 'whatsapp'): Observable<NotificationStats> {
    const mockStats: NotificationStats = {
      totalSent: type === 'email' ? 156 : type === 'whatsapp' ? 89 : 245,
      delivered: type === 'email' ? 142 : type === 'whatsapp' ? 85 : 227,
      failed: type === 'email' ? 14 : type === 'whatsapp' ? 4 : 18,
      pending: 0,
      deliveryRate: type === 'email' ? 91.0 : type === 'whatsapp' ? 95.5 : 92.7,
      lastSent: new Date('2024-01-15T09:30:00')
    };

    return of(mockStats);
  }

  // Envio manual
  sendNotification(templateId: string, recipients: string[]): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/send`, {
      templateId,
      recipients
    });
  }

  // Agendamentos
  getSchedules(): Observable<NotificationSchedule[]> {
    const mockSchedules: NotificationSchedule[] = [
      {
        id: '1',
        name: 'Lembretes Diários de Expiração',
        templateId: '1',
        type: 'email',
        frequency: 'daily',
        time: '09:00',
        isActive: true,
        lastRun: new Date('2024-01-15T09:00:00'),
        nextRun: new Date('2024-01-16T09:00:00'),
        recipients: ['all_expiring']
      },
      {
        id: '2',
        name: 'WhatsApp Semanal',
        templateId: '4',
        type: 'whatsapp',
        frequency: 'weekly',
        time: '10:00',
        isActive: true,
        nextRun: new Date('2024-01-22T10:00:00'),
        recipients: ['all_expiring']
      }
    ];

    return of(mockSchedules);
  }

  createSchedule(schedule: Partial<NotificationSchedule>): Observable<NotificationSchedule> {
    return this.http.post<NotificationSchedule>(`${this.apiUrl}/schedules`, schedule);
  }

  updateSchedule(id: string, schedule: Partial<NotificationSchedule>): Observable<NotificationSchedule> {
    return this.http.put<NotificationSchedule>(`${this.apiUrl}/schedules/${id}`, schedule);
  }

  deleteSchedule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/schedules/${id}`);
  }

  // Teste de configuração
  testEmailConfig(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/test/email`, {});
  }

  testWhatsAppConfig(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/test/whatsapp`, {});
  }
}