import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-period-comparison-modal',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatCardModule, MatTableModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>Comparação de Períodos</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content class="modal-content">
      <div class="comparison-grid">
        <mat-card class="period-card current">
          <mat-card-header>
            <mat-card-title>{{ data.currentPeriod.name }}</mat-card-title>
            <mat-card-subtitle>Período Actual</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="metrics-list">
              <div class="metric-item">
                <span class="metric-label">Receita Total</span>
                <span class="metric-value">{{ data.currentPeriod.revenue }}€</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Subscrições</span>
                <span class="metric-value">{{ data.currentPeriod.subscriptions }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Novos Clientes</span>
                <span class="metric-value">{{ data.currentPeriod.newClients }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Taxa Conversão</span>
                <span class="metric-value">{{ data.currentPeriod.conversionRate }}%</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="period-card previous">
          <mat-card-header>
            <mat-card-title>{{ data.previousPeriod.name }}</mat-card-title>
            <mat-card-subtitle>Período Anterior</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="metrics-list">
              <div class="metric-item">
                <span class="metric-label">Receita Total</span>
                <span class="metric-value">{{ data.previousPeriod.revenue }}€</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Subscrições</span>
                <span class="metric-value">{{ data.previousPeriod.subscriptions }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Novos Clientes</span>
                <span class="metric-value">{{ data.previousPeriod.newClients }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Taxa Conversão</span>
                <span class="metric-value">{{ data.previousPeriod.conversionRate }}%</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="period-card comparison">
          <mat-card-header>
            <mat-card-title>Variação</mat-card-title>
            <mat-card-subtitle>Diferença Percentual</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="metrics-list">
              <div class="metric-item">
                <span class="metric-label">Receita</span>
                <span class="metric-value" [ngClass]="getChangeClass(data.comparison.revenueChange)">
                  <mat-icon>{{ getChangeIcon(data.comparison.revenueChange) }}</mat-icon>
                  {{ Math.abs(data.comparison.revenueChange) }}%
                </span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Subscrições</span>
                <span class="metric-value" [ngClass]="getChangeClass(data.comparison.subscriptionsChange)">
                  <mat-icon>{{ getChangeIcon(data.comparison.subscriptionsChange) }}</mat-icon>
                  {{ Math.abs(data.comparison.subscriptionsChange) }}%
                </span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Novos Clientes</span>
                <span class="metric-value" [ngClass]="getChangeClass(data.comparison.newClientsChange)">
                  <mat-icon>{{ getChangeIcon(data.comparison.newClientsChange) }}</mat-icon>
                  {{ Math.abs(data.comparison.newClientsChange) }}%
                </span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Conversão</span>
                <span class="metric-value" [ngClass]="getChangeClass(data.comparison.conversionChange)">
                  <mat-icon>{{ getChangeIcon(data.comparison.conversionChange) }}</mat-icon>
                  {{ Math.abs(data.comparison.conversionChange) }}%
                </span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <mat-card class="chart-section">
        <mat-card-header>
          <mat-card-title>Evolução Comparativa</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <canvas #comparisonChart></canvas>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="insights-section">
        <mat-card-header>
          <mat-card-title>Análise Comparativa</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="insights-grid">
            <div class="insight-item" *ngFor="let insight of data.insights" [ngClass]="insight.type">
              <mat-icon>{{ getInsightIcon(insight.type) }}</mat-icon>
              <div class="insight-content">
                <h4>{{ insight.title }}</h4>
                <p>{{ insight.description }}</p>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </mat-dialog-content>
    
    <mat-dialog-actions class="modal-actions">
      <button mat-button (click)="exportComparison()">
        <mat-icon>download</mat-icon>
        Exportar Comparação
      </button>
      <button mat-raised-button color="primary" mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .modal-content {
      padding: 24px;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .period-card {
      min-height: 200px;
    }
    
    .period-card.current {
      border-left: 4px solid #2196f3;
    }
    
    .period-card.previous {
      border-left: 4px solid #9e9e9e;
    }
    
    .period-card.comparison {
      border-left: 4px solid #4caf50;
    }
    
    .metrics-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .metric-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .metric-label {
      font-size: 14px;
      color: #666;
    }
    
    .metric-value {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .metric-value.positive {
      color: #2e7d32;
    }
    
    .metric-value.negative {
      color: #c62828;
    }
    
    .metric-value.neutral {
      color: #666;
    }
    
    .chart-section {
      margin-bottom: 24px;
      min-height: 300px;
    }
    
    .chart-section canvas {
      max-height: 250px;
    }
    
    .insights-section {
      margin-bottom: 16px;
    }
    
    .insights-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .insight-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid;
    }
    
    .insight-item.positive {
      background: #e8f5e8;
      border-left-color: #4caf50;
    }
    
    .insight-item.negative {
      background: #ffebee;
      border-left-color: #f44336;
    }
    
    .insight-item.neutral {
      background: #f5f5f5;
      border-left-color: #9e9e9e;
    }
    
    .insight-content h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
    }
    
    .insight-content p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
    
    .modal-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }
    
    @media (max-width: 768px) {
      .comparison-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PeriodComparisonModalComponent implements AfterViewInit {
  @ViewChild('comparisonChart') comparisonChartRef!: ElementRef<HTMLCanvasElement>;
  
  Math = Math;
  comparisonChart?: Chart;
  
  constructor(
    public dialogRef: MatDialogRef<PeriodComparisonModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    Chart.register(...registerables);
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.createComparisonChart();
    }, 100);
  }
  
  createComparisonChart() {
    const ctx = this.comparisonChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Receita', 'Subscrições', 'Novos Clientes', 'Taxa Conversão'],
          datasets: [
            {
              label: this.data.currentPeriod.name,
              data: [
                this.data.currentPeriod.revenue,
                this.data.currentPeriod.subscriptions,
                this.data.currentPeriod.newClients,
                this.data.currentPeriod.conversionRate
              ],
              backgroundColor: 'rgba(33, 150, 243, 0.8)',
              borderColor: '#2196f3',
              borderWidth: 1
            },
            {
              label: this.data.previousPeriod.name,
              data: [
                this.data.previousPeriod.revenue,
                this.data.previousPeriod.subscriptions,
                this.data.previousPeriod.newClients,
                this.data.previousPeriod.conversionRate
              ],
              backgroundColor: 'rgba(158, 158, 158, 0.8)',
              borderColor: '#9e9e9e',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
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
  
  getChangeClass(change: number): string {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  }
  
  getChangeIcon(change: number): string {
    if (change > 0) return 'trending_up';
    if (change < 0) return 'trending_down';
    return 'trending_flat';
  }
  
  getInsightIcon(type: string): string {
    switch (type) {
      case 'positive': return 'thumb_up';
      case 'negative': return 'thumb_down';
      default: return 'info';
    }
  }
  
  exportComparison() {
    console.log('Exportar comparação de períodos...');
  }
}