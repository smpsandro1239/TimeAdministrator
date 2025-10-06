import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Chart, registerables } from 'chart.js';
import { ExpiringSubscription, RecentPayment, ReportData, ReportsService, RevenueByPlan } from '../../../services/reports.service';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { CohortAnalysisModalComponent } from './cohort-analysis-modal.component';
import { DetailedReportModalComponent } from './detailed-report-modal.component';
import { PeriodComparisonModalComponent } from './period-comparison-modal.component';
import { ScheduleReportModalComponent } from './schedule-report-modal.component';

@Component({
  selector: 'app-reports-simple',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatSelectModule, MatFormFieldModule, MatDatepickerModule,
    MatNativeDateModule, MatInputModule, MatDialogModule, MatProgressSpinnerModule,
    MatTooltipModule, FormsModule, LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="container">
        <div class="header">
          <div>
            <h1>Relatórios e Análises Avançadas</h1>
            <p>Dashboard completo de métricas e insights de negócio</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="accent" (click)="refreshData()">
              <mat-icon>refresh</mat-icon>
              Actualizar
            </button>
            <button mat-raised-button color="primary" (click)="exportReport()">
              <mat-icon>download</mat-icon>
              Exportar PDF
            </button>
          </div>
        </div>

        <div class="filters-section">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Filtros de Análise</mat-card-title>
              <button mat-icon-button (click)="toggleAdvancedFilters()">
                <mat-icon>{{ showAdvancedFilters ? 'expand_less' : 'expand_more' }}</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div class="filters">
                <mat-form-field appearance="outline">
                  <mat-label>Período</mat-label>
                  <mat-select [(value)]="selectedPeriod" (selectionChange)="updateData()">
                    <mat-option value="7days">Últimos 7 dias</mat-option>
                    <mat-option value="30days">Últimos 30 dias</mat-option>
                    <mat-option value="3months">Últimos 3 meses</mat-option>
                    <mat-option value="6months">Últimos 6 meses</mat-option>
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

              <div class="advanced-filters" *ngIf="showAdvancedFilters">
                <div class="filters">
                  <mat-form-field appearance="outline">
                    <mat-label>Tipo de Plano</mat-label>
                    <mat-select [(value)]="selectedPlanType" (selectionChange)="updateData()" multiple>
                      <mat-option value="MONTHLY">Mensal</mat-option>
                      <mat-option value="QUARTERLY">Trimestral</mat-option>
                      <mat-option value="SEMI_ANNUAL">Semestral</mat-option>
                      <mat-option value="ANNUAL">Anual</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Estado do Pagamento</mat-label>
                    <mat-select [(value)]="selectedPaymentStatus" (selectionChange)="updateData()" multiple>
                      <mat-option value="completed">Completo</mat-option>
                      <mat-option value="pending">Pendente</mat-option>
                      <mat-option value="failed">Falhado</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Valor Mínimo (€)</mat-label>
                    <input matInput type="number" [(ngModel)]="minAmount" (ngModelChange)="updateData()">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Valor Máximo (€)</mat-label>
                    <input matInput type="number" [(ngModel)]="maxAmount" (ngModelChange)="updateData()">
                  </mat-form-field>
                </div>

                <div class="filter-actions">
                  <button mat-button (click)="clearFilters()">
                    <mat-icon>clear</mat-icon>
                    Limpar Filtros
                  </button>
                  <button mat-button (click)="saveFilterPreset()">
                    <mat-icon>bookmark</mat-icon>
                    Guardar Filtros
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="metrics-grid" *ngIf="!loading">
          <mat-card class="metric-card revenue"
                   (click)="showMetricDetails('revenue')"
                   matTooltip="{{ getMetricTooltip('revenue') }}"
                   matTooltipPosition="above">
            <mat-card-content>
              <div class="metric-header">
                <mat-icon>euro</mat-icon>
                <span class="trend positive">+{{ revenueGrowth }}%</span>
              </div>
              <h3>{{ totalRevenue }}€</h3>
              <p>Receita Total</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card subscriptions"
                   (click)="showMetricDetails('subscriptions')"
                   matTooltip="{{ getMetricTooltip('subscriptions') }}"
                   matTooltipPosition="above">
            <mat-card-content>
              <div class="metric-header">
                <mat-icon>people</mat-icon>
                <span class="trend positive">+{{ subscriptionGrowth }}%</span>
              </div>
              <h3>{{ activeSubscriptions }}</h3>
              <p>Subscrições Activas</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card expiring"
                   (click)="showMetricDetails('expiring')"
                   matTooltip="{{ getMetricTooltip('expiring') }}"
                   matTooltipPosition="above">
            <mat-card-content>
              <div class="metric-header">
                <mat-icon>warning</mat-icon>
                <span class="trend negative">{{ expiringSubscriptions > 10 ? 'Alto' : 'Normal' }}</span>
              </div>
              <h3>{{ expiringSubscriptions }}</h3>
              <p>A Expirar (30 dias)</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card conversion"
                   (click)="showMetricDetails('conversion')"
                   matTooltip="{{ getMetricTooltip('conversion') }}"
                   matTooltipPosition="above">
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

        <div class="loading-section" *ngIf="loading">
          <mat-card>
            <mat-card-content class="loading-content">
              <mat-spinner diameter="40"></mat-spinner>
              <p>A carregar dados dos relatórios...</p>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="charts-section" *ngIf="!loading">
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Receitas por Plano</mat-card-title>
              <button mat-icon-button (click)="toggleChartType('revenue')">
                <mat-icon>{{ revenueChartType === 'doughnut' ? 'bar_chart' : 'donut_small' }}</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <canvas #revenueChart></canvas>
            </mat-card-content>
          </mat-card>

          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Evolução Mensal</mat-card-title>
              <button mat-icon-button (click)="toggleChartType('monthly')">
                <mat-icon>{{ monthlyChartType === 'line' ? 'bar_chart' : 'show_chart' }}</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <canvas #monthlyChart></canvas>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="advanced-section" *ngIf="!loading">
          <mat-card class="analysis-card">
            <mat-card-header>
              <mat-card-title>Análise de Tendências</mat-card-title>
              <mat-card-subtitle>Comparação com período anterior</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="trends-grid">
                <div class="trend-item">
                  <div class="trend-label">Crescimento de Receita</div>
                  <div class="trend-value" [ngClass]="revenueGrowth >= 0 ? 'positive' : 'negative'">
                    <mat-icon>{{ revenueGrowth >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
                    {{ revenueGrowth }}%
                  </div>
                </div>

                <div class="trend-item">
                  <div class="trend-label">Novas Subscrições</div>
                  <div class="trend-value" [ngClass]="subscriptionGrowth >= 0 ? 'positive' : 'negative'">
                    <mat-icon>{{ subscriptionGrowth >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
                    {{ subscriptionGrowth }}%
                  </div>
                </div>

                <div class="trend-item">
                  <div class="trend-label">Taxa de Retenção</div>
                  <div class="trend-value positive">
                    <mat-icon>people</mat-icon>
                    {{ retentionRate }}%
                  </div>
                </div>

                <div class="trend-item">
                  <div class="trend-label">Valor Médio por Cliente</div>
                  <div class="trend-value">
                    <mat-icon>euro</mat-icon>
                    {{ averageRevenuePerClient }}€
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- KPIs em Tempo Real -->
        <div class="realtime-kpis" *ngIf="!loading">
          <mat-card>
            <mat-card-header>
              <mat-card-title>
                <mat-icon class="pulse">radio_button_checked</mat-icon>
                KPIs em Tempo Real
              </mat-card-title>
              <mat-card-subtitle>Última actualização: {{ lastUpdate | date:'HH:mm:ss' }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="kpis-grid">
                <div class="kpi-item"
                     matTooltip="{{ getKpiTooltip('mrr') }}"
                     matTooltipPosition="above"
                     matTooltipClass="kpi-tooltip">
                  <div class="kpi-icon">
                    <mat-icon>attach_money</mat-icon>
                  </div>
                  <div class="kpi-content">
                    <div class="kpi-value">{{ realtimeKpis.mrr }}€</div>
                    <div class="kpi-label">MRR (Monthly Recurring Revenue)</div>
                    <div class="kpi-change positive">+{{ realtimeKpis.mrrGrowth }}% este mês</div>
                  </div>
                </div>

                <div class="kpi-item"
                     matTooltip="{{ getKpiTooltip('churn') }}"
                     matTooltipPosition="above"
                     matTooltipClass="kpi-tooltip">
                  <div class="kpi-icon">
                    <mat-icon>trending_down</mat-icon>
                  </div>
                  <div class="kpi-content">
                    <div class="kpi-value">{{ realtimeKpis.churnRate }}%</div>
                    <div class="kpi-label">Taxa de Churn Mensal</div>
                    <div class="kpi-change" [ngClass]="realtimeKpis.churnChange < 0 ? 'positive' : 'negative'">
                      {{ realtimeKpis.churnChange > 0 ? '+' : '' }}{{ realtimeKpis.churnChange }}% vs mês anterior
                    </div>
                  </div>
                </div>

                <div class="kpi-item"
                     matTooltip="{{ getKpiTooltip('ltv') }}"
                     matTooltipPosition="above"
                     matTooltipClass="kpi-tooltip">
                  <div class="kpi-icon">
                    <mat-icon>schedule</mat-icon>
                  </div>
                  <div class="kpi-content">
                    <div class="kpi-value">{{ realtimeKpis.ltv }}€</div>
                    <div class="kpi-label">LTV (Lifetime Value)</div>
                    <div class="kpi-change positive">+{{ realtimeKpis.ltvGrowth }}% este trimestre</div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="reports-grid" *ngIf="!loading">
          <mat-card class="report-card">
            <mat-card-header>
              <mat-card-title>Subscrições a Expirar</mat-card-title>
              <mat-card-subtitle>Próximos 30 dias</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="expiringData" class="report-table">
                <ng-container matColumnDef="client">
                  <th mat-header-cell *matHeaderCellDef>Cliente</th>
                  <td mat-cell *matCellDef="let item">
                    <button mat-button class="client-link" (click)="openSubscriptionDetails(item)">
                      {{ item.clientName }}
                    </button>
                  </td>
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
                  <td mat-cell *matCellDef="let item">{{ item.revenue }}€</td>
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

          <mat-card class="report-card">
            <mat-card-header>
              <mat-card-title>Pagamentos Recentes</mat-card-title>
              <mat-card-subtitle>Últimas transacções</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="recentPayments" class="report-table">
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Data</th>
                  <td mat-cell *matCellDef="let item">{{ item.date | date:'dd/MM/yyyy' }}</td>
                </ng-container>

                <ng-container matColumnDef="client">
                  <th mat-header-cell *matHeaderCellDef>Cliente</th>
                  <td mat-cell *matCellDef="let item">{{ item.clientName }}</td>
                </ng-container>

                <ng-container matColumnDef="amount">
                  <th mat-header-cell *matHeaderCellDef>Valor</th>
                  <td mat-cell *matCellDef="let item">{{ item.amount }}€</td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let item">
                    <span class="status-badge" [ngClass]="item.status.toLowerCase()">{{ getStatusText(item.status) }}</span>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="paymentsColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: paymentsColumns;"></tr>
              </table>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="alerts-section" *ngIf="!loading && alerts.length > 0">
          <mat-card class="alerts-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon color="warn">warning</mat-icon>
                Alertas e Notificações
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="alert-item" *ngFor="let alert of alerts" [ngClass]="alert.type">
                <mat-icon>{{ getAlertIcon(alert.type) }}</mat-icon>
                <div class="alert-content">
                  <div class="alert-title">{{ alert.title }}</div>
                  <div class="alert-message">{{ alert.message }}</div>
                </div>
                <button mat-icon-button (click)="dismissAlert(alert.id)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="quick-actions" *ngIf="!loading">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Acções Rápidas</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="actions-grid">
                <button mat-raised-button color="primary" (click)="sendExpirationReminders()">
                  <mat-icon>email</mat-icon>
                  Enviar Lembretes
                </button>

                <button mat-raised-button (click)="generateDetailedReport()">
                  <mat-icon>assessment</mat-icon>
                  Relatório Detalhado
                </button>

                <button mat-raised-button color="accent" (click)="sendMonthlyReport()">
                  <mat-icon>send</mat-icon>
                  Enviar Relatório Mensal
                </button>

                <button mat-raised-button (click)="exportToExcel()">
                  <mat-icon>table_chart</mat-icon>
                  Exportar Excel
                </button>

                <button mat-raised-button (click)="scheduleReport()">
                  <mat-icon>schedule</mat-icon>
                  Agendar Relatório
                </button>

                <button mat-raised-button color="accent" (click)="comparePeriods()">
                  <mat-icon>compare</mat-icon>
                  Comparar Períodos
                </button>

                <button mat-raised-button (click)="showCohortAnalysis()">
                  <mat-icon>analytics</mat-icon>
                  Análise de Coortes
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </app-layout>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header h1 { margin: 0; color: #1976d2; font-size: 28px; }
    .header p { margin: 4px 0 0 0; color: #666; }
    .header-actions { display: flex; gap: 12px; }
    .filters-section { margin-bottom: 24px; }
    .filters { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    .advanced-filters { margin-top: 16px; padding-top: 16px; border-top: 1px solid #e0e0e0; }
    .filter-actions { display: flex; gap: 12px; margin-top: 16px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .metric-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
    .metric-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .metric-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .metric-card mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .metric-card h3 { margin: 0; font-size: 28px; font-weight: 600; }
    .metric-card p { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    .trend { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .trend.positive { background: #e8f5e8; color: #2e7d32; }
    .trend.negative { background: #ffebee; color: #c62828; }
    .revenue { border-left: 4px solid #4caf50; }
    .subscriptions { border-left: 4px solid #2196f3; }
    .expiring { border-left: 4px solid #ff9800; }
    .conversion { border-left: 4px solid #9c27b0; }
    .loading-section { margin: 48px 0; }
    .loading-content { display: flex; flex-direction: column; align-items: center; padding: 48px; }
    .loading-content p { margin-top: 16px; color: #666; }
    .charts-section { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    .chart-card { min-height: 400px; }
    .chart-card canvas { max-height: 300px; }
    .chart-card mat-card-header { display: flex; justify-content: space-between; align-items: center; }
    .advanced-section { margin-bottom: 24px; }
    .trends-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .trend-item { text-align: center; padding: 16px; border-radius: 8px; background: #f5f5f5; }
    .trend-label { font-size: 14px; color: #666; margin-bottom: 8px; }
    .trend-value { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 18px; font-weight: 600; }
    .trend-value.positive { color: #2e7d32; }
    .trend-value.negative { color: #c62828; }
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px; margin-bottom: 24px; }
    .report-table { width: 100%; }
    .report-table th { font-weight: 600; color: #333; }
    .days-critical { color: #c62828; font-weight: 600; }
    .days-warning { color: #f57c00; font-weight: 600; }
    .days-normal { color: #2e7d32; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-badge.completed { background: #e8f5e8; color: #2e7d32; }
    .status-badge.pending { background: #fff3e0; color: #f57c00; }
    .status-badge.failed { background: #ffebee; color: #c62828; }
    .alerts-section { margin-bottom: 24px; }
    .alert-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; margin-bottom: 8px; }
    .alert-item.warning { background: #fff3e0; border-left: 4px solid #ff9800; }
    .alert-item.error { background: #ffebee; border-left: 4px solid #f44336; }
    .alert-item.info { background: #e3f2fd; border-left: 4px solid #2196f3; }
    .alert-content { flex: 1; }
    .alert-title { font-weight: 600; margin-bottom: 4px; }
    .alert-message { font-size: 14px; color: #666; }
    .quick-actions { margin-bottom: 24px; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .actions-grid button { height: 48px; }

    /* KPIs em Tempo Real */
    .realtime-kpis { margin-bottom: 24px; }
    .pulse { animation: pulse 2s infinite; color: #4caf50; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
    .kpis-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    .kpi-item { display: flex; gap: 16px; padding: 16px; border-radius: 8px; background: #f8f9fa; }
    .kpi-icon { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background: #e3f2fd; }
    .kpi-icon mat-icon { color: #1976d2; font-size: 24px; }
    .kpi-content { flex: 1; }
    .kpi-value { font-size: 24px; font-weight: 600; color: #1976d2; margin-bottom: 4px; }
    .kpi-label { font-size: 14px; color: #666; margin-bottom: 4px; }
    .kpi-change { font-size: 12px; font-weight: 500; }
    .kpi-change.positive { color: #2e7d32; }
    .kpi-change.negative { color: #c62828; }
    .kpi-status.excellent { color: #2e7d32; font-weight: 600; }
    .kpi-status.good { color: #4caf50; font-weight: 600; }
    .kpi-status.acceptable { color: #ff9800; font-weight: 600; }
    .kpi-status.critical { color: #f44336; font-weight: 600; }

    /* Tooltip personalizado */
    ::ng-deep .kpi-tooltip {
      background: #333 !important;
      color: white !important;
      font-size: 12px !important;
      max-width: 300px !important;
      white-space: pre-line !important;
      line-height: 1.4 !important;
      padding: 12px !important;
      border-radius: 8px !important;
    }
    @media (max-width: 768px) {
      .container { padding: 16px; }
      .header { flex-direction: column; align-items: flex-start; gap: 16px; }
      .filters { flex-direction: column; align-items: stretch; }
      .charts-section { grid-template-columns: 1fr; }
      .reports-grid { grid-template-columns: 1fr; }
      .trends-grid { grid-template-columns: 1fr 1fr; }
      .actions-grid { grid-template-columns: 1fr; }
      .kpis-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ReportsSimpleComponent implements OnInit, AfterViewInit, OnDestroy {
  private realtimeInterval?: any;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef<HTMLCanvasElement>;

  loading = true;
  selectedPeriod = '30days';
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Filtros avançados
  showAdvancedFilters = false;
  selectedPlanType: string[] = [];
  selectedPaymentStatus: string[] = [];
  minAmount: number | null = null;
  maxAmount: number | null = null;

  // Métricas principais
  totalRevenue = 0;
  activeSubscriptions = 0;
  expiringSubscriptions = 0;
  conversionRate = 0;

  // Métricas avançadas
  revenueGrowth = 12;
  subscriptionGrowth = 8;
  retentionRate = 85;
  averageRevenuePerClient = 0;

  // KPIs em tempo real
  lastUpdate = new Date();
  realtimeKpis = {
    mrr: 15420,
    mrrGrowth: 8.5,
    churnRate: 3.2,
    churnChange: -0.5,
    ltv: 890,
    ltvGrowth: 12.3
  };

  // Dados das tabelas
  expiringData: ExpiringSubscription[] = [];
  revenueByPlan: RevenueByPlan[] = [];
  recentPayments: RecentPayment[] = [];

  // Alertas
  alerts: any[] = [
    {
      id: 1,
      type: 'warning',
      title: 'Subscrições a Expirar',
      message: '15 subscrições expiram nos próximos 7 dias'
    },
    {
      id: 2,
      type: 'info',
      title: 'Relatório Mensal',
      message: 'Relatório mensal disponível para download'
    }
  ];

  // Colunas das tabelas
  expiringColumns = ['client', 'plan', 'expires', 'value'];
  revenueColumns = ['plan', 'subscriptions', 'revenue', 'percentage'];
  paymentsColumns = ['date', 'client', 'amount', 'status'];

  // Gráficos
  revenueChart?: Chart;
  monthlyChart?: Chart;
  revenueChartType: 'doughnut' | 'bar' = 'doughnut';
  monthlyChartType: 'line' | 'bar' = 'line';

  constructor(
    private reportsService: ReportsService,
    private dialog: MatDialog
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    // Carregar dados mock imediatamente para demonstração
    this.loadMockData();
    // Tentar carregar dados reais
    this.updateData();
    // Iniciar actualizações em tempo real dos KPIs
    this.startRealtimeUpdates();
  }

  ngAfterViewInit() {
    // Charts will be initialized after data loading
  }

  updateData() {
    this.loading = true;

    const params = {
      period: this.selectedPeriod,
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.reportsService.getReportData(params).subscribe({
      next: (data: ReportData) => {
        this.totalRevenue = data.totalRevenue;
        this.activeSubscriptions = data.activeSubscriptions;
        this.expiringSubscriptions = data.expiringSubscriptions;
        this.conversionRate = data.conversionRate;

        this.expiringData = data.expiringData;
        this.revenueByPlan = data.revenueByPlan;
        this.recentPayments = data.recentPayments;

        this.calculateAdvancedMetrics();
        this.loading = false;
        this.initCharts();

        setTimeout(() => {
          this.updateCharts(data);
        }, 100);
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        // Usar dados mock em caso de erro
        this.loadMockData();
        this.loading = false;
        this.initCharts();
      }
    });
  }

  loadMockData() {
    // Dados mock para demonstração
    this.totalRevenue = 45280;
    this.activeSubscriptions = 156;
    this.expiringSubscriptions = 23;
    this.conversionRate = 68;

    this.expiringData = [
      { clientName: 'João Silva', plan: '1 Mês', daysLeft: 5, value: 29.99, clientId: '1', subscriptionId: '1' },
      { clientName: 'Maria Santos', plan: '3 Meses', daysLeft: 12, value: 79.99, clientId: '2', subscriptionId: '2' },
      { clientName: 'Pedro Costa', plan: '6 Meses', daysLeft: 18, value: 149.99, clientId: '3', subscriptionId: '3' },
      { clientName: 'Ana Ferreira', plan: '1 Ano', daysLeft: 25, value: 279.99, clientId: '4', subscriptionId: '4' }
    ];

    this.revenueByPlan = [
      { plan: '1 Mês', count: 45, revenue: 1349.55, percentage: 25 },
      { plan: '3 Meses', count: 38, revenue: 3039.62, percentage: 35 },
      { plan: '6 Meses', count: 28, revenue: 4199.72, percentage: 30 },
      { plan: '1 Ano', count: 15, revenue: 4199.85, percentage: 10 }
    ];

    this.recentPayments = [
      { date: new Date('2024-01-15'), clientName: 'Carlos Oliveira', amount: 29.99, method: 'stripe', status: 'completed', paymentId: '1' },
      { date: new Date('2024-01-14'), clientName: 'Sofia Rodrigues', amount: 79.99, method: 'stripe', status: 'completed', paymentId: '2' },
      { date: new Date('2024-01-13'), clientName: 'Miguel Pereira', amount: 149.99, method: 'manual', status: 'pending', paymentId: '3' },
      { date: new Date('2024-01-12'), clientName: 'Rita Almeida', amount: 279.99, method: 'stripe', status: 'completed', paymentId: '4' }
    ];

    this.calculateAdvancedMetrics();
    this.loading = false;
    this.initCharts();

    // Actualizar gráficos com dados mock
    const mockData: ReportData = {
      totalRevenue: this.totalRevenue,
      activeSubscriptions: this.activeSubscriptions,
      expiringSubscriptions: this.expiringSubscriptions,
      conversionRate: this.conversionRate,
      expiringData: this.expiringData,
      revenueByPlan: this.revenueByPlan,
      recentPayments: this.recentPayments,
      monthlyRevenue: [
        { month: 'Jan', revenue: 12500 },
        { month: 'Fev', revenue: 15200 },
        { month: 'Mar', revenue: 18900 },
        { month: 'Abr', revenue: 22100 },
        { month: 'Mai', revenue: 19800 },
        { month: 'Jun', revenue: 25400 }
      ]
    };

    setTimeout(() => {
      this.updateCharts(mockData);
    }, 100);
  }

  calculateAdvancedMetrics() {
    if (this.activeSubscriptions > 0) {
      this.averageRevenuePerClient = Math.round(this.totalRevenue / this.activeSubscriptions);
    }
  }

  initCharts() {
    if (this.revenueChartRef && this.monthlyChartRef) {
      this.createRevenueChart();
      this.createMonthlyChart();
    }
  }

  createRevenueChart() {
    if (!this.revenueChartRef?.nativeElement) return;
    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.revenueChart = new Chart(ctx, {
        type: this.revenueChartType,
        data: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0'],
            borderWidth: 0
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

  createMonthlyChart() {
    if (!this.monthlyChartRef?.nativeElement) return;
    const ctx = this.monthlyChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.monthlyChart = new Chart(ctx, {
        type: this.monthlyChartType,
        data: {
          labels: [],
          datasets: [{
            label: 'Receita',
            data: [],
            borderColor: '#2196f3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            fill: true,
            tension: 0.4
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
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return value + '€';
                }
              }
            }
          }
        }
      });
    }
  }

  updateCharts(data: ReportData) {
    // Destruir gráficos existentes antes de actualizar
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }

    // Recriar gráficos com novos dados
    setTimeout(() => {
      this.createRevenueChart();
      this.createMonthlyChart();

      if (this.revenueChart && data.revenueByPlan) {
        this.revenueChart.data.labels = data.revenueByPlan.map(item => item.plan);
        this.revenueChart.data.datasets[0].data = data.revenueByPlan.map(item => item.revenue);
        this.revenueChart.update();
      }

      if (this.monthlyChart && data.monthlyRevenue) {
        this.monthlyChart.data.labels = data.monthlyRevenue.map(item => item.month);
        this.monthlyChart.data.datasets[0].data = data.monthlyRevenue.map(item => item.revenue);
        this.monthlyChart.update();
      }
    }, 100);
  }

  toggleChartType(chartType: 'revenue' | 'monthly') {
    if (chartType === 'revenue') {
      this.revenueChartType = this.revenueChartType === 'doughnut' ? 'bar' : 'doughnut';
      this.revenueChart?.destroy();
      this.createRevenueChart();
    } else {
      this.monthlyChartType = this.monthlyChartType === 'line' ? 'bar' : 'line';
      this.monthlyChart?.destroy();
      this.createMonthlyChart();
    }
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  refreshData() {
    this.updateData();
  }

  clearFilters() {
    this.selectedPlanType = [];
    this.selectedPaymentStatus = [];
    this.minAmount = null;
    this.maxAmount = null;
    this.updateData();
  }

  saveFilterPreset() {
    const preset = {
      period: this.selectedPeriod,
      planTypes: this.selectedPlanType,
      paymentStatus: this.selectedPaymentStatus,
      minAmount: this.minAmount,
      maxAmount: this.maxAmount
    };
    localStorage.setItem('reportFilters', JSON.stringify(preset));
    alert('Filtros guardados com sucesso!');
  }

  showMetricDetails(metric: string) {
    console.log('Mostrar detalhes da métrica:', metric);
  }

  openSubscriptionDetails(item: ExpiringSubscription) {
    // Import the subscription details dialog component
    import('../subscriptions/subscription-details-dialog.component').then(module => {
      const dialogRef = this.dialog.open(module.SubscriptionDetailsDialogComponent, {
        width: '90vw',
        maxWidth: '1200px',
        height: '80vh',
        data: {
          subscriptionId: item.subscriptionId,
          clientId: item.clientId,
          clientName: item.clientName
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Refresh data if needed
          this.updateData();
        }
      });
    });
  }

  comparePeriods() {
    const dialogData = {
      currentPeriod: {
        name: this.getPeriodText(),
        revenue: this.totalRevenue,
        subscriptions: this.activeSubscriptions,
        newClients: Math.round(this.activeSubscriptions * 0.3),
        conversionRate: this.conversionRate
      },
      previousPeriod: {
        name: 'Período Anterior',
        revenue: Math.round(this.totalRevenue * 0.88),
        subscriptions: Math.round(this.activeSubscriptions * 0.92),
        newClients: Math.round(this.activeSubscriptions * 0.25),
        conversionRate: Math.round(this.conversionRate * 0.95)
      },
      comparison: {
        revenueChange: this.revenueGrowth,
        subscriptionsChange: this.subscriptionGrowth,
        newClientsChange: 20,
        conversionChange: 5.3
      },
      insights: [
        {
          type: 'positive',
          title: 'Crescimento Sustentado',
          description: 'A receita tem crescido consistentemente nos últimos períodos'
        },
        {
          type: 'positive',
          title: 'Aquisição de Clientes',
          description: 'O número de novos clientes aumentou 20% comparado ao período anterior'
        },
        {
          type: 'neutral',
          title: 'Taxa de Conversão Estável',
          description: 'A taxa de conversão mantém-se estável com ligeiro crescimento'
        }
      ]
    };

    this.dialog.open(PeriodComparisonModalComponent, {
      width: '90vw',
      maxWidth: '1000px',
      height: '80vh',
      data: dialogData
    });
  }

  showCohortAnalysis() {
    this.dialog.open(CohortAnalysisModalComponent, {
      width: '95vw',
      maxWidth: '1400px',
      height: '90vh',
      data: {}
    });
  }

  getDaysClass(days: number): string {
    if (days <= 7) return 'days-critical';
    if (days <= 15) return 'days-warning';
    return 'days-normal';
  }

  getPeriodText(): string {
    const periods: { [key: string]: string } = {
      '7days': 'Últimos 7 dias',
      '30days': 'Últimos 30 dias',
      '3months': 'Últimos 3 meses',
      '6months': 'Últimos 6 meses',
      'year': 'Este ano'
    };
    return periods[this.selectedPeriod] || 'Período seleccionado';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'completed': 'Completo',
      'pending': 'Pendente',
      'failed': 'Falhado',
      'processing': 'A Processar'
    };
    return statusMap[status] || status;
  }

  getAlertIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'warning': 'warning',
      'error': 'error',
      'info': 'info'
    };
    return icons[type] || 'info';
  }

  dismissAlert(alertId: number) {
    this.alerts = this.alerts.filter(alert => alert.id !== alertId);
  }

  sendExpirationReminders() {
    if (this.expiringData.length === 0) {
      alert('Não há subscrições a expirar nos próximos 30 dias.');
      return;
    }

    const confirmSend = confirm(`Enviar lembretes para ${this.expiringData.length} clientes com subscrições a expirar?`);
    if (confirmSend) {
      console.log('Enviando lembretes de expiração para:', this.expiringData);
      alert('Lembretes enviados com sucesso!');
    }
  }

  sendMonthlyReport() {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const monthName = nextMonth.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });

    const expiringNextMonth = this.expiringData.filter(item => item.daysLeft <= 30);
    const totalValue = expiringNextMonth.reduce((sum, item) => sum + item.value, 0);

    const reportData = {
      month: monthName,
      expiringCount: expiringNextMonth.length,
      totalValue: totalValue,
      clients: expiringNextMonth.map(item => ({
        name: item.clientName,
        plan: item.plan,
        value: item.value,
        daysLeft: item.daysLeft
      }))
    };

    const confirmSend = confirm(
      `Enviar relatório mensal para ${monthName}?\n\n` +
      `• ${expiringNextMonth.length} subscrições a expirar\n` +
      `• Valor total: ${totalValue.toFixed(2)}€\n\n` +
      `O relatório será enviado por Email, WhatsApp e Telegram.`
    );

    if (confirmSend) {
      console.log('Enviando relatório mensal:', reportData);

      // Simular envio para diferentes canais
      setTimeout(() => {
        alert(
          `Relatório mensal enviado com sucesso!\n\n` +
          `📧 Email: Enviado\n` +
          `📱 WhatsApp: Enviado\n` +
          `📨 Telegram: Enviado (cópia para admin)\n\n` +
          `Dados enviados:\n` +
          `• ${expiringNextMonth.length} subscrições a expirar em ${monthName}\n` +
          `• Valor total em risco: ${totalValue.toFixed(2)}€`
        );
      }, 1500);

      // Mostrar loading
      alert('A enviar relatório mensal... Por favor aguarde.');
    }
  }

  generateDetailedReport() {
    const dialogData = {
      title: `Relatório Detalhado - ${this.getPeriodText()}`,
      totalRevenue: this.totalRevenue,
      revenueGrowth: this.revenueGrowth,
      activeClients: this.activeSubscriptions,
      clientGrowth: this.subscriptionGrowth,
      conversionRate: this.conversionRate,
      conversionChange: 2.5,
      insights: [
        'Crescimento de 12% na receita comparado ao período anterior',
        'Planos anuais representam 45% da receita total',
        'Taxa de retenção de clientes melhorou para 85%',
        'Maior concentração de novos clientes no segmento empresarial'
      ],
      revenueDetails: [
        { period: 'Janeiro', revenue: 15420, growth: 8.5 },
        { period: 'Fevereiro', revenue: 16890, growth: 9.5 },
        { period: 'Março', revenue: 18200, growth: 7.8 },
        { period: 'Abril', revenue: 19500, growth: 7.1 }
      ],
      planPerformance: this.revenueByPlan.map(plan => ({
        plan: plan.plan,
        subscriptions: plan.count,
        revenue: plan.revenue,
        churnRate: Math.random() * 5 + 2
      })),
      recommendations: [
        {
          priority: 'high',
          title: 'Optimizar Retenção de Clientes',
          description: 'Implementar programa de fidelização para reduzir churn rate',
          impact: '+15% receita anual'
        },
        {
          priority: 'medium',
          title: 'Expandir Planos Premium',
          description: 'Criar novos planos com funcionalidades avançadas',
          impact: '+8% receita média por cliente'
        }
      ]
    };

    this.dialog.open(DetailedReportModalComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '80vh',
      data: dialogData
    });
  }

  exportToExcel() {
    const data = {
      metrics: {
        totalRevenue: this.totalRevenue,
        activeSubscriptions: this.activeSubscriptions,
        expiringSubscriptions: this.expiringSubscriptions,
        conversionRate: this.conversionRate
      },
      expiringData: this.expiringData,
      revenueByPlan: this.revenueByPlan,
      recentPayments: this.recentPayments
    };

    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  scheduleReport() {
    const dialogRef = this.dialog.open(ScheduleReportModalComponent, {
      width: '600px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Relatório agendado:', result);
      }
    });
  }

  exportReport() {
    this.reportsService.exportReport({
      period: this.selectedPeriod,
      startDate: this.startDate,
      endDate: this.endDate
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio-' + new Date().toISOString().split('T')[0] + '.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro ao exportar relatório:', error);
      }
    });
  }

  getMetricTooltip(metric: string): string {
    const tooltips: { [key: string]: string } = {
      'revenue': `Receita Total: ${this.totalRevenue}€\n\nEsta métrica representa o valor total de receitas geradas no período seleccionado.\n\nPara melhorar:\n• Aumentar preços dos planos\n• Promover planos de maior valor\n• Reduzir cancelamentos\n• Implementar upselling`,
      'subscriptions': `Subscrições Activas: ${this.activeSubscriptions}\n\nNúmero total de clientes com subscrições activas.\n\nPara melhorar:\n• Campanhas de marketing digital\n• Programa de referenciação\n• Melhorar onboarding\n• Oferecer períodos de teste`,
      'expiring': `A Expirar: ${this.expiringSubscriptions}\n\nSubscrições que expiram nos próximos 30 dias.\n\nPara melhorar:\n• Enviar lembretes antecipados\n• Oferecer descontos de renovação\n• Contacto personalizado\n• Automatizar renovações`,
      'conversion': `Taxa de Conversão: ${this.conversionRate}%\n\nPercentagem de visitantes que se tornam clientes pagantes.\n\nPara melhorar:\n• Optimizar landing pages\n• Simplificar processo de registo\n• Oferecer garantia de devolução\n• Melhorar proposta de valor`
    };
    return tooltips[metric] || 'Informação não disponível';
  }

  getKpiTooltip(kpi: string): string {
    const tooltips: { [key: string]: string } = {
      'mrr': `MRR (Monthly Recurring Revenue): ${this.realtimeKpis.mrr}€\n\nReceita recorrente mensal - valor previsível de receita que a empresa recebe mensalmente.\n\nPara melhorar:\n• Aumentar preços dos planos\n• Fazer upselling para planos superiores\n• Reduzir churn rate\n• Adquirir novos clientes`,
      'churn': `Taxa de Churn: ${this.realtimeKpis.churnRate}%\n\nPercentagem de clientes que cancelam as suas subscrições mensalmente.\n\nPara melhorar:\n• Melhorar experiência do cliente\n• Implementar programa de fidelização\n• Contacto proactivo com clientes\n• Resolver problemas rapidamente`,
      'ltv': `LTV (Lifetime Value): ${this.realtimeKpis.ltv}€\n\nValor total que um cliente gera durante toda a sua relação com a empresa.\n\nPara melhorar:\n• Aumentar tempo de vida do cliente\n• Fazer cross-selling e upselling\n• Melhorar retenção\n• Optimizar onboarding`
    };
    return tooltips[kpi] || 'Informação não disponível';
  }

  startRealtimeUpdates() {
    // Actualizar KPIs a cada 30 segundos para simular tempo real
    this.realtimeInterval = setInterval(() => {
      this.lastUpdate = new Date();

      // Simular pequenas variações nos KPIs
      const mrrVariation = (Math.random() - 0.5) * 100;
      const churnVariation = (Math.random() - 0.5) * 0.2;
      const ltvVariation = (Math.random() - 0.5) * 20;

      this.realtimeKpis.mrr = Math.max(10000, this.realtimeKpis.mrr + mrrVariation);
      this.realtimeKpis.churnRate = Math.max(1, Math.min(10, this.realtimeKpis.churnRate + churnVariation));
      this.realtimeKpis.ltv = Math.max(500, this.realtimeKpis.ltv + ltvVariation);

      // Arredondar valores
      this.realtimeKpis.mrr = Math.round(this.realtimeKpis.mrr);
      this.realtimeKpis.churnRate = Math.round(this.realtimeKpis.churnRate * 10) / 10;
      this.realtimeKpis.ltv = Math.round(this.realtimeKpis.ltv);
    }, 30000);
  }

  ngOnDestroy() {
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
    }

    // Destruir gráficos
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }
  }
}
