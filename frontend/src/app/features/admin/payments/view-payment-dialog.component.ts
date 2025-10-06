import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-payment-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule, MatCardModule],
  template: `
    <div class="dialog-header">
      <div class="header-content">
        <mat-icon class="title-icon">receipt</mat-icon>
        <div class="title-section">
          <h2 mat-dialog-title>Detalhes do Pagamento</h2>
          <p class="subtitle">{{ data.reference }}</p>
        </div>
      </div>
      <button mat-icon-button mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <div class="payment-container">
        <!-- Status Card -->
        <div class="status-card" [ngClass]="data.status">
          <mat-icon class="status-icon">{{ getStatusIcon(data.status) }}</mat-icon>
          <div class="status-info">
            <span class="status-label">Estado do Pagamento</span>
            <span class="status-text">{{ getStatusText(data.status) }}</span>
          </div>
        </div>

        <!-- Cliente Info -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>person</mat-icon>
              Informações do Cliente
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <mat-icon class="info-icon">person</mat-icon>
                <div class="info-content">
                  <span class="label">Nome</span>
                  <span class="value">{{ data.clientName }}</span>
                </div>
              </div>
              <div class="info-item">
                <mat-icon class="info-icon">email</mat-icon>
                <div class="info-content">
                  <span class="label">Email</span>
                  <span class="value">{{ getClientEmail() }}</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Payment Details -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>payment</mat-icon>
              Detalhes do Pagamento
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <mat-icon class="info-icon">tag</mat-icon>
                <div class="info-content">
                  <span class="label">Referência</span>
                  <span class="value">{{ data.reference }}</span>
                </div>
              </div>
              <div class="info-item">
                <mat-icon class="info-icon">euro</mat-icon>
                <div class="info-content">
                  <span class="label">Valor</span>
                  <span class="value price">{{ data.amount }}€</span>
                </div>
              </div>
              <div class="info-item">
                <mat-icon class="info-icon">credit_card</mat-icon>
                <div class="info-content">
                  <span class="label">Método</span>
                  <span class="value">{{ getMethodText(data.method) }}</span>
                </div>
              </div>
              <div class="info-item">
                <mat-icon class="info-icon">event</mat-icon>
                <div class="info-content">
                  <span class="label">Data</span>
                  <span class="value">{{ formatDate(data.date) }}</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Notes -->
        <mat-card class="info-card" *ngIf="data.notes">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>notes</mat-icon>
              Observações
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p class="notes-text">{{ data.notes }}</p>
          </mat-card-content>
        </mat-card>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions class="dialog-actions">
      <button mat-stroked-button mat-dialog-close>Fechar</button>
      <div class="action-buttons" *ngIf="data.status === 'pending'">
        <button mat-raised-button color="warn" (click)="reject()">
          <mat-icon>close</mat-icon>
          Rejeitar
        </button>
        <button mat-raised-button color="primary" (click)="approve()">
          <mat-icon>check</mat-icon>
          Aprovar
        </button>
      </div>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
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

    .payment-container {
      max-width: 600px;
      min-width: 500px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .status-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid;
    }

    .status-card.pending {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      border-color: #ff9800;
    }

    .status-card.approved {
      background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
      border-color: #4caf50;
    }

    .status-card.rejected {
      background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
      border-color: #f44336;
    }

    .status-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    .status-card.pending .status-icon {
      color: #ef6c00;
    }

    .status-card.approved .status-icon {
      color: #2e7d32;
    }

    .status-card.rejected .status-icon {
      color: #c62828;
    }

    .status-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .status-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      font-weight: 500;
    }

    .status-text {
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .info-card {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }

    .info-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #2196F3;
      font-size: 16px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .info-icon {
      color: #2196F3;
      font-size: 24px;
      flex-shrink: 0;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      font-weight: 500;
    }

    .value {
      font-weight: 600;
      color: #333;
      word-break: break-word;
    }

    .price {
      color: #2196F3;
      font-size: 18px;
    }

    .notes-text {
      margin: 0;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      line-height: 1.6;
      color: #333;
    }

    .dialog-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      margin: 24px -24px -24px -24px;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
    }

    @media (max-width: 768px) {
      .payment-container {
        min-width: 0;
        max-width: 100%;
      }

      .info-grid {
        grid-template-columns: 1fr;
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
        flex-direction: column;
        gap: 12px;
        margin: 16px -16px -24px -16px;
      }

      .dialog-actions > button,
      .action-buttons {
        width: 100%;
      }

      .action-buttons button {
        flex: 1;
      }

      .info-item {
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
      }
    }
  `]
})
export class ViewPaymentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getClientEmail(): string {
    return `${this.data.clientName.toLowerCase().replace(' ', '.')}@email.com`;
  }

  getMethodText(method: string): string {
    const methods: { [key: string]: string } = {
      'stripe': 'Cartão (Stripe)',
      'transfer': 'Transferência Bancária',
      'cash': 'Dinheiro'
    };
    return methods[method] || method;
  }

  getStatusText(status: string): string {
    const statuses: { [key: string]: string } = {
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'rejected': 'Rejeitado'
    };
    return statuses[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'pending': 'pending',
      'approved': 'check_circle',
      'rejected': 'cancel'
    };
    return icons[status] || 'help';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-PT');
  }

  approve(): void {
    this.dialogRef.close({ action: 'approve', payment: this.data });
  }

  reject(): void {
    this.dialogRef.close({ action: 'reject', payment: this.data });
  }
}
