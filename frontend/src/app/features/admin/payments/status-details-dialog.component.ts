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
        <p><strong>Total de pagamentos:</strong> {{ data.payments.length }}</p>
        <p *ngIf="data.status !== 'total'"><strong>Valor total:</strong> {{ getTotalValue() }}€</p>
      </div>
      
      <table mat-table [dataSource]="data.payments" class="details-table">
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
    </mat-dialog-content>
    
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .summary { background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
    .summary p { margin: 4px 0; }
    .details-table { width: 100%; }
    .amount-cell { text-align: right; font-weight: 500; }
    mat-dialog-content { max-height: 500px; overflow-y: auto; }
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