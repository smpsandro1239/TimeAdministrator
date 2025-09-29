import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { NotificationService } from '../../../services/notification.service';

interface NotificationStatus {
  email: {
    configured: boolean;
    host: string;
  };
  whatsapp: {
    configured: boolean;
    from: string;
  };
}

interface NotificationHistoryItem {
  type: 'email' | 'whatsapp' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  loading = false;
  notificationStatus: NotificationStatus | null = null;
  notificationHistory: NotificationHistoryItem[] = [];

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadNotificationStatus();
    this.loadNotificationHistory();
  }

  loadNotificationStatus(): void {
    this.notificationService.getNotificationStatus().subscribe({
      next: (status) => {
        this.notificationStatus = status;
      },
      error: (error) => {
        console.error('Erro ao carregar status das notificações:', error);
      }
    });
  }

  loadNotificationHistory(): void {
    this.notificationHistory = [
      {
        type: 'system',
        title: 'Verificação Automática',
        description: '5 clientes notificados sobre expiração em 15 dias',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'success'
      },
      {
        type: 'email',
        title: 'Email de Teste',
        description: 'Email enviado para admin@timeadministrator.com',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: 'success'
      },
      {
        type: 'whatsapp',
        title: 'Notificação WhatsApp',
        description: 'Mensagem enviada para cliente João Silva',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'success'
      }
    ];
  }

  checkExpiringSubscriptions(): void {
    this.loading = true;
    this.notificationService.checkExpiringSubscriptions().subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.open(response.message, 'Fechar', { duration: 5000 });
        this.loadNotificationHistory();
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Erro ao verificar subscrições', 'Fechar', { duration: 5000 });
      }
    });
  }

  openTestEmailDialog(): void {
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  openCustomNotificationDialog(): void {
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  openAdminNotificationDialog(): void {
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  getHistoryIcon(type: string): string {
    switch (type) {
      case 'email': return 'email';
      case 'whatsapp': return 'chat';
      case 'system': return 'settings';
      default: return 'notifications';
    }
  }

  getHistoryIconClass(type: string): string {
    return type;
  }

  getStatusChipClass(status: string): string {
    return status;
  }
}
