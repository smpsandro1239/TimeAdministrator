import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="page-container">
        <div class="header">
          <h1>Notificações</h1>
          <p>Sistema de email e WhatsApp automáticos</p>
          <button mat-raised-button color="primary">
            <mat-icon>send</mat-icon>
            Enviar Notificação
          </button>
        </div>
        
        <mat-tab-group>
          <mat-tab label="Emails">
            <div class="tab-content">
              <div class="notification-stats">
                <mat-card class="stat-card">
                  <mat-card-content>
                    <mat-icon class="email-icon">email</mat-icon>
                    <h3>156</h3>
                    <p>Emails Enviados</p>
                  </mat-card-content>
                </mat-card>
                
                <mat-card class="stat-card">
                  <mat-card-content>
                    <mat-icon class="success-icon">check_circle</mat-icon>
                    <h3>142</h3>
                    <p>Entregues</p>
                  </mat-card-content>
                </mat-card>
                
                <mat-card class="stat-card">
                  <mat-card-content>
                    <mat-icon class="error-icon">error</mat-icon>
                    <h3>14</h3>
                    <p>Falharam</p>
                  </mat-card-content>
                </mat-card>
              </div>
              
              <mat-card class="recent-notifications">
                <mat-card-header>
                  <mat-card-title>Emails Recentes</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="notification-item">
                    <div class="notification-info">
                      <strong>Lembrete de Expiração</strong>
                      <p>Enviado para 5 clientes</p>
                    </div>
                    <div class="notification-status success">Entregue</div>
                    <div class="notification-date">Hoje, 09:30</div>
                  </div>
                  
                  <div class="notification-item">
                    <div class="notification-info">
                      <strong>Bem-vindo</strong>
                      <p>Enviado para 2 novos clientes</p>
                    </div>
                    <div class="notification-status success">Entregue</div>
                    <div class="notification-date">Ontem, 15:45</div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
          
          <mat-tab label="WhatsApp">
            <div class="tab-content">
              <div class="notification-stats">
                <mat-card class="stat-card">
                  <mat-card-content>
                    <mat-icon class="whatsapp-icon">chat</mat-icon>
                    <h3>89</h3>
                    <p>Mensagens Enviadas</p>
                  </mat-card-content>
                </mat-card>
                
                <mat-card class="stat-card">
                  <mat-card-content>
                    <mat-icon class="success-icon">check_circle</mat-icon>
                    <h3>85</h3>
                    <p>Entregues</p>
                  </mat-card-content>
                </mat-card>
                
                <mat-card class="stat-card">
                  <mat-card-content>
                    <mat-icon class="error-icon">error</mat-icon>
                    <h3>4</h3>
                    <p>Falharam</p>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </app-layout>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { margin-bottom: 24px; }
    .header h1 { margin: 0; color: #333; }
    .header p { margin: 8px 0 0 0; color: #666; }
    .empty-state { text-align: center; padding: 48px; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; color: #666; margin-bottom: 16px; }
    .empty-state h2 { margin: 0 0 8px 0; color: #333; }
    .empty-state p { margin: 0; color: #666; }
  `]
})
export class NotificationsComponent {}