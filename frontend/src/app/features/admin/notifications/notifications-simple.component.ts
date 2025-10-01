import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-notifications-simple',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="container">
        <div class="header">
          <h1>Sistema de Notificações</h1>
          <p>Gestão completa de emails e WhatsApp automáticos</p>
        </div>

        <mat-tab-group>
          <mat-tab label="Dashboard">
            <div class="tab-content">
              <div class="stats-grid">
                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon>email</mat-icon>
                      <span>Emails</span>
                    </div>
                    <div class="stat-value">156</div>
                    <div class="stat-details">
                      <span class="success">142 entregues (91%)</span>
                      <span class="error">14 falharam</span>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon>chat</mat-icon>
                      <span>WhatsApp</span>
                    </div>
                    <div class="stat-value">89</div>
                    <div class="stat-details">
                      <span class="success">85 entregues (95.5%)</span>
                      <span class="error">4 falharam</span>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon>notifications</mat-icon>
                      <span>Total</span>
                    </div>
                    <div class="stat-value">245</div>
                    <div class="stat-details">
                      <span class="success">227 entregues (92.7%)</span>
                      <span class="error">18 falharam</span>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>

              <div class="recent-section">
                <mat-card>
                  <mat-card-header>
                    <mat-card-title>Notificações Recentes</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="notification-item">
                      <mat-icon class="email-icon">email</mat-icon>
                      <div class="notification-info">
                        <div class="notification-title">Lembrete de Expiração</div>
                        <div class="notification-recipient">João Silva</div>
                        <div class="notification-time">Hoje, 09:30</div>
                      </div>
                      <span class="status-chip delivered">Entregue</span>
                    </div>

                    <div class="notification-item">
                      <mat-icon class="whatsapp-icon">chat</mat-icon>
                      <div class="notification-info">
                        <div class="notification-title">WhatsApp - Expiração</div>
                        <div class="notification-recipient">Maria Santos</div>
                        <div class="notification-time">Ontem, 15:45</div>
                      </div>
                      <span class="status-chip delivered">Entregue</span>
                    </div>

                    <div class="notification-item">
                      <mat-icon class="email-icon">email</mat-icon>
                      <div class="notification-info">
                        <div class="notification-title">Bem-vindo</div>
                        <div class="notification-recipient">Pedro Costa</div>
                        <div class="notification-time">Ontem, 10:15</div>
                      </div>
                      <span class="status-chip failed">Falhado</span>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Templates">
            <div class="tab-content">
              <div class="templates-grid">
                <mat-card class="template-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon class="email-icon">email</mat-icon>
                      Lembrete de Expiração - 15 dias
                    </mat-card-title>
                    <mat-card-subtitle>Email</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="template-subject">
                      <strong>Assunto:</strong> A sua subscrição expira em 15 dias
                    </div>
                    <div class="template-content">
                      Olá [clientName], a sua subscrição do plano [planName] expira em 15 dias...
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button><mat-icon>edit</mat-icon> Editar</button>
                    <button mat-button><mat-icon>send</mat-icon> Testar</button>
                  </mat-card-actions>
                </mat-card>

                <mat-card class="template-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon class="whatsapp-icon">chat</mat-icon>
                      WhatsApp - Expiração
                    </mat-card-title>
                    <mat-card-subtitle>WhatsApp</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="template-content">
                      Olá [clientName]! A sua subscrição expira em [daysLeft] dias...
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button><mat-icon>edit</mat-icon> Editar</button>
                    <button mat-button><mat-icon>send</mat-icon> Testar</button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Configurações">
            <div class="tab-content">
              <div class="config-grid">
                <mat-card>
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>email</mat-icon>
                      Configuração de Email
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="status-indicator connected">
                      <mat-icon>check_circle</mat-icon>
                      <span>Conectado</span>
                    </div>
                    <div class="config-details">
                      <p><strong>Servidor SMTP:</strong> smtp.gmail.com</p>
                      <p><strong>Porta:</strong> 587</p>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button><mat-icon>wifi</mat-icon> Testar</button>
                    <button mat-button><mat-icon>settings</mat-icon> Configurar</button>
                  </mat-card-actions>
                </mat-card>

                <mat-card>
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>chat</mat-icon>
                      Configuração WhatsApp
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="status-indicator disconnected">
                      <mat-icon>error</mat-icon>
                      <span>Desconectado</span>
                    </div>
                    <div class="config-details">
                      <p><strong>Provedor:</strong> Twilio</p>
                      <p><strong>API:</strong> WhatsApp Business</p>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button><mat-icon>wifi</mat-icon> Testar</button>
                    <button mat-button><mat-icon>settings</mat-icon> Configurar</button>
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
    .container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { margin-bottom: 24px; }
    .header h1 { margin: 0; color: #1976d2; font-size: 28px; }
    .header p { margin: 4px 0 0 0; color: #666; }
    .tab-content { padding: 24px 0; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-2px); }
    .stat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .stat-header mat-icon { font-size: 24px; color: #1976d2; }
    .stat-value { font-size: 32px; font-weight: 600; color: #1976d2; margin-bottom: 8px; }
    .stat-details { display: flex; flex-direction: column; gap: 4px; }
    .success { color: #2e7d32; }
    .error { color: #c62828; }
    
    .recent-section { margin-bottom: 24px; }
    .notification-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
    .notification-item:last-child { border-bottom: none; }
    .email-icon { color: #1976d2; }
    .whatsapp-icon { color: #25d366; }
    .notification-info { flex: 1; }
    .notification-title { font-weight: 500; margin-bottom: 4px; }
    .notification-recipient { color: #666; font-size: 14px; margin-bottom: 2px; }
    .notification-time { color: #999; font-size: 12px; }
    
    .status-chip { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-chip.delivered { background: #e8f5e8; color: #2e7d32; }
    .status-chip.failed { background: #ffebee; color: #c62828; }
    
    .templates-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 16px; }
    .template-card { transition: transform 0.2s; }
    .template-card:hover { transform: translateY(-2px); }
    .template-subject { margin-bottom: 8px; font-size: 14px; }
    .template-content { color: #666; line-height: 1.4; }
    
    .config-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    .status-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
    .status-indicator.connected { color: #2e7d32; }
    .status-indicator.disconnected { color: #c62828; }
    .config-details p { margin: 4px 0; color: #666; }
    
    @media (max-width: 768px) {
      .container { padding: 16px; }
      .stats-grid { grid-template-columns: 1fr; }
      .templates-grid { grid-template-columns: 1fr; }
      .config-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class NotificationsSimpleComponent implements OnInit {
  
  constructor() {}

  ngOnInit() {
    console.log('NotificationsSimpleComponent loaded');
  }
}