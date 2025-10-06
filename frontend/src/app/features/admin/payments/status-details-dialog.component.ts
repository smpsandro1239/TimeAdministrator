import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-status-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTableModule, MatCardModule],
  template: `
    <div class="dialog-header">
      <div class="header-content">
        <mat-icon class="title-icon">{{ getHeaderIcon() }}</mat-icon>
        <div class="title-section">
          <h2 mat-dialog-title>{{ getTitle() }}</h2>
          <p class="subtitle">{{ data.payments.length }} pagamento(s)</p>
        </div>
      </div>
      <button mat-icon-button mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <div class="content-container">
        <!-- Summary Card -->
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-grid">
              <div class="summary-item">
                <mat-icon class="summary-icon">receipt</mat-icon>
                <div class="summary-content">
                  <span class="summary-value">{{ data.payments.length }}</span>
                  <span class="summary-label">Total de Pagamentos</span>
                </div>
              </div>
              <div class="summary-item" *ngIf="data.status !== 'total'">
                <mat-icon class="summary-icon">euro</mat-icon>
                <div class="summary-content">
                  <span class="summary-value">{{ getTotalValue() }}€</span>
                  <span class="summary-label">Valor Total</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Desktop Table -->
        <div class="desktop-table">
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
        </div>

        <!-- Mobile Cards -->
        <div class="mobile-cards">
          <div class="payment-card" *ngFor="let payment of data.payments">
            <div class="payment-header">
              <span class="payment-client">{{ payment.clientName }}</span>
              <span class="payment-amount">{{ payment.amount }}€</span>
            </div>
            <div class="payment-details">
              <div class="payment-detail">
                <mat-icon>tag</mat-icon>
                <span>{{ payment.reference }}</span>
              </div>
              <div class="payment-detail">
                <mat-icon>event</mat-icon>
                <span>{{ formatDate(payment.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions class="dialog-actions">
      <button mat-raised-button color="primary" mat-dialog-close>
        <mat-icon>check</mat-icon>
        Fechar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
      color: white;
      margin: -24px -24px 24px -24px;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .title-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .title-section h2 {
      margin: 0;
      font-size: 24px;
    }

    .subtitle {
      margin: 4px 0 0 0;
      opacity: 0.9;
      font-size: 14px;
    }

    .close-button {
      color: white;
    }

    .content-container {
      max-width: 800px;
      min-width: 600px;
    }

    .summary-card {
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 12px;
      border-left: 4px solid #9C27B0;
    }

    .summary-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #9C27B0;
    }

    .summary-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .summary-value {
      font-size: 28px;
      font-weight: 700;
      color: #333;
      line-height: 1;
    }

    .summary-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      font-weight: 500;
    }

    .mobile-cards {
      display: none;
    }

    .desktop-table {
      display: block;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }

    .details-table {
      width: 100%;
    }

    .details-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
    }

    .amount-cell {
      text-align: right;
      font-weight: 600;
      color: #9C27B0;
      font-size: 16px;
    }

    .payment-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }

    .payment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e0e0e0;
    }

    .payment-client {
      font-weight: 600;
      color: #333;
      font-size: 16px;
    }

    .payment-amount {
      font-size: 18px;
      font-weight: 700;
      color: #9C27B0;
    }

    .payment-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .payment-detail {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .payment-detail mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #9C27B0;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      margin: 24px -24px -24px -24px;
    }

    @media (max-width: 768px) {
      .content-container {
        min-width: 0;
        max-width: 100%;
      }

      .summary-grid {
        grid-template-columns: 1fr;
      }

      .desktop-table {
        display: none;
      }

      .mobile-cards {
        display: block;
      }

      .dialog-header {
        margin: -24px -16px 16px -16px;
        padding: 16px;
      }

      .header-content {
        gap: 12px;
      }

      .title-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .title-section h2 {
        font-size: 20px;
      }

      .dialog-actions {
        margin: 16px -16px -24px -16px;
      }

      .dialog-actions button {
        width: 100%;
      }
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
      case 'total': return 'Todos os Pagamentos';
      default: return 'Detalhes dos Pagamentos';
    }
  }

  getHeaderIcon(): string {
    switch(this.data.status) {
      case 'pending': return 'pending';
      case 'approved': return 'check_circle';
      case 'rejected': return 'cancel';
      case 'total': return 'receipt_long';
      default: return 'payment';
    }
  }

  getTotalValue(): number {
    return this.data.payments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-PT');
  }
}
