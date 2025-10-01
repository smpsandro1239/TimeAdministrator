import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

interface NotificationLog {
  id: string;
  type: 'email' | 'whatsapp' | 'telegram';
  recipient: string;
  subject: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: Date;
  deliveredAt?: Date;
  errorMessage?: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'whatsapp' | 'telegram';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  trigger: string;
}

interface NotificationConfig {
  email: {
    enabled: boolean;
    host: string;
    port: number;
    user: string;
    from: string;
    isConnected: boolean;
  };
  whatsapp: {
    enabled: boolean;
    provider: string;
    accountSid: string;
    isConnected: boolean;
  };
  telegram: {
    enabled: boolean;
    botToken: string;
    isConnected: boolean;
  };
  schedule: {
    enabled: boolean;
    time: string;
    timezone: string;
  };
}

@Component({
  selector: 'app-notifications-advanced',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDialogModule, MatSnackBarModule, MatSlideToggleModule,
    MatChipsModule, LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="container">
        <div class="header">
          <h1>Sistema de Notificações</h1>
          <p>Gestão completa de emails e WhatsApp automáticos</p>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="sendTestNotification()">
              <mat-icon>send</mat-icon>
              Enviar Teste
            </button>
            <button mat-raised-button (click)="runManualCheck()">
              <mat-icon>refresh</mat-icon>
              Verificar Agora
            </button>
          </div>
        </div>

        <mat-tab-group [(selectedIndex)]="selectedTab">
          <!-- Dashboard Tab -->
          <mat-tab label="Dashboard">
            <div class="tab-content">
              <!-- Stats Cards -->
              <div class="stats-grid">
                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon class="email-icon">email</mat-icon>
                      <span>Emails Hoje</span>
                    </div>
                    <div class="stat-value">{{ stats.emailsToday }}</div>
                    <div class="stat-details">
                      <span class="success">{{ stats.emailsDelivered }} entregues</span>
                      <span class="error">{{ stats.emailsFailed }} falharam</span>
                    </div>
                    <div class="stat-rate">Taxa: {{ getDeliveryRate('email') }}%</div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon class="whatsapp-icon">chat</mat-icon>
                      <span>WhatsApp Hoje</span>
                    </div>
                    <div class="stat-value">{{ stats.whatsappToday }}</div>
                    <div class="stat-details">
                      <span class="success">{{ stats.whatsappDelivered }} entregues</span>
                      <span class="error">{{ stats.whatsappFailed }} falharam</span>
                    </div>
                    <div class="stat-rate">Taxa: {{ getDeliveryRate('whatsapp') }}%</div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon class="telegram-icon">send</mat-icon>
                      <span>Telegram Hoje</span>
                    </div>
                    <div class="stat-value">{{ stats.telegramToday }}</div>
                    <div class="stat-details">
                      <span class="success">{{ stats.telegramDelivered }} entregues</span>
                      <span class="error">{{ stats.telegramFailed }} falharam</span>
                    </div>
                    <div class="stat-rate">Taxa: {{ getDeliveryRate('telegram') }}%</div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon class="total-icon">notifications</mat-icon>
                      <span>Total Mensal</span>
                    </div>
                    <div class="stat-value">{{ stats.monthlyTotal }}</div>
                    <div class="stat-details">
                      <span class="success">{{ stats.monthlyDelivered }} entregues</span>
                      <span class="error">{{ stats.monthlyFailed }} falharam</span>
                    </div>
                    <div class="stat-rate">Taxa: {{ getMonthlyRate() }}%</div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon class="queue-icon">schedule</mat-icon>
                      <span>Na Fila</span>
                    </div>
                    <div class="stat-value">{{ stats.queueCount }}</div>
                    <div class="stat-details">
                      <span>{{ stats.queueEmails }} emails</span>
                      <span>{{ stats.queueWhatsapp }} WhatsApp</span>
                      <span>{{ stats.queueTelegram }} Telegram</span>
                    </div>
                    <div class="stat-rate">Próximo envio: {{ nextSendTime }}</div>
                  </mat-card-content>
                </mat-card>
              </div>

              <!-- Recent Notifications -->
              <mat-card class="recent-card">
                <mat-card-header>
                  <mat-card-title>Notificações Recentes</mat-card-title>
                  <div class="header-actions">
                    <button mat-icon-button (click)="refreshLogs()">
                      <mat-icon>refresh</mat-icon>
                    </button>
                  </div>
                </mat-card-header>
                <mat-card-content>
                  <table mat-table [dataSource]="recentLogs" class="logs-table">
                    <ng-container matColumnDef="type">
                      <th mat-header-cell *matHeaderCellDef>Tipo</th>
                      <td mat-cell *matCellDef="let log">
                        <mat-icon [class]="log.type + '-icon'">
                          {{ log.type === 'email' ? 'email' : 'chat' }}
                        </mat-icon>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="recipient">
                      <th mat-header-cell *matHeaderCellDef>Destinatário</th>
                      <td mat-cell *matCellDef="let log">{{ log.recipient }}</td>
                    </ng-container>

                    <ng-container matColumnDef="subject">
                      <th mat-header-cell *matHeaderCellDef>Assunto</th>
                      <td mat-cell *matCellDef="let log">{{ log.subject }}</td>
                    </ng-container>

                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Estado</th>
                      <td mat-cell *matCellDef="let log">
                        <span class="status-chip" [ngClass]="log.status">
                          {{ getStatusText(log.status) }}
                        </span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="sentAt">
                      <th mat-header-cell *matHeaderCellDef>Enviado</th>
                      <td mat-cell *matCellDef="let log">{{ log.sentAt | date:'dd/MM HH:mm' }}</td>
                    </ng-container>

                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acções</th>
                      <td mat-cell *matCellDef="let log">
                        <button mat-icon-button (click)="viewLogDetails(log)">
                          <mat-icon>visibility</mat-icon>
                        </button>
                        <button mat-icon-button (click)="resendNotification(log)" 
                                *ngIf="log.status === 'failed'">
                          <mat-icon>refresh</mat-icon>
                        </button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="logColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: logColumns;"></tr>
                  </table>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Templates Tab -->
          <mat-tab label="Templates">
            <div class="tab-content">
              <div class="templates-header">
                <h2>Templates de Notificação</h2>
                <button mat-raised-button color="primary" (click)="createTemplate()">
                  <mat-icon>add</mat-icon>
                  Novo Template
                </button>
              </div>

              <div class="templates-grid">
                <mat-card class="template-card" *ngFor="let template of templates">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon [class]="template.type + '-icon'">
                        {{ template.type === 'email' ? 'email' : 'chat' }}
                      </mat-icon>
                      {{ template.name }}
                    </mat-card-title>
                    <mat-card-subtitle>
                      {{ template.type === 'email' ? 'Email' : 'WhatsApp' }} • 
                      {{ template.trigger }}
                    </mat-card-subtitle>
                    <div class="template-status">
                      <mat-slide-toggle 
                        [checked]="template.isActive"
                        (change)="toggleTemplate(template)">
                      </mat-slide-toggle>
                    </div>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="template-subject" *ngIf="template.subject">
                      <strong>Assunto:</strong> {{ template.subject }}
                    </div>
                    <div class="template-content">
                      {{ template.content | slice:0:150 }}{{ template.content.length > 150 ? '...' : '' }}
                    </div>
                    <div class="template-variables" *ngIf="template.variables.length > 0">
                      <strong>Variáveis:</strong>
                      <mat-chip-set>
                        <mat-chip *ngFor="let variable of template.variables">
                          {{ variable }}
                        </mat-chip>
                      </mat-chip-set>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="editTemplate(template)">
                      <mat-icon>edit</mat-icon>
                      Editar
                    </button>
                    <button mat-button (click)="testTemplate(template)">
                      <mat-icon>send</mat-icon>
                      Testar
                    </button>
                    <button mat-button color="warn" (click)="deleteTemplate(template)">
                      <mat-icon>delete</mat-icon>
                      Eliminar
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Configuration Tab -->
          <mat-tab label="Configurações">
            <div class="tab-content">
              <div class="config-sections">
                <!-- Email Configuration -->
                <mat-card class="config-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>email</mat-icon>
                      Configuração de Email
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="status-indicator" [ngClass]="config.email.isConnected ? 'connected' : 'disconnected'">
                      <mat-icon>{{ config.email.isConnected ? 'check_circle' : 'error' }}</mat-icon>
                      <span>{{ config.email.isConnected ? 'Conectado' : 'Desconectado' }}</span>
                    </div>
                    
                    <form [formGroup]="emailForm" class="config-form">
                      <mat-slide-toggle formControlName="enabled">
                        Notificações por Email Ativadas
                      </mat-slide-toggle>
                      
                      <mat-form-field>
                        <mat-label>Servidor SMTP</mat-label>
                        <input matInput formControlName="host">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Porta</mat-label>
                        <input matInput type="number" formControlName="port">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Utilizador</mat-label>
                        <input matInput formControlName="user">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Email Remetente</mat-label>
                        <input matInput formControlName="from">
                      </mat-form-field>
                    </form>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="testEmailConnection()">
                      <mat-icon>wifi</mat-icon>
                      Testar Ligação
                    </button>
                    <button mat-raised-button color="primary" (click)="saveEmailConfig()">
                      <mat-icon>save</mat-icon>
                      Guardar
                    </button>
                  </mat-card-actions>
                </mat-card>

                <!-- WhatsApp Configuration -->
                <mat-card class="config-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>chat</mat-icon>
                      Configuração WhatsApp
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="status-indicator" [ngClass]="config.whatsapp.isConnected ? 'connected' : 'disconnected'">
                      <mat-icon>{{ config.whatsapp.isConnected ? 'check_circle' : 'error' }}</mat-icon>
                      <span>{{ config.whatsapp.isConnected ? 'Conectado' : 'Desconectado' }}</span>
                    </div>
                    
                    <form [formGroup]="whatsappForm" class="config-form">
                      <mat-slide-toggle formControlName="enabled">
                        Notificações por WhatsApp Ativadas
                      </mat-slide-toggle>
                      
                      <mat-form-field>
                        <mat-label>Provedor</mat-label>
                        <mat-select formControlName="provider">
                          <mat-option value="twilio">Twilio</mat-option>
                          <mat-option value="whatsapp-business">WhatsApp Business API</mat-option>
                        </mat-select>
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Account SID</mat-label>
                        <input matInput formControlName="accountSid">
                      </mat-form-field>
                    </form>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="testWhatsAppConnection()">
                      <mat-icon>wifi</mat-icon>
                      Testar Ligação
                    </button>
                    <button mat-raised-button color="primary" (click)="saveWhatsAppConfig()">
                      <mat-icon>save</mat-icon>
                      Guardar
                    </button>
                  </mat-card-actions>
                </mat-card>

                <!-- Telegram Configuration -->
                <mat-card class="config-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>send</mat-icon>
                      Configuração Telegram
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="status-indicator" [ngClass]="config.telegram.isConnected ? 'connected' : 'disconnected'">
                      <mat-icon>{{ config.telegram.isConnected ? 'check_circle' : 'error' }}</mat-icon>
                      <span>{{ config.telegram.isConnected ? 'Conectado' : 'Desconectado' }}</span>
                    </div>
                    
                    <form [formGroup]="telegramForm" class="config-form">
                      <mat-slide-toggle formControlName="enabled">
                        Notificações por Telegram Ativadas
                      </mat-slide-toggle>
                      
                      <mat-form-field>
                        <mat-label>Bot Token</mat-label>
                        <input matInput type="password" formControlName="botToken" placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxyz">
                      </mat-form-field>
                      
                      <div class="telegram-info">
                        <mat-icon>info</mat-icon>
                        <div>
                          <p><strong>Como obter o Bot Token:</strong></p>
                          <ol>
                            <li>Contacte &#64;BotFather no Telegram</li>
                            <li>Digite /newbot e siga as instruções</li>
                            <li>Copie o token fornecido</li>
                          </ol>
                        </div>
                      </div>
                    </form>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="testTelegramConnection()">
                      <mat-icon>wifi</mat-icon>
                      Testar Ligação
                    </button>
                    <button mat-raised-button color="primary" (click)="saveTelegramConfig()">
                      <mat-icon>save</mat-icon>
                      Guardar
                    </button>
                  </mat-card-actions>
                </mat-card>

                <!-- Schedule Configuration -->
                <mat-card class="config-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>schedule</mat-icon>
                      Agendamento Automático
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="scheduleForm" class="config-form">
                      <mat-slide-toggle formControlName="enabled">
                        Verificação Automática Ativada
                      </mat-slide-toggle>
                      
                      <mat-form-field>
                        <mat-label>Hora de Envio</mat-label>
                        <input matInput type="time" formControlName="time">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Fuso Horário</mat-label>
                        <mat-select formControlName="timezone">
                          <mat-option value="Europe/Lisbon">Europa/Lisboa</mat-option>
                          <mat-option value="UTC">UTC</mat-option>
                        </mat-select>
                      </mat-form-field>
                    </form>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-raised-button color="primary" (click)="saveScheduleConfig()">
                      <mat-icon>save</mat-icon>
                      Guardar
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Logs Tab -->
          <mat-tab label="Histórico">
            <div class="tab-content">
              <div class="logs-header">
                <h2>Histórico de Notificações</h2>
                <div class="logs-filters">
                  <mat-form-field>
                    <mat-label>Tipo</mat-label>
                    <mat-select [(value)]="logFilter.type" (selectionChange)="filterLogs()">
                      <mat-option value="">Todos</mat-option>
                      <mat-option value="email">Email</mat-option>
                      <mat-option value="whatsapp">WhatsApp</mat-option>
                    </mat-select>
                  </mat-form-field>
                  
                  <mat-form-field>
                    <mat-label>Estado</mat-label>
                    <mat-select [(value)]="logFilter.status" (selectionChange)="filterLogs()">
                      <mat-option value="">Todos</mat-option>
                      <mat-option value="sent">Enviado</mat-option>
                      <mat-option value="delivered">Entregue</mat-option>
                      <mat-option value="failed">Falhado</mat-option>
                    </mat-select>
                  </mat-form-field>
                  
                  <button mat-raised-button (click)="exportLogs()">
                    <mat-icon>download</mat-icon>
                    Exportar
                  </button>
                </div>
              </div>

              <mat-card>
                <mat-card-content>
                  <table mat-table [dataSource]="filteredLogs" class="full-logs-table">
                    <ng-container matColumnDef="type">
                      <th mat-header-cell *matHeaderCellDef>Tipo</th>
                      <td mat-cell *matCellDef="let log">
                        <mat-icon [class]="log.type + '-icon'">
                          {{ log.type === 'email' ? 'email' : 'chat' }}
                        </mat-icon>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="recipient">
                      <th mat-header-cell *matHeaderCellDef>Destinatário</th>
                      <td mat-cell *matCellDef="let log">{{ log.recipient }}</td>
                    </ng-container>

                    <ng-container matColumnDef="subject">
                      <th mat-header-cell *matHeaderCellDef>Assunto</th>
                      <td mat-cell *matCellDef="let log">{{ log.subject }}</td>
                    </ng-container>

                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Estado</th>
                      <td mat-cell *matCellDef="let log">
                        <span class="status-chip" [ngClass]="log.status">
                          {{ getStatusText(log.status) }}
                        </span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="sentAt">
                      <th mat-header-cell *matHeaderCellDef>Enviado</th>
                      <td mat-cell *matCellDef="let log">{{ log.sentAt | date:'dd/MM/yyyy HH:mm' }}</td>
                    </ng-container>

                    <ng-container matColumnDef="deliveredAt">
                      <th mat-header-cell *matHeaderCellDef>Entregue</th>
                      <td mat-cell *matCellDef="let log">
                        {{ log.deliveredAt ? (log.deliveredAt | date:'dd/MM/yyyy HH:mm') : '-' }}
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acções</th>
                      <td mat-cell *matCellDef="let log">
                        <button mat-icon-button (click)="viewLogDetails(log)">
                          <mat-icon>visibility</mat-icon>
                        </button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="fullLogColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: fullLogColumns;"></tr>
                  </table>
                  
                  <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
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
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .header h1 { margin: 0; color: #1976d2; font-size: 28px; }
    .header p { margin: 4px 0 0 0; color: #666; }
    .header-actions { display: flex; gap: 12px; }
    .tab-content { padding: 24px 0; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-2px); }
    .stat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .stat-header mat-icon { font-size: 24px; }
    .email-icon { color: #1976d2; }
    .whatsapp-icon { color: #25d366; }
    .telegram-icon { color: #0088cc; }
    .total-icon { color: #9c27b0; }
    .queue-icon { color: #ff9800; }
    .stat-value { font-size: 32px; font-weight: 600; color: #1976d2; margin-bottom: 8px; }
    .stat-details { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
    .stat-rate { font-size: 12px; color: #666; font-weight: 500; }
    .success { color: #2e7d32; }
    .error { color: #c62828; }
    
    .recent-card .mat-card-header { display: flex; justify-content: space-between; align-items: center; }
    .logs-table { width: 100%; }
    .status-chip { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-chip.sent { background: #e3f2fd; color: #1976d2; }
    .status-chip.delivered { background: #e8f5e8; color: #2e7d32; }
    .status-chip.failed { background: #ffebee; color: #c62828; }
    .status-chip.pending { background: #fff3e0; color: #f57c00; }
    
    .templates-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .templates-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 16px; }
    .template-card { transition: transform 0.2s; }
    .template-card:hover { transform: translateY(-2px); }
    .template-card .mat-card-header { position: relative; }
    .template-status { position: absolute; top: 16px; right: 16px; }
    .template-subject { margin-bottom: 8px; font-size: 14px; }
    .template-content { color: #666; line-height: 1.4; margin-bottom: 12px; }
    .template-variables { font-size: 14px; }
    .template-variables mat-chip-set { margin-top: 8px; }
    
    .config-sections { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 16px; }
    .config-card { height: fit-content; }
    .status-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding: 8px; border-radius: 4px; }
    .status-indicator.connected { background: #e8f5e8; color: #2e7d32; }
    .status-indicator.disconnected { background: #ffebee; color: #c62828; }
    .config-form { display: flex; flex-direction: column; gap: 16px; }
    
    .logs-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .logs-filters { display: flex; gap: 16px; align-items: center; }
    .full-logs-table { width: 100%; }
    
    .telegram-info { display: flex; gap: 12px; margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px; }
    .telegram-info mat-icon { color: #1976d2; margin-top: 4px; }
    .telegram-info p { margin: 0 0 8px 0; font-weight: 500; }
    .telegram-info ol { margin: 0; padding-left: 16px; }
    .telegram-info li { margin-bottom: 4px; }
    
    @media (max-width: 768px) {
      .container { padding: 16px; }
      .header { flex-direction: column; gap: 16px; }
      .stats-grid { grid-template-columns: 1fr; }
      .templates-grid { grid-template-columns: 1fr; }
      .config-sections { grid-template-columns: 1fr; }
      .logs-filters { flex-direction: column; align-items: stretch; }
    }
  `]
})
export class NotificationsAdvancedComponent implements OnInit {
  selectedTab = 0;
  
  stats = {
    emailsToday: 42,
    emailsDelivered: 38,
    emailsFailed: 4,
    whatsappToday: 28,
    whatsappDelivered: 26,
    whatsappFailed: 2,
    telegramToday: 18,
    telegramDelivered: 17,
    telegramFailed: 1,
    monthlyTotal: 1247,
    monthlyDelivered: 1189,
    monthlyFailed: 58,
    queueCount: 15,
    queueEmails: 9,
    queueWhatsapp: 6,
    queueTelegram: 3
  };

  nextSendTime = '09:00';
  
  logColumns = ['type', 'recipient', 'subject', 'status', 'sentAt', 'actions'];
  fullLogColumns = ['type', 'recipient', 'subject', 'status', 'sentAt', 'deliveredAt', 'actions'];
  
  recentLogs: NotificationLog[] = [];
  filteredLogs: NotificationLog[] = [];
  templates: NotificationTemplate[] = [];
  
  config: NotificationConfig = {
    email: {
      enabled: true,
      host: 'smtp.gmail.com',
      port: 587,
      user: 'admin@timeadministrator.com',
      from: 'TimeAdministrator <admin@timeadministrator.com>',
      isConnected: true
    },
    whatsapp: {
      enabled: false,
      provider: 'twilio',
      accountSid: '',
      isConnected: false
    },
    telegram: {
      enabled: true,
      botToken: '',
      isConnected: true
    },
    schedule: {
      enabled: true,
      time: '09:00',
      timezone: 'Europe/Lisbon'
    }
  };

  logFilter = { type: '', status: '' };
  
  emailForm!: FormGroup;
  whatsappForm!: FormGroup;
  telegramForm!: FormGroup;
  scheduleForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
    this.loadMockData();
  }

  ngOnInit() {
    this.refreshLogs();
  }

  initializeForms() {
    this.emailForm = this.fb.group({
      enabled: [this.config.email.enabled],
      host: [this.config.email.host, Validators.required],
      port: [this.config.email.port, [Validators.required, Validators.min(1)]],
      user: [this.config.email.user, [Validators.required, Validators.email]],
      from: [this.config.email.from, [Validators.required, Validators.email]]
    });

    this.whatsappForm = this.fb.group({
      enabled: [this.config.whatsapp.enabled],
      provider: [this.config.whatsapp.provider, Validators.required],
      accountSid: [this.config.whatsapp.accountSid, Validators.required]
    });

    this.telegramForm = this.fb.group({
      enabled: [this.config.telegram.enabled],
      botToken: [this.config.telegram.botToken, Validators.required]
    });

    this.scheduleForm = this.fb.group({
      enabled: [this.config.schedule.enabled],
      time: [this.config.schedule.time, Validators.required],
      timezone: [this.config.schedule.timezone, Validators.required]
    });
  }

  loadMockData() {
    // Mock notification logs
    this.recentLogs = [
      {
        id: '1',
        type: 'email',
        recipient: 'joao.silva@email.com',
        subject: 'Lembrete: Subscrição expira em 15 dias',
        status: 'delivered',
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000)
      },
      {
        id: '2',
        type: 'whatsapp',
        recipient: '+351912345678',
        subject: 'WhatsApp: Subscrição a expirar',
        status: 'delivered',
        sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 15000)
      },
      {
        id: '3',
        type: 'email',
        recipient: 'maria.santos@email.com',
        subject: 'Bem-vindo ao TimeAdministrator',
        status: 'failed',
        sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        errorMessage: 'Endereço de email inválido'
      }
    ];

    // Mock templates
    this.templates = [
      {
        id: '1',
        name: 'Lembrete 15 dias',
        type: 'email',
        subject: 'A sua subscrição expira em 15 dias',
        content: 'Olá {{clientName}}, a sua subscrição do plano {{planName}} expira em 15 dias. Renove já para continuar a usufruir dos nossos serviços.',
        variables: ['clientName', 'planName', 'expirationDate'],
        isActive: true,
        trigger: 'expiration_15_days'
      },
      {
        id: '2',
        name: 'WhatsApp Expiração',
        type: 'whatsapp',
        content: 'Olá {{clientName}}! A sua subscrição expira em {{daysLeft}} dias. Renove em: {{renewalLink}}',
        variables: ['clientName', 'daysLeft', 'renewalLink'],
        isActive: true,
        trigger: 'expiration_warning'
      }
    ];

    this.filteredLogs = [...this.recentLogs];
  }

  getDeliveryRate(type: 'email' | 'whatsapp' | 'telegram'): number {
    if (type === 'email') {
      return Math.round((this.stats.emailsDelivered / this.stats.emailsToday) * 100);
    }
    if (type === 'telegram') {
      return Math.round((this.stats.telegramDelivered / this.stats.telegramToday) * 100);
    }
    return Math.round((this.stats.whatsappDelivered / this.stats.whatsappToday) * 100);
  }

  getMonthlyRate(): number {
    return Math.round((this.stats.monthlyDelivered / this.stats.monthlyTotal) * 100);
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      sent: 'Enviado',
      delivered: 'Entregue',
      failed: 'Falhado',
      pending: 'Pendente'
    };
    return statusMap[status] || status;
  }

  refreshLogs() {
    // Simulate API call
    this.snackBar.open('Logs atualizados', 'Fechar', { duration: 2000 });
  }

  viewLogDetails(log: NotificationLog) {
    // Open dialog with log details
    console.log('View log details:', log);
  }

  resendNotification(log: NotificationLog) {
    this.snackBar.open('Notificação reenviada', 'Fechar', { duration: 2000 });
  }

  sendTestNotification() {
    this.snackBar.open('Notificação de teste enviada', 'Fechar', { duration: 2000 });
  }

  runManualCheck() {
    this.snackBar.open('Verificação manual iniciada', 'Fechar', { duration: 2000 });
  }

  createTemplate() {
    // Open template creation dialog
    console.log('Create new template');
  }

  editTemplate(template: NotificationTemplate) {
    console.log('Edit template:', template);
  }

  testTemplate(template: NotificationTemplate) {
    this.snackBar.open(`Template "${template.name}" testado`, 'Fechar', { duration: 2000 });
  }

  deleteTemplate(template: NotificationTemplate) {
    if (confirm(`Eliminar template "${template.name}"?`)) {
      this.templates = this.templates.filter(t => t.id !== template.id);
      this.snackBar.open('Template eliminado', 'Fechar', { duration: 2000 });
    }
  }

  toggleTemplate(template: NotificationTemplate) {
    template.isActive = !template.isActive;
    this.snackBar.open(
      `Template ${template.isActive ? 'ativado' : 'desativado'}`, 
      'Fechar', 
      { duration: 2000 }
    );
  }

  testEmailConnection() {
    this.snackBar.open('A testar ligação de email...', 'Fechar', { duration: 2000 });
    setTimeout(() => {
      this.config.email.isConnected = true;
      this.snackBar.open('Email de teste enviado para o administrador!', 'Fechar', { duration: 2000 });
    }, 2000);
  }

  saveEmailConfig() {
    if (this.emailForm.valid) {
      Object.assign(this.config.email, this.emailForm.value);
      this.snackBar.open('Configuração de email guardada', 'Fechar', { duration: 2000 });
    }
  }

  testWhatsAppConnection() {
    this.snackBar.open('A testar ligação WhatsApp...', 'Fechar', { duration: 2000 });
    setTimeout(() => {
      this.config.whatsapp.isConnected = true;
      this.snackBar.open('Mensagem WhatsApp de teste enviada para o administrador!', 'Fechar', { duration: 2000 });
    }, 2000);
  }

  saveWhatsAppConfig() {
    if (this.whatsappForm.valid) {
      Object.assign(this.config.whatsapp, this.whatsappForm.value);
      this.snackBar.open('Configuração WhatsApp guardada', 'Fechar', { duration: 2000 });
    }
  }

  testTelegramConnection() {
    this.snackBar.open('A testar ligação Telegram...', 'Fechar', { duration: 2000 });
    setTimeout(() => {
      this.config.telegram.isConnected = true;
      this.snackBar.open('Mensagem Telegram de teste enviada para o administrador!', 'Fechar', { duration: 2000 });
    }, 2000);
  }

  saveTelegramConfig() {
    if (this.telegramForm.valid) {
      Object.assign(this.config.telegram, this.telegramForm.value);
      this.snackBar.open('Configuração Telegram guardada', 'Fechar', { duration: 2000 });
    }
  }

  saveScheduleConfig() {
    if (this.scheduleForm.valid) {
      Object.assign(this.config.schedule, this.scheduleForm.value);
      this.snackBar.open('Configuração de agendamento guardada', 'Fechar', { duration: 2000 });
    }
  }

  filterLogs() {
    this.filteredLogs = this.recentLogs.filter(log => {
      const typeMatch = !this.logFilter.type || log.type === this.logFilter.type;
      const statusMatch = !this.logFilter.status || log.status === this.logFilter.status;
      return typeMatch && statusMatch;
    });
  }

  exportLogs() {
    this.snackBar.open('Logs exportados com sucesso', 'Fechar', { duration: 2000 });
  }
}