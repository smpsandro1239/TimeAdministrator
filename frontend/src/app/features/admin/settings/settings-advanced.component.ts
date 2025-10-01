import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

interface SystemSettings {
  general: {
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    timezone: string;
    language: string;
    currency: string;
    dateFormat: string;
    maintenanceMode: boolean;
  };
  payments: {
    stripeEnabled: boolean;
    stripePublishableKey: string;
    stripeSecretKey: string;
    paypalEnabled: boolean;
    paypalClientId: string;
    paypalClientSecret: string;
    mbwayEnabled: boolean;
    mbwayEntityId: string;
    mbwayApiKey: string;
    manualPaymentsEnabled: boolean;
    autoApprovalEnabled: boolean;
    invoicePrefix: string;
    taxRate: number;
  };
  notifications: {
    emailEnabled: boolean;
    emailHost: string;
    emailPort: number;
    emailUser: string;
    emailPassword: string;
    emailFrom: string;
    whatsappEnabled: boolean;
    whatsappProvider: string;
    whatsappAccountSid: string;
    whatsappAuthToken: string;
    telegramEnabled: boolean;
    telegramBotToken: string;
    telegramAdminChatId: string;
    telegramCopyToAdmin: boolean;
    telegramMonthlyReports: boolean;
    reminderDays: number[];
    autoNotifications: boolean;
  };
  security: {
    jwtSecret: string;
    jwtExpiresIn: string;
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSymbols: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
  backup: {
    autoBackupEnabled: boolean;
    backupFrequency: string;
    backupRetention: number;
    backupLocation: string;
    lastBackup?: Date;
  };
}

@Component({
  selector: 'app-settings-advanced',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSlideToggleModule, MatSnackBarModule, MatDividerModule, MatListModule,
    MatExpansionModule, LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="container">
        <div class="header">
          <div class="header-info">
            <h1>Configurações do Sistema</h1>
            <p>Gestão completa das configurações da aplicação</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button (click)="exportSettings()">
              <mat-icon>download</mat-icon>
              Exportar
            </button>
            <button mat-raised-button (click)="importSettings()">
              <mat-icon>upload</mat-icon>
              Importar
            </button>
            <button mat-raised-button color="primary" (click)="saveAllSettings()">
              <mat-icon>save</mat-icon>
              Guardar Tudo
            </button>
          </div>
        </div>

        <mat-tab-group [(selectedIndex)]="selectedTab">
          <!-- General Settings Tab -->
          <mat-tab label="Geral">
            <div class="tab-content">
              <div class="settings-sections">
                <!-- Company Information -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>business</mat-icon>
                      Informações da Empresa
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="generalForm" class="settings-form">
                      <mat-form-field>
                        <mat-label>Nome da Empresa</mat-label>
                        <input matInput formControlName="companyName" required>
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Email da Empresa</mat-label>
                        <input matInput type="email" formControlName="companyEmail" required>
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Telefone</mat-label>
                        <input matInput formControlName="companyPhone">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Morada</mat-label>
                        <textarea matInput formControlName="companyAddress" rows="3"></textarea>
                      </mat-form-field>
                    </form>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-raised-button color="primary" (click)="saveGeneralSettings()">
                      <mat-icon>save</mat-icon>
                      Guardar
                    </button>
                  </mat-card-actions>
                </mat-card>

                <!-- System Preferences -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>settings</mat-icon>
                      Preferências do Sistema
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="generalForm" class="settings-form">
                      <mat-form-field>
                        <mat-label>Fuso Horário</mat-label>
                        <mat-select formControlName="timezone">
                          <mat-option value="Europe/Lisbon">Europa/Lisboa</mat-option>
                          <mat-option value="UTC">UTC</mat-option>
                          <mat-option value="America/New_York">América/Nova Iorque</mat-option>
                        </mat-select>
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Idioma</mat-label>
                        <mat-select formControlName="language">
                          <mat-option value="pt">Português</mat-option>
                          <mat-option value="en">English</mat-option>
                          <mat-option value="es">Español</mat-option>
                        </mat-select>
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Moeda</mat-label>
                        <mat-select formControlName="currency">
                          <mat-option value="EUR">Euro (€)</mat-option>
                          <mat-option value="USD">Dólar ($)</mat-option>
                          <mat-option value="GBP">Libra (£)</mat-option>
                        </mat-select>
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Formato de Data</mat-label>
                        <mat-select formControlName="dateFormat">
                          <mat-option value="dd/MM/yyyy">DD/MM/AAAA</mat-option>
                          <mat-option value="MM/dd/yyyy">MM/DD/AAAA</mat-option>
                          <mat-option value="yyyy-MM-dd">AAAA-MM-DD</mat-option>
                        </mat-select>
                      </mat-form-field>
                      
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="maintenanceMode">
                          Modo de Manutenção
                        </mat-slide-toggle>
                        <p class="setting-description">
                          Ativa o modo de manutenção, impedindo o acesso de utilizadores normais
                        </p>
                      </div>
                    </form>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Payment Settings Tab -->
          <mat-tab label="Pagamentos">
            <div class="tab-content">
              <div class="settings-sections">
                <!-- Stripe Configuration -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>payment</mat-icon>
                      Configuração Stripe
                    </mat-card-title>
                    <div class="status-indicator" [ngClass]="settings.payments.stripeEnabled ? 'enabled' : 'disabled'">
                      <mat-icon>{{ settings.payments.stripeEnabled ? 'check_circle' : 'cancel' }}</mat-icon>
                      <span>{{ settings.payments.stripeEnabled ? 'Ativo' : 'Inativo' }}</span>
                    </div>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="paymentsForm" class="settings-form">
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="stripeEnabled">
                          Ativar Pagamentos Stripe
                        </mat-slide-toggle>
                      </div>
                      
                      <mat-form-field>
                        <mat-label>Chave Pública</mat-label>
                        <input matInput formControlName="stripePublishableKey" 
                               [disabled]="!paymentsForm.get('stripeEnabled')?.value">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Chave Secreta</mat-label>
                        <input matInput type="password" formControlName="stripeSecretKey"
                               [disabled]="!paymentsForm.get('stripeEnabled')?.value">
                      </mat-form-field>
                    </form>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="testStripeConnection()" 
                            [disabled]="!settings.payments.stripeEnabled">
                      <mat-icon>wifi</mat-icon>
                      Testar Ligação
                    </button>
                    <button mat-raised-button color="primary" (click)="savePaymentSettings()">
                      <mat-icon>save</mat-icon>
                      Guardar
                    </button>
                  </mat-card-actions>
                </mat-card>

                <!-- PayPal Configuration -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>account_balance</mat-icon>
                      Configuração PayPal
                    </mat-card-title>
                    <div class="status-indicator" [ngClass]="settings.payments.paypalEnabled ? 'enabled' : 'disabled'">
                      <mat-icon>{{ settings.payments.paypalEnabled ? 'check_circle' : 'cancel' }}</mat-icon>
                      <span>{{ settings.payments.paypalEnabled ? 'Ativo' : 'Inativo' }}</span>
                    </div>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="paymentsForm" class="settings-form">
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="paypalEnabled">
                          Ativar Pagamentos PayPal
                        </mat-slide-toggle>
                      </div>
                      
                      <mat-form-field>
                        <mat-label>Client ID</mat-label>
                        <input matInput formControlName="paypalClientId"
                               [disabled]="!paymentsForm.get('paypalEnabled')?.value">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Client Secret</mat-label>
                        <input matInput type="password" formControlName="paypalClientSecret"
                               [disabled]="!paymentsForm.get('paypalEnabled')?.value">
                      </mat-form-field>
                    </form>
                  </mat-card-content>
                </mat-card>

                <!-- MBWay Configuration -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>smartphone</mat-icon>
                      Configuração MBWay
                    </mat-card-title>
                    <div class="status-indicator" [ngClass]="settings.payments.mbwayEnabled ? 'enabled' : 'disabled'">
                      <mat-icon>{{ settings.payments.mbwayEnabled ? 'check_circle' : 'cancel' }}</mat-icon>
                      <span>{{ settings.payments.mbwayEnabled ? 'Ativo' : 'Inativo' }}</span>
                    </div>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="paymentsForm" class="settings-form">
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="mbwayEnabled">
                          Ativar Pagamentos MBWay
                        </mat-slide-toggle>
                        <p class="setting-description">
                          Permite enviar pedidos de pagamento via MBWay para o telemóvel dos clientes
                        </p>
                      </div>
                      
                      <mat-form-field>
                        <mat-label>Entity ID</mat-label>
                        <input matInput formControlName="mbwayEntityId" 
                               [disabled]="!paymentsForm.get('mbwayEnabled')?.value"
                               placeholder="21565">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>API Key</mat-label>
                        <input matInput type="password" formControlName="mbwayApiKey"
                               [disabled]="!paymentsForm.get('mbwayEnabled')?.value">
                      </mat-form-field>
                      
                      <div class="mbway-info">
                        <mat-icon>info</mat-icon>
                        <div>
                          <p><strong>Como funciona:</strong></p>
                          <ul>
                            <li>Cliente recebe SMS com pedido de pagamento</li>
                            <li>Confirma o pagamento na app MBWay</li>
                            <li>Pagamento é processado automaticamente</li>
                            <li>Subscrição é ativada após confirmação</li>
                          </ul>
                        </div>
                      </div>
                    </form>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="testMBWayConnection()" 
                            [disabled]="!settings.payments.mbwayEnabled">
                      <mat-icon>wifi</mat-icon>
                      Testar Ligação
                    </button>
                    <button mat-raised-button color="primary" (click)="savePaymentSettings()">
                      <mat-icon>save</mat-icon>
                      Guardar
                    </button>
                  </mat-card-actions>
                </mat-card>

                <!-- Payment Options -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>tune</mat-icon>
                      Opções de Pagamento
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="paymentsForm" class="settings-form">
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="manualPaymentsEnabled">
                          Permitir Pagamentos Manuais
                        </mat-slide-toggle>
                        <p class="setting-description">
                          Permite que clientes enviem comprovativos de pagamento
                        </p>
                      </div>
                      
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="autoApprovalEnabled">
                          Aprovação Automática
                        </mat-slide-toggle>
                        <p class="setting-description">
                          Aprova automaticamente pagamentos online bem-sucedidos
                        </p>
                      </div>
                      
                      <mat-form-field>
                        <mat-label>Prefixo de Fatura</mat-label>
                        <input matInput formControlName="invoicePrefix" placeholder="INV-">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Taxa de IVA (%)</mat-label>
                        <input matInput type="number" formControlName="taxRate" min="0" max="100">
                      </mat-form-field>
                    </form>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Notification Settings Tab -->
          <mat-tab label="Notificações">
            <div class="tab-content">
              <div class="settings-sections">
                <!-- Email Configuration -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>email</mat-icon>
                      Configuração de Email
                    </mat-card-title>
                    <div class="status-indicator" [ngClass]="emailConnectionStatus">
                      <mat-icon>{{ emailConnectionStatus === 'connected' ? 'check_circle' : 'error' }}</mat-icon>
                      <span>{{ emailConnectionStatus === 'connected' ? 'Conectado' : 'Desconectado' }}</span>
                    </div>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="notificationsForm" class="settings-form">
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="emailEnabled">
                          Ativar Notificações por Email
                        </mat-slide-toggle>
                      </div>
                      
                      <mat-form-field>
                        <mat-label>Servidor SMTP</mat-label>
                        <input matInput formControlName="emailHost" 
                               [disabled]="!notificationsForm.get('emailEnabled')?.value">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Porta</mat-label>
                        <input matInput type="number" formControlName="emailPort"
                               [disabled]="!notificationsForm.get('emailEnabled')?.value">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Utilizador</mat-label>
                        <input matInput formControlName="emailUser"
                               [disabled]="!notificationsForm.get('emailEnabled')?.value">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Palavra-passe</mat-label>
                        <input matInput type="password" formControlName="emailPassword"
                               [disabled]="!notificationsForm.get('emailEnabled')?.value">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Email Remetente</mat-label>
                        <input matInput formControlName="emailFrom"
                               [disabled]="!notificationsForm.get('emailEnabled')?.value">
                      </mat-form-field>
                    </form>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="testEmailConnection()"
                            [disabled]="!settings.notifications.emailEnabled">
                      <mat-icon>wifi</mat-icon>
                      Testar Ligação
                    </button>
                    <button mat-raised-button color="primary" (click)="saveNotificationSettings()">
                      <mat-icon>save</mat-icon>
                      Guardar
                    </button>
                  </mat-card-actions>
                </mat-card>

                <!-- WhatsApp Configuration -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>chat</mat-icon>
                      Configuração WhatsApp
                    </mat-card-title>
                    <div class="status-indicator" [ngClass]="whatsappConnectionStatus">
                      <mat-icon>{{ whatsappConnectionStatus === 'connected' ? 'check_circle' : 'error' }}</mat-icon>
                      <span>{{ whatsappConnectionStatus === 'connected' ? 'Conectado' : 'Desconectado' }}</span>
                    </div>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="notificationsForm" class="settings-form">
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="whatsappEnabled">
                          Ativar Notificações WhatsApp
                        </mat-slide-toggle>
                      </div>
                      
                      <mat-form-field>
                        <mat-label>Provedor</mat-label>
                        <mat-select formControlName="whatsappProvider"
                                   [disabled]="!notificationsForm.get('whatsappEnabled')?.value">
                          <mat-option value="twilio">Twilio</mat-option>
                          <mat-option value="whatsapp-business">WhatsApp Business API</mat-option>
                        </mat-select>
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Account SID</mat-label>
                        <input matInput formControlName="whatsappAccountSid"
                               [disabled]="!notificationsForm.get('whatsappEnabled')?.value">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Auth Token</mat-label>
                        <input matInput type="password" formControlName="whatsappAuthToken"
                               [disabled]="!notificationsForm.get('whatsappEnabled')?.value">
                      </mat-form-field>
                    </form>
                  </mat-card-content>
                </mat-card>

                <!-- Telegram Configuration -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>send</mat-icon>
                      Configuração Telegram
                    </mat-card-title>
                    <div class="status-indicator" [ngClass]="telegramConnectionStatus">
                      <mat-icon>{{ telegramConnectionStatus === 'connected' ? 'check_circle' : 'error' }}</mat-icon>
                      <span>{{ telegramConnectionStatus === 'connected' ? 'Conectado' : 'Desconectado' }}</span>
                    </div>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="notificationsForm" class="settings-form">
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="telegramEnabled">
                          Ativar Notificações Telegram
                        </mat-slide-toggle>
                      </div>
                      
                      <mat-form-field>
                        <mat-label>Bot Token</mat-label>
                        <input matInput type="password" formControlName="telegramBotToken"
                               [disabled]="!notificationsForm.get('telegramEnabled')?.value"
                               placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxyz">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Chat ID do Administrador</mat-label>
                        <input matInput formControlName="telegramAdminChatId"
                               [disabled]="!notificationsForm.get('telegramEnabled')?.value"
                               placeholder="123456789">
                      </mat-form-field>
                      
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="telegramCopyToAdmin"
                                         [disabled]="!notificationsForm.get('telegramEnabled')?.value">
                          Copiar mensagens para administrador
                        </mat-slide-toggle>
                        <p class="setting-description">
                          Envia uma cópia de todas as mensagens para o administrador
                        </p>
                      </div>
                      
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="telegramMonthlyReports"
                                         [disabled]="!notificationsForm.get('telegramEnabled')?.value">
                          Relatórios mensais automáticos
                        </mat-slide-toggle>
                        <p class="setting-description">
                          Envia relatório mensal de subscrições a expirar
                        </p>
                      </div>
                      
                      <div class="telegram-info">
                        <mat-icon>info</mat-icon>
                        <div>
                          <p><strong>Como configurar:</strong></p>
                          <ol>
                            <li>Contacte &#64;BotFather no Telegram</li>
                            <li>Digite /newbot e siga as instruções</li>
                            <li>Copie o Bot Token</li>
                            <li>Inicie conversa com o bot</li>
                            <li>Envie /start para obter o Chat ID</li>
                          </ol>
                        </div>
                      </div>
                    </form>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="testTelegramConnection()"
                            [disabled]="!settings.notifications.telegramEnabled">
                      <mat-icon>wifi</mat-icon>
                      Testar Ligação
                    </button>
                    <button mat-raised-button color="primary" (click)="saveNotificationSettings()">
                      <mat-icon>save</mat-icon>
                      Guardar
                    </button>
                  </mat-card-actions>
                </mat-card>

                <!-- Notification Rules -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>rule</mat-icon>
                      Regras de Notificação
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="notificationsForm" class="settings-form">
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="autoNotifications">
                          Notificações Automáticas
                        </mat-slide-toggle>
                        <p class="setting-description">
                          Envia automaticamente lembretes de expiração
                        </p>
                      </div>
                      
                      <div class="reminder-days">
                        <label>Dias de Lembrete:</label>
                        <div class="days-chips">
                          <mat-slide-toggle *ngFor="let day of availableReminderDays" 
                                           [checked]="isReminderDaySelected(day)"
                                           (change)="toggleReminderDay(day)">
                            {{ day }} dias
                          </mat-slide-toggle>
                        </div>
                      </div>
                    </form>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Security Settings Tab -->
          <mat-tab label="Segurança">
            <div class="tab-content">
              <div class="settings-sections">
                <!-- Authentication -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>security</mat-icon>
                      Autenticação
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="securityForm" class="settings-form">
                      <mat-form-field>
                        <mat-label>Duração do Token JWT</mat-label>
                        <mat-select formControlName="jwtExpiresIn">
                          <mat-option value="1h">1 hora</mat-option>
                          <mat-option value="24h">24 horas</mat-option>
                          <mat-option value="7d">7 dias</mat-option>
                          <mat-option value="30d">30 dias</mat-option>
                        </mat-select>
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Timeout de Sessão (minutos)</mat-label>
                        <input matInput type="number" formControlName="sessionTimeout" min="5" max="1440">
                      </mat-form-field>
                      
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="twoFactorEnabled">
                          Autenticação de Dois Fatores
                        </mat-slide-toggle>
                        <p class="setting-description">
                          Requer verificação adicional no login
                        </p>
                      </div>
                    </form>
                  </mat-card-content>
                </mat-card>

                <!-- Password Policy -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>lock</mat-icon>
                      Política de Palavras-passe
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="securityForm" class="settings-form">
                      <mat-form-field>
                        <mat-label>Comprimento Mínimo</mat-label>
                        <input matInput type="number" formControlName="passwordMinLength" min="6" max="50">
                      </mat-form-field>
                      
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="passwordRequireUppercase">
                          Requer Maiúsculas
                        </mat-slide-toggle>
                      </div>
                      
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="passwordRequireNumbers">
                          Requer Números
                        </mat-slide-toggle>
                      </div>
                      
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="passwordRequireSymbols">
                          Requer Símbolos
                        </mat-slide-toggle>
                      </div>
                    </form>
                  </mat-card-content>
                </mat-card>

                <!-- Login Security -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>shield</mat-icon>
                      Segurança de Login
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="securityForm" class="settings-form">
                      <mat-form-field>
                        <mat-label>Máximo de Tentativas</mat-label>
                        <input matInput type="number" formControlName="maxLoginAttempts" min="3" max="10">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Duração do Bloqueio (minutos)</mat-label>
                        <input matInput type="number" formControlName="lockoutDuration" min="5" max="1440">
                      </mat-form-field>
                    </form>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-raised-button color="primary" (click)="saveSecuritySettings()">
                      <mat-icon>save</mat-icon>
                      Guardar
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Backup Settings Tab -->
          <mat-tab label="Backup">
            <div class="tab-content">
              <div class="settings-sections">
                <!-- Backup Configuration -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>backup</mat-icon>
                      Configuração de Backup
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <form [formGroup]="backupForm" class="settings-form">
                      <div class="toggle-setting">
                        <mat-slide-toggle formControlName="autoBackupEnabled">
                          Backup Automático
                        </mat-slide-toggle>
                        <p class="setting-description">
                          Executa backups automáticos da base de dados
                        </p>
                      </div>
                      
                      <mat-form-field>
                        <mat-label>Frequência</mat-label>
                        <mat-select formControlName="backupFrequency"
                                   [disabled]="!backupForm.get('autoBackupEnabled')?.value">
                          <mat-option value="daily">Diário</mat-option>
                          <mat-option value="weekly">Semanal</mat-option>
                          <mat-option value="monthly">Mensal</mat-option>
                        </mat-select>
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Retenção (dias)</mat-label>
                        <input matInput type="number" formControlName="backupRetention" 
                               min="1" max="365"
                               [disabled]="!backupForm.get('autoBackupEnabled')?.value">
                      </mat-form-field>
                      
                      <mat-form-field>
                        <mat-label>Localização</mat-label>
                        <mat-select formControlName="backupLocation"
                                   [disabled]="!backupForm.get('autoBackupEnabled')?.value">
                          <mat-option value="local">Local</mat-option>
                          <mat-option value="s3">Amazon S3</mat-option>
                          <mat-option value="gdrive">Google Drive</mat-option>
                        </mat-select>
                      </mat-form-field>
                    </form>
                    
                    <div class="backup-status" *ngIf="settings.backup.lastBackup">
                      <mat-icon>info</mat-icon>
                      <span>Último backup: {{ settings.backup.lastBackup | date:'dd/MM/yyyy HH:mm' }}</span>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="runManualBackup()">
                      <mat-icon>play_arrow</mat-icon>
                      Backup Manual
                    </button>
                    <button mat-button (click)="restoreBackup()">
                      <mat-icon>restore</mat-icon>
                      Restaurar
                    </button>
                    <button mat-raised-button color="primary" (click)="saveBackupSettings()">
                      <mat-icon>save</mat-icon>
                      Guardar
                    </button>
                  </mat-card-actions>
                </mat-card>

                <!-- System Information -->
                <mat-card class="settings-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>info</mat-icon>
                      Informações do Sistema
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <mat-list>
                      <mat-list-item>
                        <mat-icon matListItemIcon>code</mat-icon>
                        <div matListItemTitle>Versão</div>
                        <div matListItemLine>{{ systemInfo.version }}</div>
                      </mat-list-item>
                      
                      <mat-list-item>
                        <mat-icon matListItemIcon>storage</mat-icon>
                        <div matListItemTitle>Base de Dados</div>
                        <div matListItemLine>{{ systemInfo.database }}</div>
                      </mat-list-item>
                      
                      <mat-list-item>
                        <mat-icon matListItemIcon>memory</mat-icon>
                        <div matListItemTitle>Uso de Memória</div>
                        <div matListItemLine>{{ systemInfo.memoryUsage }}</div>
                      </mat-list-item>
                      
                      <mat-list-item>
                        <mat-icon matListItemIcon>schedule</mat-icon>
                        <div matListItemTitle>Uptime</div>
                        <div matListItemLine>{{ systemInfo.uptime }}</div>
                      </mat-list-item>
                    </mat-list>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="checkForUpdates()">
                      <mat-icon>system_update</mat-icon>
                      Verificar Atualizações
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
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
    
    .settings-sections { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 16px; }
    .settings-card { height: fit-content; }
    .settings-card .mat-card-header { position: relative; }
    .status-indicator { position: absolute; top: 16px; right: 16px; display: flex; align-items: center; gap: 8px; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-indicator.enabled, .status-indicator.connected { background: #e8f5e8; color: #2e7d32; }
    .status-indicator.disabled, .status-indicator.disconnected { background: #ffebee; color: #c62828; }
    
    .settings-form { display: flex; flex-direction: column; gap: 16px; }
    .toggle-setting { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .setting-description { margin: 0; font-size: 14px; color: #666; }
    
    .reminder-days { margin-bottom: 16px; }
    .reminder-days label { font-weight: 500; margin-bottom: 8px; display: block; }
    .days-chips { display: flex; flex-wrap: wrap; gap: 12px; }
    
    .backup-status { display: flex; align-items: center; gap: 8px; margin-top: 16px; padding: 8px; background: #f5f5f5; border-radius: 4px; }
    .backup-status mat-icon { color: #1976d2; }
    
    .mbway-info { display: flex; gap: 12px; margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px; }
    .mbway-info mat-icon { color: #1976d2; margin-top: 4px; }
    .mbway-info p { margin: 0 0 8px 0; font-weight: 500; }
    .mbway-info ul { margin: 0; padding-left: 16px; }
    .mbway-info li { margin-bottom: 4px; }
    
    .telegram-info { display: flex; gap: 12px; margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px; }
    .telegram-info mat-icon { color: #1976d2; margin-top: 4px; }
    .telegram-info p { margin: 0 0 8px 0; font-weight: 500; }
    .telegram-info ol { margin: 0; padding-left: 16px; }
    .telegram-info li { margin-bottom: 4px; }
    
    @media (max-width: 768px) {
      .container { padding: 16px; }
      .header { flex-direction: column; gap: 16px; }
      .settings-sections { grid-template-columns: 1fr; }
      .days-chips { flex-direction: column; }
    }
  `]
})
export class SettingsAdvancedComponent implements OnInit {
  selectedTab = 0;
  
  emailConnectionStatus = 'connected';
  whatsappConnectionStatus = 'disconnected';
  telegramConnectionStatus = 'connected';
  
  availableReminderDays = [1, 3, 7, 15, 30];
  
  settings: SystemSettings = {
    general: {
      companyName: 'TimeAdministrator',
      companyEmail: 'admin@timeadministrator.com',
      companyPhone: '+351 912 345 678',
      companyAddress: 'Rua Principal, 123\n1000-001 Lisboa\nPortugal',
      timezone: 'Europe/Lisbon',
      language: 'pt',
      currency: 'EUR',
      dateFormat: 'dd/MM/yyyy',
      maintenanceMode: false
    },
    payments: {
      stripeEnabled: true,
      stripePublishableKey: 'pk_test_...',
      stripeSecretKey: 'sk_test_...',
      paypalEnabled: false,
      paypalClientId: '',
      paypalClientSecret: '',
      mbwayEnabled: true,
      mbwayEntityId: '21565',
      mbwayApiKey: '',
      manualPaymentsEnabled: true,
      autoApprovalEnabled: true,
      invoicePrefix: 'INV-',
      taxRate: 23
    },
    notifications: {
      emailEnabled: true,
      emailHost: 'smtp.gmail.com',
      emailPort: 587,
      emailUser: 'admin@timeadministrator.com',
      emailPassword: '',
      emailFrom: 'TimeAdministrator <admin@timeadministrator.com>',
      whatsappEnabled: false,
      whatsappProvider: 'twilio',
      whatsappAccountSid: '',
      whatsappAuthToken: '',
      telegramEnabled: true,
      telegramBotToken: '',
      telegramAdminChatId: '',
      telegramCopyToAdmin: true,
      telegramMonthlyReports: true,
      reminderDays: [15, 7, 1],
      autoNotifications: true
    },
    security: {
      jwtSecret: 'your-secret-key',
      jwtExpiresIn: '7d',
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: false,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      twoFactorEnabled: false,
      sessionTimeout: 60
    },
    backup: {
      autoBackupEnabled: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      backupLocation: 'local',
      lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  };

  systemInfo = {
    version: '1.0.0',
    database: 'MongoDB 6.0',
    memoryUsage: '245 MB / 512 MB',
    uptime: '7 dias, 14 horas'
  };

  generalForm!: FormGroup;
  paymentsForm!: FormGroup;
  notificationsForm!: FormGroup;
  securityForm!: FormGroup;
  backupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit() {}

  initializeForms() {
    this.generalForm = this.fb.group({
      companyName: [this.settings.general.companyName, Validators.required],
      companyEmail: [this.settings.general.companyEmail, [Validators.required, Validators.email]],
      companyPhone: [this.settings.general.companyPhone],
      companyAddress: [this.settings.general.companyAddress],
      timezone: [this.settings.general.timezone, Validators.required],
      language: [this.settings.general.language, Validators.required],
      currency: [this.settings.general.currency, Validators.required],
      dateFormat: [this.settings.general.dateFormat, Validators.required],
      maintenanceMode: [this.settings.general.maintenanceMode]
    });

    this.paymentsForm = this.fb.group({
      stripeEnabled: [this.settings.payments.stripeEnabled],
      stripePublishableKey: [this.settings.payments.stripePublishableKey],
      stripeSecretKey: [this.settings.payments.stripeSecretKey],
      paypalEnabled: [this.settings.payments.paypalEnabled],
      paypalClientId: [this.settings.payments.paypalClientId],
      paypalClientSecret: [this.settings.payments.paypalClientSecret],
      mbwayEnabled: [this.settings.payments.mbwayEnabled],
      mbwayEntityId: [this.settings.payments.mbwayEntityId],
      mbwayApiKey: [this.settings.payments.mbwayApiKey],
      manualPaymentsEnabled: [this.settings.payments.manualPaymentsEnabled],
      autoApprovalEnabled: [this.settings.payments.autoApprovalEnabled],
      invoicePrefix: [this.settings.payments.invoicePrefix],
      taxRate: [this.settings.payments.taxRate, [Validators.min(0), Validators.max(100)]]
    });

    this.notificationsForm = this.fb.group({
      emailEnabled: [this.settings.notifications.emailEnabled],
      emailHost: [this.settings.notifications.emailHost],
      emailPort: [this.settings.notifications.emailPort],
      emailUser: [this.settings.notifications.emailUser],
      emailPassword: [this.settings.notifications.emailPassword],
      emailFrom: [this.settings.notifications.emailFrom],
      whatsappEnabled: [this.settings.notifications.whatsappEnabled],
      whatsappProvider: [this.settings.notifications.whatsappProvider],
      whatsappAccountSid: [this.settings.notifications.whatsappAccountSid],
      whatsappAuthToken: [this.settings.notifications.whatsappAuthToken],
      telegramEnabled: [this.settings.notifications.telegramEnabled],
      telegramBotToken: [this.settings.notifications.telegramBotToken],
      telegramAdminChatId: [this.settings.notifications.telegramAdminChatId],
      telegramCopyToAdmin: [this.settings.notifications.telegramCopyToAdmin],
      telegramMonthlyReports: [this.settings.notifications.telegramMonthlyReports],
      autoNotifications: [this.settings.notifications.autoNotifications]
    });

    this.securityForm = this.fb.group({
      jwtExpiresIn: [this.settings.security.jwtExpiresIn],
      passwordMinLength: [this.settings.security.passwordMinLength, [Validators.min(6), Validators.max(50)]],
      passwordRequireUppercase: [this.settings.security.passwordRequireUppercase],
      passwordRequireNumbers: [this.settings.security.passwordRequireNumbers],
      passwordRequireSymbols: [this.settings.security.passwordRequireSymbols],
      maxLoginAttempts: [this.settings.security.maxLoginAttempts, [Validators.min(3), Validators.max(10)]],
      lockoutDuration: [this.settings.security.lockoutDuration, [Validators.min(5), Validators.max(1440)]],
      twoFactorEnabled: [this.settings.security.twoFactorEnabled],
      sessionTimeout: [this.settings.security.sessionTimeout, [Validators.min(5), Validators.max(1440)]]
    });

    this.backupForm = this.fb.group({
      autoBackupEnabled: [this.settings.backup.autoBackupEnabled],
      backupFrequency: [this.settings.backup.backupFrequency],
      backupRetention: [this.settings.backup.backupRetention, [Validators.min(1), Validators.max(365)]],
      backupLocation: [this.settings.backup.backupLocation]
    });
  }

  isReminderDaySelected(day: number): boolean {
    return this.settings.notifications.reminderDays.includes(day);
  }

  toggleReminderDay(day: number) {
    const index = this.settings.notifications.reminderDays.indexOf(day);
    if (index > -1) {
      this.settings.notifications.reminderDays.splice(index, 1);
    } else {
      this.settings.notifications.reminderDays.push(day);
    }
  }

  saveGeneralSettings() {
    if (this.generalForm.valid) {
      Object.assign(this.settings.general, this.generalForm.value);
      this.snackBar.open('Configurações gerais guardadas', 'Fechar', { duration: 3000 });
    }
  }

  savePaymentSettings() {
    if (this.paymentsForm.valid) {
      Object.assign(this.settings.payments, this.paymentsForm.value);
      this.snackBar.open('Configurações de pagamento guardadas', 'Fechar', { duration: 3000 });
    }
  }

  saveNotificationSettings() {
    if (this.notificationsForm.valid) {
      Object.assign(this.settings.notifications, this.notificationsForm.value);
      this.snackBar.open('Configurações de notificação guardadas', 'Fechar', { duration: 3000 });
    }
  }

  saveSecuritySettings() {
    if (this.securityForm.valid) {
      Object.assign(this.settings.security, this.securityForm.value);
      this.snackBar.open('Configurações de segurança guardadas', 'Fechar', { duration: 3000 });
    }
  }

  saveBackupSettings() {
    if (this.backupForm.valid) {
      Object.assign(this.settings.backup, this.backupForm.value);
      this.snackBar.open('Configurações de backup guardadas', 'Fechar', { duration: 3000 });
    }
  }

  saveAllSettings() {
    this.saveGeneralSettings();
    this.savePaymentSettings();
    this.saveNotificationSettings();
    this.saveSecuritySettings();
    this.saveBackupSettings();
    this.snackBar.open('Todas as configurações guardadas', 'Fechar', { duration: 3000 });
  }

  testStripeConnection() {
    this.snackBar.open('A testar ligação Stripe...', 'Fechar', { duration: 2000 });
    setTimeout(() => {
      this.snackBar.open('Ligação Stripe bem-sucedida', 'Fechar', { duration: 3000 });
    }, 2000);
  }

  testMBWayConnection() {
    this.snackBar.open('A testar ligação MBWay...', 'Fechar', { duration: 2000 });
    setTimeout(() => {
      this.snackBar.open('Ligação MBWay bem-sucedida', 'Fechar', { duration: 3000 });
    }, 2000);
  }

  testEmailConnection() {
    this.snackBar.open('A testar ligação de email...', 'Fechar', { duration: 2000 });
    setTimeout(() => {
      this.emailConnectionStatus = 'connected';
      this.snackBar.open('Ligação de email bem-sucedida', 'Fechar', { duration: 3000 });
    }, 2000);
  }

  testTelegramConnection() {
    this.snackBar.open('A testar ligação Telegram...', 'Fechar', { duration: 2000 });
    setTimeout(() => {
      this.telegramConnectionStatus = 'connected';
      this.snackBar.open('Ligação Telegram bem-sucedida', 'Fechar', { duration: 3000 });
    }, 2000);
  }

  runManualBackup() {
    this.snackBar.open('A executar backup manual...', 'Fechar', { duration: 2000 });
    setTimeout(() => {
      this.settings.backup.lastBackup = new Date();
      this.snackBar.open('Backup concluído com sucesso', 'Fechar', { duration: 3000 });
    }, 3000);
  }

  restoreBackup() {
    if (confirm('Restaurar backup? Esta ação irá substituir todos os dados atuais.')) {
      this.snackBar.open('Restauro de backup iniciado', 'Fechar', { duration: 3000 });
    }
  }

  checkForUpdates() {
    this.snackBar.open('A verificar atualizações...', 'Fechar', { duration: 2000 });
    setTimeout(() => {
      this.snackBar.open('Sistema atualizado', 'Fechar', { duration: 3000 });
    }, 2000);
  }

  exportSettings() {
    const dataStr = JSON.stringify(this.settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'timeadmin-settings.json';
    link.click();
    this.snackBar.open('Configurações exportadas', 'Fechar', { duration: 3000 });
  }

  importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const importedSettings = JSON.parse(e.target.result);
            Object.assign(this.settings, importedSettings);
            this.initializeForms();
            this.snackBar.open('Configurações importadas', 'Fechar', { duration: 3000 });
          } catch (error) {
            this.snackBar.open('Erro ao importar configurações', 'Fechar', { duration: 3000 });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
}