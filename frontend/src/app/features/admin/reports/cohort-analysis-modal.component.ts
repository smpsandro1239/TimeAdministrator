import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-cohort-analysis-modal',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatCardModule, MatTableModule, MatSelectModule, MatFormFieldModule, FormsModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>Análise de Coortes</h2>
      <div class="header-controls">
        <mat-form-field appearance="outline">
          <mat-label>Métrica</mat-label>
          <mat-select [(value)]="selectedMetric" (selectionChange)="updateAnalysis()">
            <mat-option value="retention">Taxa de Retenção</mat-option>
            <mat-option value="revenue">Receita por Coorte</mat-option>
            <mat-option value="activity">Actividade</mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
    
    <mat-dialog-content class="modal-content">
      <div class="analysis-summary">
        <mat-card>
          <mat-card-content>
            <div class="summary-grid">
              <div class="summary-item">
                <h3>{{ cohortData.totalCohorts }}</h3>
                <p>Coortes Analisadas</p>
              </div>
              <div class="summary-item">
                <h3>{{ cohortData.avgRetention }}%</h3>
                <p>Retenção Média</p>
              </div>
              <div class="summary-item">
                <h3>{{ cohortData.bestCohort }}</h3>
                <p>Melhor Coorte</p>
              </div>
              <div class="summary-item">
                <h3>{{ cohortData.totalUsers }}</h3>
                <p>Total de Utilizadores</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div class="cohort-table-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Tabela de Coortes - {{ getMetricTitle() }}</mat-card-title>
            <mat-card-subtitle>Valores em {{ getMetricUnit() }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="table-container">
              <table class="cohort-table">
                <thead>
                  <tr>
                    <th>Coorte</th>
                    <th>Utilizadores</th>
                    <th *ngFor="let period of periods">{{ period }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let cohort of cohortData.cohorts">
                    <td class="cohort-name">{{ cohort.name }}</td>
                    <td class="user-count">{{ cohort.users }}</td>
                    <td *ngFor="let value of cohort.values" 
                        class="cohort-value" 
                        [ngClass]="getCohortValueClass(value)"
                        [style.background-color]="getCohortColor(value)">
                      {{ formatCohortValue(value) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div class="cohort-chart-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Evolução das Coortes</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas #cohortChart></canvas>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div class="insights-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Insights da Análise</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="insights-list">
              <div class="insight-item" *ngFor="let insight of cohortInsights">
                <mat-icon [ngClass]="insight.type">{{ getInsightIcon(insight.type) }}</mat-icon>
                <div class="insight-content">
                  <h4>{{ insight.title }}</h4>
                  <p>{{ insight.description }}</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions class="modal-actions">
      <button mat-button (click)="exportCohortAnalysis()">
        <mat-icon>download</mat-icon>
        Exportar Análise
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
    
    .header-controls {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .modal-content {
      padding: 24px;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .analysis-summary {
      margin-bottom: 24px;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }
    
    .summary-item {
      text-align: center;
      padding: 16px;
    }
    
    .summary-item h3 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #1976d2;
    }
    
    .summary-item p {
      margin: 8px 0 0 0;
      font-size: 14px;
      color: #666;
    }
    
    .cohort-table-section {
      margin-bottom: 24px;
    }
    
    .table-container {
      overflow-x: auto;
      max-width: 100%;
    }
    
    .cohort-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    
    .cohort-table th,
    .cohort-table td {
      padding: 8px;
      text-align: center;
      border: 1px solid #e0e0e0;
    }
    
    .cohort-table th {
      background: #f5f5f5;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    
    .cohort-name {
      font-weight: 600;
      background: #f9f9f9 !important;
      text-align: left !important;
    }
    
    .user-count {
      font-weight: 600;
      background: #f9f9f9 !important;
    }
    
    .cohort-value {
      font-weight: 500;
      color: white;
      text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
    }
    
    .cohort-chart-section {
      margin-bottom: 24px;
      min-height: 300px;
    }
    
    .cohort-chart-section canvas {
      max-height: 250px;
    }
    
    .insights-section {
      margin-bottom: 16px;
    }
    
    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .insight-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      background: #f5f5f5;
    }
    
    .insight-item mat-icon.positive {
      color: #4caf50;
    }
    
    .insight-item mat-icon.negative {
      color: #f44336;
    }
    
    .insight-item mat-icon.neutral {
      color: #ff9800;
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
  `]
})
export class CohortAnalysisModalComponent implements AfterViewInit {
  @ViewChild('cohortChart') cohortChartRef!: ElementRef<HTMLCanvasElement>;
  
  selectedMetric = 'retention';
  periods = ['Mês 0', 'Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5'];
  cohortChart?: Chart;
  
  cohortData = {
    totalCohorts: 6,
    avgRetention: 72,
    bestCohort: 'Jan 2024',
    totalUsers: 1250,
    cohorts: [
      {
        name: 'Jan 2024',
        users: 245,
        values: [100, 85, 72, 68, 65, 62]
      },
      {
        name: 'Fev 2024',
        users: 198,
        values: [100, 82, 69, 64, 60, 58]
      },
      {
        name: 'Mar 2024',
        users: 267,
        values: [100, 88, 75, 71, 68, 65]
      },
      {
        name: 'Abr 2024',
        users: 189,
        values: [100, 79, 66, 61, 57, null]
      },
      {
        name: 'Mai 2024',
        users: 223,
        values: [100, 84, 71, 67, null, null]
      },
      {
        name: 'Jun 2024',
        users: 128,
        values: [100, 91, 78, null, null, null]
      }
    ]
  };
  
  cohortInsights = [
    {
      type: 'positive',
      title: 'Retenção Forte no Primeiro Mês',
      description: 'A taxa de retenção média no primeiro mês é de 85%, indicando boa satisfação inicial dos clientes.'
    },
    {
      type: 'neutral',
      title: 'Declínio Gradual Esperado',
      description: 'A retenção diminui gradualmente ao longo dos meses, seguindo um padrão típico de SaaS.'
    },
    {
      type: 'positive',
      title: 'Coorte de Março Destaca-se',
      description: 'A coorte de Março 2024 apresenta as melhores taxas de retenção em todos os períodos.'
    }
  ];
  
  constructor(
    public dialogRef: MatDialogRef<CohortAnalysisModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    Chart.register(...registerables);
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.createCohortChart();
    }, 100);
  }
  
  createCohortChart() {
    const ctx = this.cohortChartRef.nativeElement.getContext('2d');
    if (ctx) {
      const datasets = this.cohortData.cohorts.map((cohort, index) => ({
        label: cohort.name,
        data: cohort.values.filter(v => v !== null),
        borderColor: this.getChartColor(index),
        backgroundColor: this.getChartColor(index, 0.1),
        fill: false,
        tension: 0.4
      }));
      
      this.cohortChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.periods.slice(0, 6),
          datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    }
  }
  
  updateAnalysis() {
    // Actualizar dados baseado na métrica seleccionada
    if (this.selectedMetric === 'revenue') {
      this.cohortData.cohorts.forEach(cohort => {
        cohort.values = cohort.values.map(v => v ? v * 0.8 + Math.random() * 40 : null);
      });
    }
    
    if (this.cohortChart) {
      this.cohortChart.destroy();
      this.createCohortChart();
    }
  }
  
  getMetricTitle(): string {
    const titles = {
      retention: 'Taxa de Retenção',
      revenue: 'Receita por Coorte',
      activity: 'Actividade dos Utilizadores'
    };
    return titles[this.selectedMetric as keyof typeof titles];
  }
  
  getMetricUnit(): string {
    const units = {
      retention: 'percentagem',
      revenue: 'euros',
      activity: 'acções por utilizador'
    };
    return units[this.selectedMetric as keyof typeof units];
  }
  
  getCohortValueClass(value: number | null): string {
    if (value === null) return 'no-data';
    if (value >= 80) return 'high-value';
    if (value >= 60) return 'medium-value';
    return 'low-value';
  }
  
  getCohortColor(value: number | null): string {
    if (value === null) return '#f5f5f5';
    if (value >= 80) return '#4caf50';
    if (value >= 70) return '#8bc34a';
    if (value >= 60) return '#ffc107';
    if (value >= 50) return '#ff9800';
    return '#f44336';
  }
  
  formatCohortValue(value: number | null): string {
    if (value === null) return '-';
    return this.selectedMetric === 'revenue' ? `${value.toFixed(0)}€` : `${value.toFixed(0)}%`;
  }
  
  getChartColor(index: number, alpha: number = 1): string {
    const colors = [
      `rgba(33, 150, 243, ${alpha})`,
      `rgba(76, 175, 80, ${alpha})`,
      `rgba(255, 152, 0, ${alpha})`,
      `rgba(156, 39, 176, ${alpha})`,
      `rgba(244, 67, 54, ${alpha})`,
      `rgba(96, 125, 139, ${alpha})`
    ];
    return colors[index % colors.length];
  }
  
  getInsightIcon(type: string): string {
    switch (type) {
      case 'positive': return 'trending_up';
      case 'negative': return 'trending_down';
      default: return 'info';
    }
  }
  
  exportCohortAnalysis() {
    console.log('Exportar análise de coortes...');
  }
}