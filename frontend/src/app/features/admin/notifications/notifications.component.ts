import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { 
  NotificationsService, 
  NotificationTemplate, 
  NotificationHistory, 
  NotificationStats,
  NotificationSchedule 
} from '../../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, 
    MatTabsModule, MatTableModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, MatSlideToggleModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule, LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="container">
        <div class="header">
          <div>
            <h1>Sistema de Notificações</h1>
            <p>Gestão completa de emails e WhatsApp automáticos</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="accent" (click)="testConnections()">
              <mat-icon>wifi</mat-icon>
              Testar Ligações
            </button>
            <button mat-raised-button color="primary" (click)="createTemplate()">
              <mat-icon>add</mat-icon>
              Novo Template
            </button>
          </div>
        </div>

        <mat-tab-group [(selectedIndex)]="selectedTab" (selectedTabChange)="onTabChange($event)">
          <!-- Dashboard -->
          <mat-tab label="Dashboard">
            <div class="tab-content">
              <div class="stats-grid">
                <mat-card class="stat-card email">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon>email</mat-icon>
                      <span class="stat-label">Emails</span>
                    </div>
                    <div class="stat-value">{{ emailStats.totalSent }}</div>
                    <div class="stat-details">
                      <div class="stat-item">
                        <span class="success">{{ emailStats.delivered }} entregues</span>
                        <span class="rate">({{ emailStats.deliveryRate }}%)</span>
                      </div>
                      <div class="stat-item">
                        <span class="error">{{ emailStats.failed }} falharam</span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card whatsapp">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon>chat</mat-icon>
                      <span class="stat-label">WhatsApp</span>
                    </div>
                    <div class="stat-value">{{ whatsappStats.totalSent }}</div>
                    <div class="stat-details">
                      <div class="stat-item">
                        <span class="success">{{ whatsappStats.delivered }} entregues</span>
                        <span class="rate">({{ whatsappStats.deliveryRate }}%)</span>
                      </div>
                      <div class="stat-item">
                        <span class="error">{{ whatsappStats.failed }} falharam</span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card total">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon>notifications</mat-icon>
                      <span class="stat-label">Total</span>
                    </div>
                    <div class="stat-value">{{ totalStats.totalSent }}</div>
                    <div class="stat-details">
                      <div class="stat-item">
                        <span class="success">{{ totalStats.delivered }} entregues</span>
                        <span class="rate">({{ totalStats.deliveryRate }}%)</span>
                      </div>
                      <div class="stat-item">
                        <span class="error">{{ totalStats.failed }} falharam</span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>

              <div class="dashboard-grid">
                <mat-card class="recent-notifications">
                  <mat-card-header>
                    <mat-card-title>Notificações Recentes</mat-card-title>
                    <button mat-icon-button (click)="refreshHistory()">
                      <mat-icon>refresh</mat-icon>
                    </button>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="notification-list" *ngIf="recentHistory.length > 0; else noHistory">
                      <div class="notification-item" *ngFor="let notification of recentHistory">
                        <div class="notification-icon">
                          <mat-icon [ngClass]="notification.type">
                            {{ notification.type === 'email' ? 'email' : 'chat' }}
                          </mat-icon>
                        </div>
                        <div class="notification-content">
                          <div class="notification-title">{{ notification.templateName }}</div>
                          <div class="notification-recipient">{{ notification.recipientName }}</div>
                          <div class="notification-time">{{ notification.sentAt | date:'dd/MM/yyyy HH:mm' }}</div>
                        </div>
                        <div class="notification-status">
                          <span class="status-chip" [ngClass]="notification.status">
                            {{ getStatusText(notification.status) }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ng-template #noHistory>
                      <div class="empty-state">
                        <mat-icon>notifications_none</mat-icon>
                        <p>Nenhuma notificação enviada recentemente</p>
                      </div>
                    </ng-template>
                  </mat-card-content>
                </mat-card>

                <mat-card class="active-schedules">
                  <mat-card-header>
                    <mat-card-title>Agendamentos Activos</mat-card-title>
                    <button mat-icon-button (click)="createSchedule()">
                      <mat-icon>add</mat-icon>
                    </button>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="schedule-list" *ngIf="activeSchedules.length > 0; else noSchedules">
                      <div class="schedule-item" *ngFor="let schedule of activeSchedules">
                        <div class="schedule-info">
                          <div class="schedule-name">{{ schedule.name }}</div>
                          <div class="schedule-details">
                            <span class="frequency-chip">{{ getFrequencyText(schedule.frequency) }}</span>
                            <span class="time">{{ schedule.time }}</span>
                          </div>
                          <div class="schedule-next">
                            Próxima execução: {{ schedule.nextRun | date:'dd/MM/yyyy HH:mm' }}
                          </div>
                        </div>
                        <div class="schedule-actions">
                          <mat-slide-toggle 
                            [checked]="schedule.isActive"
                            (change)="toggleSchedule(schedule.id, $event.checked)">
                          </mat-slide-toggle>
                        </div>
                      </div>
                    </div>
                    <ng-template #noSchedules>
                      <div class="empty-state">
                        <mat-icon>schedule</mat-icon>
                        <p>Nenhum agendamento configurado</p>
                      </div>
                    </ng-template>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Templates -->
          <mat-tab label="Templates">
            <div class="tab-content">
              <div class="templates-header">
                <div class="templates-filters">
                  <mat-form-field appearance="outline">
                    <mat-label>Filtrar por tipo</mat-label>
                    <mat-select [(value)]="templateFilter" (selectionChange)="filterTemplates()">
                      <mat-option value="all">Todos</mat-option>
                      <mat-option value="email">Email</mat-option>
                      <mat-option value="whatsapp">WhatsApp</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
                <button mat-raised-button color="primary" (click)="createTemplate()">
                  <mat-icon>add</mat-icon>
                  Novo Template
                </button>
              </div>

              <div class="templates-grid">
                <mat-card class="template-card" *ngFor="let template of filteredTemplates">
                  <mat-card-header>
                    <div class="template-header">
                      <mat-icon [ngClass]="template.type">
                        {{ template.type === 'email' ? 'email' : 'chat' }}
                      </mat-icon>
                      <div class="template-info">
                        <mat-card-title>{{ template.name }}</mat-card-title>
                        <mat-card-subtitle>{{ template.type === 'email' ? 'Email' : 'WhatsApp' }}</mat-card-subtitle>
                      </div>
                    </div>
                    <div class="template-actions">
                      <mat-slide-toggle 
                        [checked]="template.isActive"
                        (change)="toggleTemplate(template.id, $event.checked)"
                        matTooltip="Activar/Desactivar template">
                      </mat-slide-toggle>
                    </div>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="template-subject" *ngIf="template.subject">
                      <strong>Assunto:</strong> {{ template.subject }}
                    </div>
                    <div class="template-content">
                      {{ template.content | slice:0:100 }}{{ template.content.length > 100 ? '...' : '' }}
                    </div>
                    <div class="template-variables" *ngIf="template.variables.length > 0">
                      <strong>Variáveis:</strong>
                      <div class="variables-list">
                        <span class="variable-chip" *ngFor="let variable of template.variables">
                          {{ '{{' + variable + '}}' }}
                        </span>
                      </div>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="editTemplate(template)">
                      <mat-icon>edit</mat-icon>
                      Editar
                    </button>
                    <button mat-button (click)="sendTestNotification(template)">
                      <mat-icon>send</mat-icon>
                      Testar
                    </button>
                    <button mat-button color="warn" (click)="deleteTemplate(template.id)">
                      <mat-icon>delete</mat-icon>
                      Eliminar
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Histórico -->
          <mat-tab label="Histórico">
            <div class="tab-content">
              <div class="history-filters">
                <mat-form-field appearance="outline">
                  <mat-label>Tipo</mat-label>
                  <mat-select [(value)]="historyFilter" (selectionChange)="filterHistory()">
                    <mat-option value="all">Todos</mat-option>
                    <mat-option value="email">Email</mat-option>
                    <mat-option value="whatsapp">WhatsApp</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Estado</mat-label>
                  <mat-select [(value)]="statusFilter" (selectionChange)="filterHistory()">
                    <mat-option value="all">Todos</mat-option>
                    <mat-option value="delivered">Entregues</mat-option>
                    <mat-option value="failed">Falharam</mat-option>
                    <mat-option value="pending">Pendentes</mat-option>
                  </mat-select>
                </mat-form-field>

                <button mat-raised-button (click)="exportHistory()">
                  <mat-icon>download</mat-icon>
                  Exportar
                </button>
              </div>

              <mat-card class="history-table">
                <!-- Desktop Table -->
                <div class="desktop-table">
                  <table mat-table [dataSource]="filteredHistory" class="notification-history-table">
                    <ng-container matColumnDef="type">
                      <th mat-header-cell *matHeaderCellDef>Tipo</th>
                      <td mat-cell *matCellDef="let notification">
                        <mat-icon [ngClass]="notification.type">
                          {{ notification.type === 'email' ? 'email' : 'chat' }}
                        </mat-icon>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="template">
                      <th mat-header-cell *matHeaderCellDef>Template</th>
                      <td mat-cell *matCellDef="let notification">{{ notification.templateName }}</td>
                    </ng-container>

                    <ng-container matColumnDef="recipient">
                      <th mat-header-cell *matHeaderCellDef>Destinatário</th>
                      <td mat-cell *matCellDef="let notification">
                        <div class="recipient-info">
                          <div class="recipient-name">{{ notification.recipientName }}</div>
                          <div class="recipient-contact">{{ notification.recipient }}</div>
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Estado</th>
                      <td mat-cell *matCellDef="let notification">
                        <span class="status-chip" [ngClass]="notification.status">
                          {{ getStatusText(notification.status) }}
                        </span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="sentAt">
                      <th mat-header-cell *matHeaderCellDef>Enviado</th>
                      <td mat-cell *matCellDef="let notification">
                        {{ notification.sentAt | date:'dd/MM/yyyy HH:mm' }}
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acções</th>
                      <td mat-cell *matCellDef="let notification">
                        <button mat-icon-button (click)="viewNotificationDetails(notification)" matTooltip="Ver detalhes">
                          <mat-icon>visibility</mat-icon>
                        </button>
                        <button mat-icon-button 
                                *ngIf="notification.status === 'failed'" 
                                (click)="resendNotification(notification)"
                                matTooltip="Reenviar">
                          <mat-icon>refresh</mat-icon>
                        </button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="historyColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: historyColumns;"></tr>
                  </table>
                </div>

                <!-- Mobile Cards -->
                <div class="mobile-cards">
                  <div class="notification-card" *ngFor="let notification of filteredHistory">
                    <div class="notification-card-header">
                      <div class="notification-card-type">
                        <mat-icon [ngClass]="notification.type">
                          {{ notification.type === 'email' ? 'email' : 'chat' }}
                        </mat-icon>
                        <span>{{ notification.templateName }}</span>
                      </div>
                      <span class="status-chip" [ngClass]="notification.status">
                        {{ getStatusText(notification.status) }}
                      </span>
                    </div>
                    
                    <div class="notification-card-details">
                      <div class="notification-card-detail">
                        <div class="notification-card-label">Destinatário</div>
                        <div class="notification-card-value">
                          <div class="recipient-name">{{ notification.recipientName }}</div>
                          <div class="recipient-contact">{{ notification.recipient }}</div>
                        </div>
                      </div>
                      <div class="notification-card-detail">
                        <div class="notification-card-label">Enviado</div>
                        <div class="notification-card-value">{{ notification.sentAt | date:'dd/MM/yyyy HH:mm' }}</div>
                      </div>
                    </div>
                    
                    <div class="notification-card-actions">
                      <button mat-stroked-button (click)="viewNotificationDetails(notification)">
                        <mat-icon>visibility</mat-icon>
                        Ver
                      </button>
                      <button mat-stroked-button color="primary" *ngIf="notification.status === 'failed'" 
                              (click)="resendNotification(notification)">
                        <mat-icon>refresh</mat-icon>
                        Reenviar
                      </button>
                    </div>
                  </div>
                </div>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Agendamentos -->
          <mat-tab label="Agendamentos">
            <div class="tab-content">
              <div class="schedules-header">
                <h2>Notificações Automáticas</h2>
                <button mat-raised-button color="primary" (click)="createSchedule()">
                  <mat-icon>add</mat-icon>
                  Novo Agendamento
                </button>
              </div>

              <div class="schedules-grid">
                <mat-card class="schedule-card" *ngFor="let schedule of schedules">
                  <mat-card-header>
                    <div class="schedule-header">
                      <mat-icon [ngClass]="schedule.type">
                        {{ schedule.type === 'email' ? 'email' : 'chat' }}
                      </mat-icon>
                      <div class="schedule-info">
                        <mat-card-title>{{ schedule.name }}</mat-card-title>
                        <mat-card-subtitle>{{ schedule.type === 'email' ? 'Email' : 'WhatsApp' }}</mat-card-subtitle>
                      </div>
                    </div>
                    <mat-slide-toggle 
                      [checked]="schedule.isActive"
                      (change)="toggleSchedule(schedule.id, $event.checked)">
                    </mat-slide-toggle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="schedule-details">
                      <div class="schedule-frequency">
                        <mat-icon>schedule</mat-icon>
                        <span>{{ getFrequencyText(schedule.frequency) }} às {{ schedule.time }}</span>
                      </div>
                      <div class="schedule-next" *ngIf="schedule.nextRun">
                        <mat-icon>event</mat-icon>
                        <span>Próxima: {{ schedule.nextRun | date:'dd/MM/yyyy HH:mm' }}</span>
                      </div>
                      <div class="schedule-last" *ngIf="schedule.lastRun">
                        <mat-icon>history</mat-icon>
                        <span>Última: {{ schedule.lastRun | date:'dd/MM/yyyy HH:mm' }}</span>
                      </div>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="editSchedule(schedule)">
                      <mat-icon>edit</mat-icon>
                      Editar
                    </button>
                    <button mat-button (click)="runScheduleNow(schedule)">
                      <mat-icon>play_arrow</mat-icon>
                      Executar Agora
                    </button>
                    <button mat-button color="warn" (click)="deleteSchedule(schedule.id)">
                      <mat-icon>delete</mat-icon>
                      Eliminar
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Configurações -->
          <mat-tab label="Configurações">
            <div class="tab-content">
              <div class="config-grid">
                <mat-card class="config-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>email</mat-icon>
                      Configuração de Email
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="config-status">
                      <div class="status-indicator" [ngClass]="emailConfigStatus">
                        <mat-icon>{{ emailConfigStatus === 'connected' ? 'check_circle' : 'error' }}</mat-icon>
                        <span>{{ emailConfigStatus === 'connected' ? 'Conectado' : 'Desconectado' }}</span>
                      </div>
                    </div>
                    <div class="config-details">
                      <p><strong>Servidor SMTP:</strong> smtp.gmail.com</p>
                      <p><strong>Porta:</strong> 587</p>
                      <p><strong>Segurança:</strong> TLS</p>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="testEmailConfig()" [disabled]="testingEmail">
                      <mat-spinner diameter="20" *ngIf="testingEmail"></mat-spinner>
                      <mat-icon *ngIf="!testingEmail">wifi</mat-icon>
                      Testar Ligação
                    </button>
                    <button mat-button (click)="configureEmail()">
                      <mat-icon>settings</mat-icon>
                      Configurar
                    </button>
                  </mat-card-actions>
                </mat-card>

                <mat-card class="config-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>chat</mat-icon>
                      Configuração WhatsApp
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="config-status">
                      <div class="status-indicator" [ngClass]="whatsappConfigStatus">
                        <mat-icon>{{ whatsappConfigStatus === 'connected' ? 'check_circle' : 'error' }}</mat-icon>
                        <span>{{ whatsappConfigStatus === 'connected' ? 'Conectado' : 'Desconectado' }}</span>
                      </div>
                    </div>
                    <div class="config-details">
                      <p><strong>Provedor:</strong> Twilio</p>
                      <p><strong>Número:</strong> +1234567890</p>
                      <p><strong>API:</strong> WhatsApp Business</p>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="testWhatsAppConfig()" [disabled]="testingWhatsApp">
                      <mat-spinner diameter="20" *ngIf="testingWhatsApp"></mat-spinner>
                      <mat-icon *ngIf="!testingWhatsApp">wifi</mat-icon>
                      Testar Ligação
                    </button>
                    <button mat-button (click)="configureWhatsApp()">
                      <mat-icon>settings</mat-icon>
                      Configurar
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>

              <mat-card class="notification-settings">
                <mat-card-header>
                  <mat-card-title>Configurações Gerais</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="settings-list">
                    <div class="setting-item">
                      <div class="setting-info">
                        <div class="setting-title">Notificações de Expiração</div>
                        <div class="setting-description">Enviar lembretes automáticos antes da expiração</div>
                      </div>
                      <mat-slide-toggle [checked]="true"></mat-slide-toggle>
                    </div>
                    
                    <div class="setting-item">
                      <div class="setting-info">
                        <div class="setting-title">Notificações de Boas-vindas</div>
                        <div class="setting-description">Enviar email de boas-vindas para novos clientes</div>
                      </div>
                      <mat-slide-toggle [checked]="true"></mat-slide-toggle>
                    </div>
                    
                    <div class="setting-item">
                      <div class="setting-info">
                        <div class="setting-title">Relatórios de Entrega</div>
                        <div class="setting-description">Receber relatórios diários sobre entregas</div>
                      </div>
                      <mat-slide-toggle [checked]="false"></mat-slide-toggle>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </app-layout>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header h1 { margin: 0; color: #333; font-size: 28px; }
    .header p { margin: 4px 0 0 0; color: #666; }
    .header-actions { display: flex; gap: 12px; }
    .tab-content { padding: 24px 0; }
    
    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-2px); }
    .stat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .stat-header mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .stat-label { font-weight: 500; color: #666; }
    .stat-value { font-size: 32px; font-weight: 600; color: #1976d2; margin-bottom: 8px; }
    .stat-details { display: flex; flex-direction: column; gap: 4px; }
    .stat-item { display: flex; justify-content: space-between; align-items: center; }
    .success { color: #2e7d32; }
    .error { color: #c62828; }
    .rate { color: #666; font-size: 14px; }
    
    .stat-card.email { border-left: 4px solid #1976d2; }
    .stat-card.whatsapp { border-left: 4px solid #25d366; }
    .stat-card.total { border-left: 4px solid #9c27b0; }
    
    /* Dashboard Grid */
    .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    
    /* Notification List */
    .notification-list { max-height: 400px; overflow-y: auto; }
    .notification-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
    .notification-item:last-child { border-bottom: none; }
    .notification-icon mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .notification-icon mat-icon.email { color: #1976d2; }
    .notification-icon mat-icon.whatsapp { color: #25d366; }
    .notification-content { flex: 1; }
    .notification-title { font-weight: 500; margin-bottom: 4px; }
    .notification-recipient { color: #666; font-size: 14px; margin-bottom: 2px; }
    .notification-time { color: #999; font-size: 12px; }
    
    /* Schedule List */
    .schedule-list { max-height: 400px; overflow-y: auto; }
    .schedule-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
    .schedule-item:last-child { border-bottom: none; }
    .schedule-name { font-weight: 500; margin-bottom: 4px; }
    .schedule-details { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .schedule-details .frequency { font-size: 12px; }
    .schedule-details .time { color: #666; font-size: 14px; }
    .schedule-next { color: #999; font-size: 12px; }
    
    /* Templates */
    .templates-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .templates-filters { display: flex; gap: 16px; }
    .templates-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 16px; }
    .template-card { transition: transform 0.2s; }
    .template-card:hover { transform: translateY(-2px); }
    .template-header { display: flex; align-items: center; gap: 12px; flex: 1; }
    .template-header mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .template-header mat-icon.email { color: #1976d2; }
    .template-header mat-icon.whatsapp { color: #25d366; }
    .template-actions { display: flex; align-items: center; }
    .template-subject { margin-bottom: 8px; font-size: 14px; }
    .template-content { color: #666; margin-bottom: 12px; line-height: 1.4; }
    .template-variables { font-size: 14px; }
    .variables-list { margin-top: 4px; display: flex; flex-wrap: wrap; gap: 4px; }
    .variable-chip { background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
    
    /* History */
    .history-filters { display: flex; gap: 16px; align-items: center; margin-bottom: 24px; }
    .history-table { overflow-x: auto; }
    .notification-history-table { width: 100%; }
    .recipient-info { }
    .recipient-name { font-weight: 500; }
    .recipient-contact { color: #666; font-size: 12px; }
    
    /* Schedules */
    .schedules-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .schedules-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 16px; }
    .schedule-card { transition: transform 0.2s; }
    .schedule-card:hover { transform: translateY(-2px); }
    .schedule-header { display: flex; align-items: center; gap: 12px; flex: 1; }
    .schedule-header mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .schedule-header mat-icon.email { color: #1976d2; }
    .schedule-header mat-icon.whatsapp { color: #25d366; }
    .schedule-details { display: flex; flex-direction: column; gap: 8px; }
    .schedule-details > div { display: flex; align-items: center; gap: 8px; }
    .schedule-details mat-icon { font-size: 16px; width: 16px; height: 16px; color: #666; }
    
    /* Configuration */
    .config-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .config-card { transition: transform 0.2s; }
    .config-card:hover { transform: translateY(-2px); }
    .config-status { margin-bottom: 16px; }
    .status-indicator { display: flex; align-items: center; gap: 8px; }
    .status-indicator.connected { color: #2e7d32; }
    .status-indicator.disconnected { color: #c62828; }
    .config-details p { margin: 4px 0; color: #666; }
    
    .notification-settings { }
    .settings-list { display: flex; flex-direction: column; gap: 16px; }
    .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
    .setting-title { font-weight: 500; margin-bottom: 4px; }
    .setting-description { color: #666; font-size: 14px; }
    
    /* Status Chips */
    .status-chip { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-chip.delivered { background: #e8f5e8; color: #2e7d32; }
    .status-chip.failed { background: #ffebee; color: #c62828; }
    .status-chip.pending { background: #fff3e0; color: #f57c00; }
    .status-chip.sent { background: #e3f2fd; color: #1976d2; }
    
    .frequency-chip { background: #f5f5f5; color: #666; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
    
    /* Empty States */
    .empty-state { text-align: center; padding: 48px 24px; color: #666; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5; }
    
    /* Mobile Cards */
    .mobile-cards { display: none; }
    .desktop-table { display: block; }
    
    .notification-card {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .notification-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .notification-card-type {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #333;
    }
    
    .notification-card-type mat-icon.email { color: #1976d2; }
    .notification-card-type mat-icon.whatsapp { color: #25d366; }
    
    .notification-card-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .notification-card-detail {
      display: flex;
      flex-direction: column;
    }
    
    .notification-card-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    
    .notification-card-value {
      font-size: 14px;
      color: #333;
    }
    
    .notification-card-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .container { padding: 16px; }
      .header { flex-direction: column; align-items: flex-start; gap: 16px; }
      .dashboard-grid { grid-template-columns: 1fr; }
      .templates-grid { grid-template-columns: 1fr; }
      .schedules-grid { grid-template-columns: 1fr; }
      .config-grid { grid-template-columns: 1fr; }
      .stats-grid { grid-template-columns: 1fr; }
      .desktop-table { display: none; }
      .mobile-cards { display: block; }
      .notification-card-actions { justify-content: stretch; }
      .notification-card-actions button { flex: 1; }
    }
    
    @media (max-width: 480px) {
      .notification-card-actions {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit {
  selectedTab = 0;
  
  // Stats
  emailStats: NotificationStats = { totalSent: 0, delivered: 0, failed: 0, pending: 0, deliveryRate: 0 };
  whatsappStats: NotificationStats = { totalSent: 0, delivered: 0, failed: 0, pending: 0, deliveryRate: 0 };
  totalStats: NotificationStats = { totalSent: 0, delivered: 0, failed: 0, pending: 0, deliveryRate: 0 };
  
  // Data
  templates: NotificationTemplate[] = [];
  filteredTemplates: NotificationTemplate[] = [];
  history: NotificationHistory[] = [];
  filteredHistory: NotificationHistory[] = [];
  recentHistory: NotificationHistory[] = [];
  schedules: NotificationSchedule[] = [];
  activeSchedules: NotificationSchedule[] = [];
  
  // Filters
  templateFilter = 'all';
  historyFilter = 'all';
  statusFilter = 'all';
  
  // Table columns
  historyColumns = ['type', 'template', 'recipient', 'status', 'sentAt', 'actions'];
  
  // Config status
  emailConfigStatus: 'connected' | 'disconnected' = 'connected';
  whatsappConfigStatus: 'connected' | 'disconnected' = 'disconnected';
  testingEmail = false;
  testingWhatsApp = false;

  constructor(
    private notificationsService: NotificationsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load stats
    this.notificationsService.getStats('email').subscribe(stats => {
      this.emailStats = stats;
      this.calculateTotalStats();
    });
    
    this.notificationsService.getStats('whatsapp').subscribe(stats => {
      this.whatsappStats = stats;
      this.calculateTotalStats();
    });
    
    // Load templates
    this.notificationsService.getTemplates().subscribe(templates => {
      this.templates = templates;
      this.filterTemplates();
    });
    
    // Load history
    this.notificationsService.getHistory().subscribe(history => {
      this.history = history;
      this.recentHistory = history.slice(0, 5);
      this.filterHistory();
    });
    
    // Load schedules
    this.notificationsService.getSchedules().subscribe(schedules => {
      this.schedules = schedules;
      this.activeSchedules = schedules.filter(s => s.isActive);
    });
  }

  calculateTotalStats() {
    this.totalStats = {
      totalSent: this.emailStats.totalSent + this.whatsappStats.totalSent,
      delivered: this.emailStats.delivered + this.whatsappStats.delivered,
      failed: this.emailStats.failed + this.whatsappStats.failed,
      pending: this.emailStats.pending + this.whatsappStats.pending,
      deliveryRate: Math.round(((this.emailStats.delivered + this.whatsappStats.delivered) / 
                               (this.emailStats.totalSent + this.whatsappStats.totalSent)) * 100)
    };
  }

  onTabChange(event: any) {
    this.selectedTab = event.index;
  }

  // Templates
  filterTemplates() {
    if (this.templateFilter === 'all') {
      this.filteredTemplates = this.templates;
    } else {
      this.filteredTemplates = this.templates.filter(t => t.type === this.templateFilter);
    }
  }

  createTemplate() {
    this.snackBar.open('Funcionalidade de criar template será implementada', 'Fechar', { duration: 3000 });
  }

  editTemplate(template: NotificationTemplate) {
    this.snackBar.open(`Editar template: ${template.name}`, 'Fechar', { duration: 3000 });
  }

  deleteTemplate(templateId: string) {
    if (confirm('Tem certeza que deseja eliminar este template?')) {
      this.snackBar.open('Template eliminado com sucesso', 'Fechar', { duration: 3000 });
    }
  }

  toggleTemplate(templateId: string, isActive: boolean) {
    this.snackBar.open(`Template ${isActive ? 'activado' : 'desactivado'}`, 'Fechar', { duration: 2000 });
  }

  sendTestNotification(template: NotificationTemplate) {
    this.snackBar.open(`Enviando notificação de teste...`, 'Fechar', { duration: 3000 });
  }

  // History
  filterHistory() {
    let filtered = this.history;
    
    if (this.historyFilter !== 'all') {
      filtered = filtered.filter(h => h.type === this.historyFilter);
    }
    
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(h => h.status === this.statusFilter);
    }
    
    this.filteredHistory = filtered;
  }

  viewNotificationDetails(notification: NotificationHistory) {
    this.snackBar.open(`Ver detalhes: ${notification.templateName}`, 'Fechar', { duration: 3000 });
  }

  resendNotification(notification: NotificationHistory) {
    this.snackBar.open('Reenviando notificação...', 'Fechar', { duration: 3000 });
  }

  exportHistory() {
    const data = JSON.stringify(this.filteredHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historico-notificacoes-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  refreshHistory() {
    this.loadData();
    this.snackBar.open('Histórico actualizado', 'Fechar', { duration: 2000 });
  }

  // Schedules
  createSchedule() {
    this.snackBar.open('Funcionalidade de criar agendamento será implementada', 'Fechar', { duration: 3000 });
  }

  editSchedule(schedule: NotificationSchedule) {
    this.snackBar.open(`Editar agendamento: ${schedule.name}`, 'Fechar', { duration: 3000 });
  }

  deleteSchedule(scheduleId: string) {
    if (confirm('Tem certeza que deseja eliminar este agendamento?')) {
      this.snackBar.open('Agendamento eliminado com sucesso', 'Fechar', { duration: 3000 });
    }
  }

  toggleSchedule(scheduleId: string, isActive: boolean) {
    this.snackBar.open(`Agendamento ${isActive ? 'activado' : 'desactivado'}`, 'Fechar', { duration: 2000 });
  }

  runScheduleNow(schedule: NotificationSchedule) {
    this.snackBar.open(`Executando agendamento: ${schedule.name}`, 'Fechar', { duration: 3000 });
  }

  // Configuration
  testEmailConfig() {
    this.testingEmail = true;
    this.notificationsService.testEmailConfig().subscribe({
      next: (result) => {
        this.testingEmail = false;
        this.emailConfigStatus = result.success ? 'connected' : 'disconnected';
        this.snackBar.open(result.message, 'Fechar', { duration: 3000 });
      },
      error: () => {
        this.testingEmail = false;
        this.emailConfigStatus = 'disconnected';
        this.snackBar.open('Erro ao testar configuração de email', 'Fechar', { duration: 3000 });
      }
    });
  }

  testWhatsAppConfig() {
    this.testingWhatsApp = true;
    this.notificationsService.testWhatsAppConfig().subscribe({
      next: (result) => {
        this.testingWhatsApp = false;
        this.whatsappConfigStatus = result.success ? 'connected' : 'disconnected';
        this.snackBar.open(result.message, 'Fechar', { duration: 3000 });
      },
      error: () => {
        this.testingWhatsApp = false;
        this.whatsappConfigStatus = 'disconnected';
        this.snackBar.open('Erro ao testar configuração WhatsApp', 'Fechar', { duration: 3000 });
      }
    });
  }

  testConnections() {
    this.testEmailConfig();
    setTimeout(() => this.testWhatsAppConfig(), 1000);
  }

  configureEmail() {
    this.snackBar.open('Funcionalidade de configuração de email será implementada', 'Fechar', { duration: 3000 });
  }

  configureWhatsApp() {
    this.snackBar.open('Funcionalidade de configuração WhatsApp será implementada', 'Fechar', { duration: 3000 });
  }

  // Utility methods
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'sent': 'Enviado',
      'delivered': 'Entregue',
      'failed': 'Falhado',
      'pending': 'Pendente'
    };
    return statusMap[status] || status;
  }

  getFrequencyText(frequency: string): string {
    const frequencyMap: { [key: string]: string } = {
      'daily': 'Diariamente',
      'weekly': 'Semanalmente',
      'monthly': 'Mensalmente'
    };
    return frequencyMap[frequency] || frequency;
  }
}