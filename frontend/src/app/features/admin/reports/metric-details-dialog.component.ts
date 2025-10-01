import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-metric-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTableModule],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content>
      <div class="metric-summary">
        <div class="metric-value">
          <span class="value">{{ data.value }}{{ data.metric === 'revenue' ? '€' : data.metric === 'conversion' ? '%' : '' }}</span>
          <span class="trend" [ngClass]="getTrendClass()">{{ data.trend }}</span>
        </div>
        <p class="period">{{ data.period }}</p>
      </div>
      
      <div class="details-section" *ngIf="data.metric === 'revenue'">
        <h3>Receitas por Plano</h3>
        <table mat-table [dataSource]="data.details" class="details-table">
          <ng-container matColumnDef="plan">
            <th mat-header-cell *matHeaderCellDef>Plano</th>
            <td mat-cell *matCellDef="let item">{{ item.plan }}</td>
          </ng-container>
          
          <ng-container matColumnDef="count">
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
      </div>
      
      <div class="details-section" *ngIf="data.metric === 'subscriptions'">
        <h3>Subscrições por Plano</h3>
        <table mat-table [dataSource]="data.details" class="details-table">
          <ng-container matColumnDef="plan">
            <th mat-header-cell *matHeaderCellDef>Plano</th>
            <td mat-cell *matCellDef="let item">{{ item.plan }}</td>
          </ng-container>
          
          <ng-container matColumnDef="count">
            <th mat-header-cell *matHeaderCellDef>Quantidade</th>
            <td mat-cell *matCellDef="let item">{{ item.count }}</td>
          </ng-container>
          
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let item">
              <span class="status active">{{ getStatusText(item.status) }}</span>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="subscriptionsColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: subscriptionsColumns;"></tr>
        </table>
      </div>
      
      <div class="details-section" *ngIf="data.metric === 'expiring'">
        <h3>Subscrições a Expirar</h3>
        <table mat-table [dataSource]="data.details" class="details-table">
          <ng-container matColumnDef="clientName">
            <th mat-header-cell *matHeaderCellDef>Cliente</th>
            <td mat-cell *matCellDef="let item">{{ item.clientName }}</td>
          </ng-container>
          
          <ng-container matColumnDef="plan">
            <th mat-header-cell *matHeaderCellDef>Plano</th>
            <td mat-cell *matCellDef="let item">{{ item.plan }}</td>
          </ng-container>
          
          <ng-container matColumnDef="daysLeft">
            <th mat-header-cell *matHeaderCellDef>Dias Restantes</th>
            <td mat-cell *matCellDef="let item" [ngClass]="getDaysClass(item.daysLeft)">
              {{ item.daysLeft }} dias
            </td>
          </ng-container>
          
          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>Valor</th>
            <td mat-cell *matCellDef="let item" class="revenue-cell">{{ item.value }}€</td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="expiringColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: expiringColumns;"></tr>
        </table>
      </div>
      
      <div class="details-section" *ngIf="data.metric === 'conversion'">
        <h3>Funil de Conversão</h3>
        <div class="conversion-funnel">
          <div class="funnel-item" *ngFor="let item of data.details">
            <div class="funnel-label">{{ item.metric }}</div>
            <div class="funnel-value">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fechar</button>
      <button mat-raised-button color="primary" (click)="exportDetails()">
        <mat-icon>download</mat-icon>
        Exportar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .metric-summary {
      text-align: center;
      padding: 24px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    
    .metric-value {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    
    .value {
      font-size: 32px;
      font-weight: 600;
      color: #333;
    }
    
    .trend {
      font-size: 14px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 12px;
    }
    
    .trend.positive {
      background: #e8f5e8;
      color: #2e7d32;
    }
    
    .trend.negative {
      background: #ffebee;
      color: #c62828;
    }
    
    .period {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    
    .details-section {
      margin-bottom: 24px;
    }
    
    .details-section h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 18px;
    }
    
    .details-table {
      width: 100%;
    }
    
    .revenue-cell {
      text-align: right;
      font-weight: 500;
    }
    
    .status {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status.active {
      background: #e8f5e8;
      color: #2e7d32;
    }
    
    .critical {
      color: #c62828;
      font-weight: 600;
    }
    
    .warning {
      color: #ef6c00;
      font-weight: 500;
    }
    
    .caution {
      color: #f57f17;
    }
    
    .conversion-funnel {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
    }
    
    .funnel-item {
      text-align: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }
    
    .funnel-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .funnel-value {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  `]
})
export class MetricDetailsDialogComponent {
  revenueColumns = ['plan', 'count', 'revenue', 'percentage'];
  subscriptionsColumns = ['plan', 'count', 'status'];
  expiringColumns = ['clientName', 'plan', 'daysLeft', 'value'];

  constructor(
    public dialogRef: MatDialogRef<MetricDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getTrendClass(): string {
    return this.data.trend.startsWith('+') ? 'positive' : 'negative';
  }

  getDaysClass(days: number): string {
    if (days <= 3) return 'critical';
    if (days <= 7) return 'warning';
    if (days <= 15) return 'caution';
    return '';
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'active': return 'Ativa';
      case 'expired': return 'Expirada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  }

  exportDetails(): void {
    console.log('Exportar detalhes da métrica:', this.data.metric);
    // Implementar lógica de exportação
  }
}