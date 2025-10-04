import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-status-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTableModule],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>{{ getTitle() }}</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content>
      <div class="summary">
        <p><strong>Total:</strong> {{ data.payments.length }}</p>
        <p *ngIf="data.status !== 'total'"><strong>Valor:</strong> {{ getTotalValue() }}€</p>
      </div>
      
      <!-- Desktop Table -->
      <table mat-table [dataSource]="data.payments" class="details-table desktop-only">
        <ng-container matColumnDef="client">
          <th mat-header-cell *matHeaderCellDef>Cliente</th>
          <td mat-cell *matCellDef="let payment">{{ payment.clientName }}</td>
        </ng-container>
        
        <ng-container matColumnDef="reference">
          <th mat-header-cell *matHeaderCellDef>Referência</th>
          <td mat-cell *matCellDef="let payment">{{ payment.reference }}</td>
        </ng-container>
        
        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef>Valor</th>
          <td mat-cell *matCellDef="let payment" class="amount-cell">{{ payment.amount }}€</td>
        </ng-container>
        
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Data</th>
          <td mat-cell *matCellDef="let payment">{{ formatDate(payment.date) }}</td>
        </ng-container>
        
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      
      <!-- Mobile Cards -->
      <div class="mobile-only">
        <div class="payment-card" *ngFor="let payment of data.payments">
          <div class="card-row">
            <span class="label">Cliente:</span>
            <span class="value">{{ payment.clientName }}</span>
          </div>
          <div class="card-row">
            <span class="label">Referência:</span>
            <span class="value">{{ payment.reference }}</span>
          </div>
          <div class="card-row">
            <span class="label">Valor:</span>
            <span class="value amount">{{ payment.amount }}€</span>
          </div>
          <div class="card-row">
            <span class="label">Data:</span>
            <span class="value">{{ formatDate(payment.date) }}</span>
          </div>
        </div>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions>
      <button mat-raised-button color="primary" mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      margin: -24px -24px 0 -24px;
    }
    .dialog-header h2 {
      color: white;
      margin: 0;
      font-size: 20px;
    }
    .dialog-header button {
      color: white;
    }
    .summary {
      background: #e3f2fd;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #2196F3;
    }
    .summary p {
      margin: 4px 0;
      color: #1565C0;
    }
    .details-table { width: 100%; }
    .amount-cell { text-align: right; font-weight: 600; color: #2196F3; }
    mat-dialog-content { max-height: 60vh; overflow-y: auto; padding: 0 24px; }
    mat-dialog-actions { padding: 16px 24px; justify-content: flex-end; }
    
    .desktop-only { display: block; }
    .mobile-only { display: none; }
    
    @media (max-width: 768px) {
      .desktop-only { display: none; }
      .mobile-only { display: block; }
      
      .payment-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
      }
      .card-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f5f5f5;
      }
      .card-row:last-child { border-bottom: none; }
      .label {
        font-weight: 500;
        color: #666;
      }
      .value {
        font-weight: 500;
        color: #333;
      }
      .value.amount {
        color: #2196F3;
        font-weight: 600;
      }
      mat-dialog-actions button { width: 100%; }
    }
  `]
})
export class StatusDetailsDialogComponent {
  displayedColumns: string[] = ['client', 'reference', 'amount', 'date'];

  constructor(
    public dialogRef: MatDialogRef<StatusDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getTitle(): string {
    switch(this.data.status) {
      case 'pending': return 'Pagamentos Pendentes';
      case 'approved': return 'Pagamentos Aprovados';
      case 'rejected': return 'Pagamentos Rejeitados';
      case 'total': return 'Todos os Pagamentos Aprovados';
      default: return 'Detalhes dos Pagamentos';
    }
  }

  getTotalValue(): number {
    return this.data.payments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-PT');
  }
}