import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';

import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { UserRole } from '../../models/user.model';
import { DashboardMetrics } from '../../models/dashboard.model';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatGridListModule,
    LayoutComponent
  ],
  template: `
    <app-layout>
    <div class="dashboard-container">
      <div class="header">
        <h1>Dashboard - TimeAdministrator</h1>
        <p class="subtitle">Sistema de Gestão de Subscrições</p>
        
        <mat-form-field *ngIf="isAdmin" class="period-selector">
          <mat-label>Período</mat-label>
          <mat-select [(value)]="selectedPeriod" (selectionChange)="onPeriodChange()">
            <mat-option value="7d">Últimos 7 dias</mat-option>
            <mat-option value="30d">Últimos 30 dias</mat-option>
            <mat-option value="90d">Últimos 90 dias</mat-option>
            <mat-option value="all">Todos</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Métricas Admin -->
      <div *ngIf="isAdmin && metrics && !loading" class="metrics-section">
        <mat-grid-list cols="4" rowHeight="120px" gutterSize="16px">
          <mat-grid-tile>
            <mat-card class="metric-card">
              <mat-card-content>
                <div class="metric-content">
                  <mat-icon class="metric-icon clients">people</mat-icon>
                  <div class="metric-info">
                    <h3>{{ metrics.totalClients }}</h3>
                    <p>Total Clientes</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
          
          <mat-grid-tile>
            <mat-card class="metric-card">
              <mat-card-content>
                <div class="metric-content">
                  <mat-icon class="metric-icon subscriptions">subscriptions</mat-icon>
                  <div class="metric-info">
                    <h3>{{ metrics.activeSubscriptions }}</h3>
                    <p>Subscrições Ativas</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
          
          <mat-grid-tile>
            <mat-card class="metric-card">
              <mat-card-content>
                <div class="metric-content">
                  <mat-icon class="metric-icon warning">warning</mat-icon>
                  <div class="metric-info">
                    <h3>{{ metrics.expiringSoon }}</h3>
                    <p>A Expirar (30d)</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
          
          <mat-grid-tile>
            <mat-card class="metric-card">
              <mat-card-content>
                <div class="metric-content">
                  <mat-icon class="metric-icon payments">payment</mat-icon>
                  <div class="metric-info">
                    <h3>{{ metrics.pendingPayments }}</h3>
                    <p>Pagamentos Pendentes</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>
      </div>

      <!-- Ações Rápidas -->
      <div class="quick-actions" *ngIf="!loading">
        <h2>Ações Rápidas</h2>
        
        <!-- Ações Admin -->
        <div *ngIf="isAdmin" class="actions-grid">
          <mat-card class="action-card" (click)="navigate('/admin/clients')">
            <mat-card-content>
              <mat-icon>people</mat-icon>
              <h3>Gerir Clientes</h3>
              <p>Adicionar, editar e visualizar clientes</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="action-card" (click)="navigate('/admin/payments')">
            <mat-card-content>
              <mat-icon>payment</mat-icon>
              <h3>Aprovar Pagamentos</h3>
              <p>Gerir pagamentos pendentes</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="action-card" (click)="navigate('/admin/subscriptions')">
            <mat-card-content>
              <mat-icon>subscriptions</mat-icon>
              <h3>Subscrições</h3>
              <p>Gerir subscrições ativas</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="action-card" (click)="navigate('/admin/notifications')">
            <mat-card-content>
              <mat-icon>notifications</mat-icon>
              <h3>Notificações</h3>
              <p>Enviar notificações personalizadas</p>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Ações Cliente -->
        <div *ngIf="isClient" class="actions-grid">
          <mat-card class="action-card" (click)="navigate('/client/profile')">
            <mat-card-content>
              <mat-icon>person</mat-icon>
              <h3>Meu Perfil</h3>
              <p>Ver e editar informações pessoais</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="action-card" (click)="navigate('/client/subscription')">
            <mat-card-content>
              <mat-icon>card_membership</mat-icon>
              <h3>Minha Subscrição</h3>
              <p>Estado da subscrição atual</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="action-card" (click)="navigate('/client/payments')">
            <mat-card-content>
              <mat-icon>receipt</mat-icon>
              <h3>Meus Pagamentos</h3>
              <p>Histórico de pagamentos</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="action-card" (click)="navigate('/client/new-subscription')">
            <mat-card-content>
              <mat-icon>add_circle</mat-icon>
              <h3>Nova Subscrição</h3>
              <p>Adquirir nova subscrição</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="loading-container" *ngIf="loading">
        <mat-spinner></mat-spinner>
        <p>A carregar...</p>
      </div>
    </div>
    </app-layout>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .header h1 {
      color: #333;
      margin: 0;
      font-size: 28px;
    }

    .subtitle {
      color: #666;
      margin: 4px 0 0 0;
      font-size: 16px;
    }

    .period-selector {
      min-width: 150px;
    }

    .metrics-section {
      margin-bottom: 40px;
    }

    .metric-card {
      height: 100%;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .metric-content {
      display: flex;
      align-items: center;
      gap: 16px;
      height: 100%;
    }

    .metric-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .metric-icon.clients { background: #4CAF50; }
    .metric-icon.subscriptions { background: #2196F3; }
    .metric-icon.warning { background: #FF9800; }
    .metric-icon.payments { background: #9C27B0; }

    .metric-info h3 {
      font-size: 24px;
      font-weight: bold;
      margin: 0;
      color: #333;
    }

    .metric-info p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .quick-actions {
      margin-top: 40px;
    }

    .quick-actions h2 {
      color: #333;
      margin-bottom: 20px;
      font-size: 22px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .action-card {
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 12px;
      overflow: hidden;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .action-card mat-card-content {
      text-align: center;
      padding: 24px;
    }

    .action-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #1976d2;
      margin-bottom: 16px;
    }

    .action-card h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 18px;
    }

    .action-card p {
      margin: 0;
      color: #666;
      font-size: 14px;
      line-height: 1.4;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
    }

    .loading-container p {
      margin-top: 16px;
      color: #666;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }
      
      .header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .metric-content {
        flex-direction: column;
        text-align: center;
        gap: 8px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = true;
  isAdmin = false;
  isClient = false;
  metrics: DashboardMetrics | null = null;
  selectedPeriod: '7d' | '30d' | '90d' | 'all' = '30d';

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isAdmin = user.role === UserRole.ADMIN;
        this.isClient = user.role === UserRole.CLIENT;
        
        if (this.isAdmin) {
          this.loadMetrics();
        } else {
          this.loading = false;
        }
      }
    });
  }

  loadMetrics(): void {
    this.loading = true;
    this.dashboardService.getAdminMetrics(this.selectedPeriod).subscribe({
      next: (metrics) => {
        this.metrics = {
          ...metrics,
          totalRevenue: 0,
          monthlyRevenue: 0
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar métricas:', error);
        this.loading = false;
      }
    });
  }

  onPeriodChange(): void {
    if (this.isAdmin) {
      this.loadMetrics();
    }
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}