import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-detailed-report-modal',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatTabsModule, MatTableModule, MatCardModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>Relatório Detalhado - {{ data.title }}</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content class="modal-content">
      <mat-tab-group>
        <mat-tab label="Resumo Executivo">
          <div class="tab-content">
            <div class="summary-grid">
              <mat-card class="summary-card">
                <mat-card-content>
                  <h3>Receita Total</h3>
                  <div class="metric-value">{{ data.totalRevenue }}€</div>
                  <div class="metric-change positive">+{{ data.revenueGrowth }}% vs período anterior</div>
                </mat-card-content>
              </mat-card>
              
              <mat-card class="summary-card">
                <mat-card-content>
                  <h3>Clientes Activos</h3>
                  <div class="metric-value">{{ data.activeClients }}</div>
                  <div class="metric-change positive">+{{ data.clientGrowth }}% vs período anterior</div>
                </mat-card-content>
              </mat-card>
              
              <mat-card class="summary-card">
                <mat-card-content>
                  <h3>Taxa de Conversão</h3>
                  <div class="metric-value">{{ data.conversionRate }}%</div>
                  <div class="metric-change">{{ data.conversionChange }}% vs período anterior</div>
                </mat-card-content>
              </mat-card>
            </div>
            
            <mat-card class="insights-card">
              <mat-card-header>
                <mat-card-title>Principais Insights</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="insights-list">
                  <li *ngFor="let insight of data.insights">{{ insight }}</li>
                </ul>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
        
        <mat-tab label="Análise de Receitas">
          <div class="tab-content">
            <table mat-table [dataSource]="data.revenueDetails" class="detail-table">
              <ng-container matColumnDef="period">
                <th mat-header-cell *matHeaderCellDef>Período</th>
                <td mat-cell *matCellDef="let item">{{ item.period }}</td>
              </ng-container>
              
              <ng-container matColumnDef="revenue">
                <th mat-header-cell *matHeaderCellDef>Receita</th>
                <td mat-cell *matCellDef="let item">{{ item.revenue }}€</td>
              </ng-container>
              
              <ng-container matColumnDef="growth">
                <th mat-header-cell *matHeaderCellDef>Crescimento</th>
                <td mat-cell *matCellDef="let item" [ngClass]="item.growth >= 0 ? 'positive' : 'negative'">
                  {{ item.growth }}%
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="revenueColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: revenueColumns;"></tr>
            </table>
          </div>
        </mat-tab>
        
        <mat-tab label="Performance por Plano">
          <div class="tab-content">
            <table mat-table [dataSource]="data.planPerformance" class="detail-table">
              <ng-container matColumnDef="plan">
                <th mat-header-cell *matHeaderCellDef>Plano</th>
                <td mat-cell *matCellDef="let item">{{ item.plan }}</td>
              </ng-container>
              
              <ng-container matColumnDef="subscriptions">
                <th mat-header-cell *matHeaderCellDef>Subscrições</th>
                <td mat-cell *matCellDef="let item">{{ item.subscriptions }}</td>
              </ng-container>
              
              <ng-container matColumnDef="revenue">
                <th mat-header-cell *matHeaderCellDef>Receita</th>
                <td mat-cell *matCellDef="let item">{{ item.revenue }}€</td>
              </ng-container>
              
              <ng-container matColumnDef="churn">
                <th mat-header-cell *matHeaderCellDef>Taxa de Churn</th>
                <td mat-cell *matCellDef="let item">{{ item.churnRate }}%</td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="planColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: planColumns;"></tr>
            </table>
          </div>
        </mat-tab>
        
        <mat-tab label="Recomendações">
          <div class="tab-content">
            <mat-card class="recommendations-card">
              <mat-card-header>
                <mat-card-title>Recomendações Estratégicas</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="recommendation-item" *ngFor="let rec of data.recommendations">
                  <div class="rec-priority" [ngClass]="rec.priority">{{ rec.priority }}</div>
                  <div class="rec-content">
                    <h4>{{ rec.title }}</h4>
                    <p>{{ rec.description }}</p>
                    <div class="rec-impact">Impacto estimado: {{ rec.impact }}</div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>
    
    <mat-dialog-actions class="modal-actions">
      <button mat-button (click)="exportPDF()">
        <mat-icon>picture_as_pdf</mat-icon>
        Exportar PDF
      </button>
      <button mat-button (click)="exportExcel()">
        <mat-icon>table_chart</mat-icon>
        Exportar Excel
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
      padding: 0;
      max-height: 70vh;
      overflow-y: auto;
    }
    
    .tab-content {
      padding: 24px;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .summary-card {
      text-align: center;
    }
    
    .metric-value {
      font-size: 32px;
      font-weight: 600;
      color: #1976d2;
      margin: 8px 0;
    }
    
    .metric-change {
      font-size: 14px;
      font-weight: 500;
    }
    
    .metric-change.positive {
      color: #2e7d32;
    }
    
    .metric-change.negative {
      color: #c62828;
    }
    
    .insights-card {
      margin-top: 16px;
    }
    
    .insights-list {
      list-style: none;
      padding: 0;
    }
    
    .insights-list li {
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .insights-list li:before {
      content: "💡";
      margin-right: 8px;
    }
    
    .detail-table {
      width: 100%;
      margin-top: 16px;
    }
    
    .positive {
      color: #2e7d32;
      font-weight: 600;
    }
    
    .negative {
      color: #c62828;
      font-weight: 600;
    }
    
    .recommendations-card {
      margin-top: 16px;
    }
    
    .recommendation-item {
      display: flex;
      gap: 16px;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    
    .rec-priority {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      align-self: flex-start;
    }
    
    .rec-priority.high {
      background: #ffebee;
      color: #c62828;
    }
    
    .rec-priority.medium {
      background: #fff3e0;
      color: #f57c00;
    }
    
    .rec-priority.low {
      background: #e8f5e8;
      color: #2e7d32;
    }
    
    .rec-content {
      flex: 1;
    }
    
    .rec-content h4 {
      margin: 0 0 8px 0;
      color: #333;
    }
    
    .rec-content p {
      margin: 0 0 8px 0;
      color: #666;
    }
    
    .rec-impact {
      font-size: 14px;
      font-weight: 500;
      color: #1976d2;
    }
    
    .modal-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }
  `]
})
export class DetailedReportModalComponent {
  revenueColumns = ['period', 'revenue', 'growth'];
  planColumns = ['plan', 'subscriptions', 'revenue', 'churn'];
  
  constructor(
    public dialogRef: MatDialogRef<DetailedReportModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  exportPDF() {
    console.log('Exportando relatório detalhado em PDF...');
  }
  
  exportExcel() {
    console.log('Exportando relatório detalhado em Excel...');
  }
}