import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-view-payments-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatCardModule, MatTableModule, MatChipsModule, MatDividerModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>
        <mat-icon class="title-icon">payment</mat-icon>
        <span>Pagamentos - {{ data.client.name }}</span>
      </h2>
    </div>
    
    <mat-dialog-content>
      <div class="payments-container">
        <!-- Resumo -->
        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>assessment</mat-icon>
              Resumo de Pagamentos
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-grid">
              <div class="summary-item">
                <mat-icon class="summary-icon">euro</mat-icon>
                <div class="summary-content">
                  <div class="summary-value">{{ getTotalPaid() }}€</div>
                  <div class="summary-label">Total Pago</div>
                </div>
              </div>
              <div class="summary-item">
                <mat-icon class="summary-icon">receipt</mat-icon>
                <div class="summary-content">
                  <div class="summary-value">{{ payments.length }}</div>
                  <div class="summary-label">Transacções</div>
                </div>
              </div>
              <div class="summary-item">
                <mat-icon class="summary-icon">pending</mat-icon>
                <div class="summary-content">
                  <div class="summary-value">{{ getPendingCount() }}</div>
                  <div class="summary-label">Pendentes</div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Histórico de Pagamentos -->
        <mat-card class="payments-history">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>history</mat-icon>
              Histórico de Pagamentos
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="payments" class="payments-table">
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Data</th>
                <td mat-cell *matCellDef="let payment">{{ payment.date | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <ng-container matColumnDef="reference">
                <th mat-header-cell *matHeaderCellDef>Referência</th>
                <td mat-cell *matCellDef="let payment">{{ payment.reference }}</td>
              </ng-container>

              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Valor</th>
                <td mat-cell *matCellDef="let payment" class="amount-cell">{{ payment.amount }}€</td>
              </ng-container>

              <ng-container matColumnDef="method">
                <th mat-header-cell *matHeaderCellDef>Método</th>
                <td mat-cell *matCellDef="let payment">
                  <mat-chip [ngClass]="payment.method">
                    <mat-icon>{{ getMethodIcon(payment.method) }}</mat-icon>
                    {{ getMethodText(payment.method) }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let payment">
                  <mat-chip [ngClass]="payment.status">
                    <mat-icon>{{ getStatusIcon(payment.status) }}</mat-icon>
                    {{ getStatusText(payment.status) }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acções</th>
                <td mat-cell *matCellDef="let payment">
                  <button mat-icon-button (click)="viewPaymentDetails(payment)" matTooltip="Ver detalhes">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button *ngIf="payment.status === 'pending'" 
                          (click)="approvePayment(payment)" color="primary" matTooltip="Aprovar">
                    <mat-icon>check</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="no-payments" *ngIf="payments.length === 0">
              <mat-icon>receipt_long</mat-icon>
              <p>Nenhum pagamento encontrado para este cliente.</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="close()">Fechar</button>
      <button mat-raised-button color="primary" (click)="addPayment()">
        <mat-icon>add</mat-icon>
        Novo Pagamento
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header { 
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); 
      color: white; 
      margin: -24px -24px 24px -24px; 
      padding: 24px; 
    }
    .dialog-header h2 { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      margin: 0; 
    }
    .title-icon { font-size: 28px; }
    
    .payments-container { 
      display: flex; 
      flex-direction: column; 
      gap: 20px; 
      max-width: 800px; 
      min-width: 600px; 
    }
    
    .summary-card mat-card-title,
    .payments-history mat-card-title { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      color: #1976d2; 
    }
    
    .summary-grid { 
      display: grid; 
      grid-template-columns: repeat(3, 1fr); 
      gap: 16px; 
    }
    .summary-item { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      padding: 16px; 
      background: #f8f9fa; 
      border-radius: 12px; 
      text-align: center; 
    }
    .summary-icon { 
      font-size: 32px; 
      color: #1976d2; 
    }
    .summary-value { 
      font-size: 24px; 
      font-weight: 600; 
      color: #333; 
    }
    .summary-label { 
      font-size: 12px; 
      color: #666; 
      text-transform: uppercase; 
    }
    
    .payments-table { width: 100%; }
    .amount-cell { 
      text-align: right; 
      font-weight: 600; 
    }
    
    mat-chip { 
      display: flex; 
      align-items: center; 
      gap: 4px; 
    }
    mat-chip.stripe { background: #e3f2fd; color: #1976d2; }
    mat-chip.transfer { background: #f3e5f5; color: #7b1fa2; }
    mat-chip.cash { background: #e8f5e8; color: #2e7d32; }
    mat-chip.approved { background: #e8f5e8; color: #2e7d32; }
    mat-chip.pending { background: #fff3e0; color: #ef6c00; }
    mat-chip.rejected { background: #ffebee; color: #c62828; }
    
    .no-payments { 
      text-align: center; 
      padding: 40px; 
      color: #666; 
    }
    .no-payments mat-icon { 
      font-size: 48px; 
      margin-bottom: 16px; 
      opacity: 0.5; 
    }
    
    .dialog-actions { 
      display: flex; 
      justify-content: space-between; 
      padding: 16px 24px; 
    }
    
    @media (max-width: 768px) {
      .payments-container { 
        max-width: 100%; 
        min-width: 0; 
      }
      .summary-grid { 
        grid-template-columns: 1fr; 
      }
      .payments-table { 
        font-size: 14px; 
      }
      .dialog-actions { 
        flex-direction: column; 
        gap: 12px; 
      }
      .dialog-actions button { 
        width: 100%; 
      }
      .dialog-header { 
        margin: -24px -16px 16px -16px; 
        padding: 16px; 
      }
    }
  `]
})
export class ViewPaymentsDialogComponent {
  displayedColumns: string[] = ['date', 'reference', 'amount', 'method', 'status', 'actions'];
  
  payments = [
    { 
      id: 1, 
      date: new Date('2024-09-15'), 
      reference: 'PAY-001', 
      amount: 29.99, 
      method: 'stripe', 
      status: 'approved' 
    },
    { 
      id: 2, 
      date: new Date('2024-08-15'), 
      reference: 'PAY-002', 
      amount: 29.99, 
      method: 'transfer', 
      status: 'approved' 
    },
    { 
      id: 3, 
      date: new Date('2024-10-01'), 
      reference: 'PAY-003', 
      amount: 29.99, 
      method: 'stripe', 
      status: 'pending' 
    }
  ];

  constructor(
    private dialogRef: MatDialogRef<ViewPaymentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: any }
  ) {}

  getTotalPaid(): number {
    return this.payments
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  getPendingCount(): number {
    return this.payments.filter(p => p.status === 'pending').length;
  }

  getMethodIcon(method: string): string {
    switch(method) {
      case 'stripe': return 'credit_card';
      case 'transfer': return 'account_balance';
      case 'cash': return 'payments';
      default: return 'payment';
    }
  }

  getMethodText(method: string): string {
    switch(method) {
      case 'stripe': return 'Cartão';
      case 'transfer': return 'Transferência';
      case 'cash': return 'Dinheiro';
      default: return method;
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'approved': return 'check_circle';
      case 'pending': return 'pending';
      case 'rejected': return 'cancel';
      default: return 'help';
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

  viewPaymentDetails(payment: any): void {
    // Implementar visualização de detalhes
  }

  approvePayment(payment: any): void {
    payment.status = 'approved';
    this.dialogRef.close({ action: 'approved', payment });
  }

  addPayment(): void {
    this.dialogRef.close({ action: 'add', client: this.data.client });
  }

  close(): void {
    this.dialogRef.close();
  }
}