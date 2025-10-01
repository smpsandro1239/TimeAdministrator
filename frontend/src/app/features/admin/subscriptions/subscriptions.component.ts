import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="page-container">
        <div class="header">
          <h1>Subscrições</h1>
          <p>Gerir todas as subscrições de clientes</p>
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            Nova Subscrição
          </button>
        </div>
        
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon active">check_circle</mat-icon>
                <div>
                  <h3>18</h3>
                  <p>Ativas</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon warning">warning</mat-icon>
                <div>
                  <h3>3</h3>
                  <p>A Expirar</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon expired">cancel</mat-icon>
                <div>
                  <h3>2</h3>
                  <p>Expiradas</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        
        <mat-card class="content-card">
          <mat-card-header>
            <mat-card-title>Subscrições Recentes</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="subscription-list">
              <div class="subscription-item">
                <div class="client-info">
                  <h4>João Silva</h4>
                  <p>Plano Mensal - €29.99</p>
                </div>
                <div class="status active">Ativa</div>
                <div class="expires">Expira em 15 dias</div>
              </div>
              
              <div class="subscription-item">
                <div class="client-info">
                  <h4>Maria Santos</h4>
                  <p>Plano Anual - €279.99</p>
                </div>
                <div class="status warning">A Expirar</div>
                <div class="expires">Expira em 3 dias</div>
              </div>
              
              <div class="subscription-item">
                <div class="client-info">
                  <h4>Pedro Costa</h4>
                  <p>Plano Trimestral - €79.99</p>
                </div>
                <div class="status expired">Expirada</div>
                <div class="expires">Expirou há 2 dias</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header h1 { margin: 0; color: #333; }
    .header p { margin: 8px 0 0 0; color: #666; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
    .stat-content { display: flex; align-items: center; gap: 16px; }
    .stat-icon { font-size: 32px; width: 32px; height: 32px; }
    .stat-icon.active { color: #4CAF50; }
    .stat-icon.warning { color: #FF9800; }
    .stat-icon.expired { color: #f44336; }
    .stat-content h3 { margin: 0; font-size: 24px; color: #333; }
    .stat-content p { margin: 0; color: #666; }
    .content-card { margin-top: 24px; }
    .subscription-list { display: flex; flex-direction: column; gap: 16px; }
    .subscription-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; }
    .client-info h4 { margin: 0; color: #333; }
    .client-info p { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    .status { padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 500; }
    .status.active { background: #e8f5e8; color: #4CAF50; }
    .status.warning { background: #fff3e0; color: #FF9800; }
    .status.expired { background: #ffebee; color: #f44336; }
    .expires { font-size: 14px; color: #666; }
  `]
})
export class SubscriptionsComponent {}