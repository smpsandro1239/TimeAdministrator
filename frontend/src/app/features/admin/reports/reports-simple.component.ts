import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

@Component({
  selector: 'app-reports-simple',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatSelectModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatDialogModule, FormsModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="container">
        <div class="header">
          <div>
            <h1>Relatórios e Análises</h1>
            <p>Métricas de desempenho e receitas</p>
          </div>
          <button mat-raised-button color="primary" (click)="exportReport()">
            <mat-icon>download</mat-icon>
            Exportar Relatório
          </button>
        </div>
        
        <div class="filters-section">
          <mat-card>
            <mat-card-content>
              <div class="filters">
                <mat-form-field appearance="outline">
                  <mat-label>Período</mat-label>
                  <mat-select [(value)]="selectedPeriod" (selectionChange)="updateData()">
                    <mat-option value="7days">Últimos 7 dias</mat-option>
                    <mat-option value="30days">Últimos 30 dias</mat-option>
                    <mat-option value="3months">Últimos 3 meses</mat-option>
                    <mat-option value="year">Este ano</mat-option>
                    <mat-option value="custom">Personalizado</mat-option>
                  </mat-select>
                </mat-form-field>
                
                <mat-form-field appearance="outline" *ngIf="selectedPeriod === 'custom'">
                  <mat-label>Data início</mat-label>
                  <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDate" (dateChange)="updateData()">
                  <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                </mat-form-field>
                
                <mat-form-field appearance="outline" *ngIf="selectedPeriod === 'custom'">
                  <mat-label>Data fim</mat-label>
                  <input matInput [matDatepicker]="endPicker" [(ngModel)]="endDate" (dateChange)="updateData()">
                  <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        
        <div class="metrics-grid">
          <mat-card class="metric-card revenue clickable" (click)="showRevenueDetails()">
            <mat-card-content>
              <div class="metric-header">
                <mat-icon>euro</mat-icon>
                <span class="trend positive">+12%</span>
              </div>
              <h3>{{ totalRevenue }}€</h3>
              <p>Receita Total</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="metric-card subscriptions clickable" (click)="showSubscriptionsDetails()">
            <mat-card-content>
              <div class="metric-header">
                <mat-icon>people</mat-icon>
                <span class="trend positive">+8%</span>
              </div>
              <h3>{{ activeSubscriptions }}</h3>
              <p>Subscrições Ativas</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="metric-card expiring clickable" (click)="showExpiringDetails()">
            <mat-card-content>
              <div class="metric-header">
                <mat-icon>warning</mat-icon>
                <span class="trend negative">-3%</span>
              </div>
              <h3>{{ expiringSubscriptions }}</h3>
              <p>A Expirar (30 dias)</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="metric-card conversion clickable" (click)="showConversionDetails()">
            <mat-card-content>
              <div class="metric-header">
                <mat-icon>trending_up</mat-icon>
                <span class="trend positive">+5%</span>
              </div>
              <h3>{{ conversionRate }}%</h3>
              <p>Taxa de Conversão</p>
            </mat-card-content>
          </mat-card>
        </div>
        
        <div class="charts-section">
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Receitas por Plano</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas #revenueChart></canvas>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Evolução Mensal</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas #monthlyChart></canvas>
            </mat-card-content>
          </mat-card>
        </div>
        
        <div class="reports-grid">
          <mat-card class="report-card">
            <mat-card-header>
              <mat-card-title>Subscrições a Expirar</mat-card-title>
              <mat-card-subtitle>Próximos 30 dias</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="expiringData" class="report-table">
                <ng-container matColumnDef="client">
                  <th mat-header-cell *matHeaderCellDef>Cliente</th>
                  <td mat-cell *matCellDef="let item">{{ item.clientName }}</td>
                </ng-container>
                
                <ng-container matColumnDef="plan">
                  <th mat-header-cell *matHeaderCellDef>Plano</th>
                  <td mat-cell *matCellDef="let item">{{ item.plan }}</td>
                </ng-container>
                
                <ng-container matColumnDef="expires">
                  <th mat-header-cell *matHeaderCellDef>Expira em</th>
                  <td mat-cell *matCellDef="let item" [ngClass]="getDaysClass(item.daysLeft)">
                    {{ item.daysLeft }} dias
                  </td>
                </ng-container>
                
                <ng-container matColumnDef="value">
                  <th mat-header-cell *matHeaderCellDef>Valor</th>
                  <td mat-cell *matCellDef="let item">{{ item.value }}€</td>
                </ng-container>
                
                <tr mat-header-row *matHeaderRowDef="expiringColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: expiringColumns;"></tr>
              </table>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="report-card">
            <mat-card-header>
              <mat-card-title>Receitas por Plano</mat-card-title>
              <mat-card-subtitle>{{ selectedPeriod === 'custom' ? 'Período personalizado' : getPeriodText() }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="revenueByPlan" class="report-table">
                <ng-container matColumnDef="plan">
                  <th mat-header-cell *matHeaderCellDef>Plano</th>
                  <td mat-cell *matCellDef="let item">{{ item.plan }}</td>
                </ng-container>
                
                <ng-container matColumnDef="subscriptions">
                  <th mat-header-cell *matHeaderCellDef>Subscrições</th>
                  <td mat-cell *matCellDef="let item">{{ item.count }}</td>
                </ng-container>
                
                <ng-container matColumnDef="revenue">
                  <th mat-header-cell *matHeaderCellDef>Receita</th>
                  <td mat-cell *matCellDef="let item" class="revenue-cell">{{ item.revenue }}€</td>
                </ng-container>
                
                <ng-container matColumnDef="percentage">
                  <th mat-header-cell *matHeaderCellDef>%</th>
                  <td mat-cell *matCellDef="let item">{{ item.percentage }}%</td>
                </ng-container>
                
                <tr mat-header-row *matHeaderRowDef="revenueColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: revenueColumns;"></tr>
              </table>
            </mat-card-content>
          </mat-card>
        </div>
        
        <mat-card class="payments-report">
          <mat-card-header>
            <mat-card-title>Pagamentos Recentes</mat-card-title>
            <mat-card-subtitle>Últimas transações</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="recentPayments" class="report-table">
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Data</th>
                <td mat-cell *matCellDef="let payment">{{ formatDate(payment.date) }}</td>
              </ng-container>
              
              <ng-container matColumnDef="client">
                <th mat-header-cell *matHeaderCellDef>Cliente</th>
                <td mat-cell *matCellDef="let payment">{{ payment.clientName }}</td>
              </ng-container>
              
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Valor</th>
                <td mat-cell *matCellDef="let payment" class="amount-cell">{{ payment.amount }}€</td>
              </ng-container>
              
              <ng-container matColumnDef="method">
                <th mat-header-cell *matHeaderCellDef>Método</th>
                <td mat-cell *matCellDef="let payment">{{ getMethodText(payment.method) }}</td>
              </ng-container>
              
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let payment">
                  <span class="status" [ngClass]="payment.status">{{ getStatusText(payment.status) }}</span>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="paymentsColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: paymentsColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    h1 { margin: 0 0 8px 0; color: #333; font-size: 28px; }
    p { margin: 0; color: #666; }
    .filters-section { margin-bottom: 24px; }
    .filters { display: flex; gap: 16px; align-items: center; }
    .filters mat-form-field { min-width: 150px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .metric-card { text-align: center; }
    .metric-card.revenue { border-left: 4px solid #4CAF50; }
    .metric-card.subscriptions { border-left: 4px solid #2196F3; }
    .metric-card.expiring { border-left: 4px solid #FF9800; }
    .metric-card.conversion { border-left: 4px solid #9C27B0; }
    .metric-card.clickable { cursor: pointer; transition: transform 0.2s; }
    .metric-card.clickable:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .metric-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .metric-header mat-icon { font-size: 24px; color: #666; }
    .trend { font-size: 12px; font-weight: 500; padding: 2px 6px; border-radius: 8px; }
    .trend.positive { background: #e8f5e8; color: #2e7d32; }
    .trend.negative { background: #ffebee; color: #c62828; }
    .metric-card h3 { margin: 8px 0 4px 0; font-size: 24px; font-weight: 600; }
    .metric-card p { margin: 0; color: #666; font-size: 14px; }
    .charts-section { margin-bottom: 24px; }
    .charts-section { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .chart-card canvas { max-height: 300px; }
    .reports-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    .report-table { width: 100%; }
    .revenue-cell, .amount-cell { text-align: right; font-weight: 500; }
    .critical { color: #c62828; font-weight: 600; }
    .warning { color: #ef6c00; font-weight: 500; }
    .caution { color: #f57f17; }
    .status { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .status.approved { background: #e8f5e8; color: #2e7d32; }
    .status.pending { background: #fff3e0; color: #ef6c00; }
    .status.rejected { background: #ffebee; color: #c62828; }
    @media (max-width: 768px) {
      .charts-section { grid-template-columns: 1fr; }
      .reports-grid { grid-template-columns: 1fr; }
      .filters { flex-direction: column; align-items: stretch; }
    }
  `]
})
export class ReportsSimpleComponent implements OnInit, AfterViewInit {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef<HTMLCanvasElement>;
  
  selectedPeriod = '30days';
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  revenueChart: Chart | null = null;
  monthlyChart: Chart | null = null;
  
  totalRevenue = 320;
  activeSubscriptions = 24;
  expiringSubscriptions = 5;
  conversionRate = 78;
  
  expiringColumns = ['client', 'plan', 'expires', 'value'];
  revenueColumns = ['plan', 'subscriptions', 'revenue', 'percentage'];
  paymentsColumns = ['date', 'client', 'amount', 'method', 'status'];
  
  expiringData = [
    { clientName: 'Ana Ferreira', plan: '6 Meses', daysLeft: 2, value: 60 },
    { clientName: 'Carlos Oliveira', plan: '1 Mês', daysLeft: 5, value: 10 },
    { clientName: 'Sofia Rodrigues', plan: '1 Mês', daysLeft: 10, value: 10 },
    { clientName: 'Rui Martins', plan: '3 Meses', daysLeft: 15, value: 30 },
    { clientName: 'Pedro Costa', plan: '3 Meses', daysLeft: 25, value: 30 }
  ];
  
  revenueByPlan = [
    { plan: '1 Mês', count: 8, revenue: 80, percentage: 25 },
    { plan: '3 Meses', count: 6, revenue: 180, percentage: 56 },
    { plan: '6 Meses', count: 2, revenue: 120, percentage: 38 },
    { plan: '12 Meses', count: 1, revenue: 100, percentage: 31 }
  ];
  
  recentPayments = [
    { date: new Date('2024-10-02'), clientName: 'Carlos Oliveira', amount: 10, method: 'transfer', status: 'pending' },
    { date: new Date('2024-10-01'), clientName: 'João Silva', amount: 10, method: 'stripe', status: 'approved' },
    { date: new Date('2024-10-01'), clientName: 'Sofia Rodrigues', amount: 10, method: 'stripe', status: 'approved' },
    { date: new Date('2024-09-30'), clientName: 'Ana Ferreira', amount: 100, method: 'stripe', status: 'approved' },
    { date: new Date('2024-09-29'), clientName: 'Luísa Pereira', amount: 30, method: 'stripe', status: 'approved' }
  ];
  
  constructor(private dialog: MatDialog) {
    Chart.register(...registerables);
  }
  
  ngOnInit(): void {
    this.updateData();
  }
  
  ngAfterViewInit(): void {
    this.createCharts();
  }
  
  updateData(): void {
    // Simular atualização de dados baseada no período selecionado
    console.log('Atualizando dados para período:', this.selectedPeriod);
  }
  
  getPeriodText(): string {
    switch(this.selectedPeriod) {
      case '7days': return 'Últimos 7 dias';
      case '30days': return 'Últimos 30 dias';
      case '3months': return 'Últimos 3 meses';
      case 'year': return 'Este ano';
      default: return 'Período selecionado';
    }
  }
  
  getDaysClass(days: number): string {
    if (days <= 3) return 'critical';
    if (days <= 7) return 'warning';
    if (days <= 15) return 'caution';
    return '';
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-PT');
  }
  
  getMethodText(method: string): string {
    switch(method) {
      case 'stripe': return 'Cartão';
      case 'transfer': return 'Transferência';
      case 'cash': return 'Dinheiro';
      default: return method;
    }
  }
  
  getStatusText(status: string): string {
    switch(status) {
      case 'approved': return 'Aprovado';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  }
  
  createCharts(): void {
    this.createRevenueChart();
    this.createMonthlyChart();
  }
  
  createRevenueChart(): void {
    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.revenueChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['1 Mês', '3 Meses', '6 Meses', '12 Meses'],
          datasets: [{
            data: [80, 180, 120, 100],
            backgroundColor: ['#2196F3', '#9C27B0', '#FF9800', '#4CAF50'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }
  
  createMonthlyChart(): void {
    const ctx = this.monthlyChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
          datasets: [{
            label: 'Receita (€)',
            data: [120, 150, 180, 200, 250, 280, 300, 320, 350, 320],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
  
  showRevenueDetails(): void {
    import('./metric-details-dialog.component').then(m => {
      this.dialog.open(m.MetricDetailsDialogComponent, {
        width: '600px',
        data: {
          title: 'Detalhes da Receita Total',
          metric: 'revenue',
          value: this.totalRevenue,
          trend: '+12%',
          details: this.revenueByPlan,
          period: this.getPeriodText()
        }
      });
    });
  }
  
  showSubscriptionsDetails(): void {
    import('./metric-details-dialog.component').then(m => {
      this.dialog.open(m.MetricDetailsDialogComponent, {
        width: '600px',
        data: {
          title: 'Detalhes das Subscrições Ativas',
          metric: 'subscriptions',
          value: this.activeSubscriptions,
          trend: '+8%',
          details: [
            { plan: '1 Mês', count: 8, status: 'active' },
            { plan: '3 Meses', count: 6, status: 'active' },
            { plan: '6 Meses', count: 2, status: 'active' },
            { plan: '12 Meses', count: 1, status: 'active' }
          ],
          period: this.getPeriodText()
        }
      });
    });
  }
  
  showExpiringDetails(): void {
    import('./metric-details-dialog.component').then(m => {
      this.dialog.open(m.MetricDetailsDialogComponent, {
        width: '700px',
        data: {
          title: 'Subscrições a Expirar',
          metric: 'expiring',
          value: this.expiringSubscriptions,
          trend: '-3%',
          details: this.expiringData,
          period: 'Próximos 30 dias'
        }
      });
    });
  }
  
  showConversionDetails(): void {
    import('./metric-details-dialog.component').then(m => {
      this.dialog.open(m.MetricDetailsDialogComponent, {
        width: '600px',
        data: {
          title: 'Taxa de Conversão',
          metric: 'conversion',
          value: this.conversionRate,
          trend: '+5%',
          details: [
            { metric: 'Visitantes', value: 1250 },
            { metric: 'Leads', value: 320 },
            { metric: 'Conversões', value: 250 },
            { metric: 'Taxa', value: '78%' }
          ],
          period: this.getPeriodText()
        }
      });
    });
  }
  
  exportReport(): void {
    console.log('Exportar relatório para:', this.selectedPeriod);
  }
}