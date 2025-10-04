import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-view-payment-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Detalhes do Pagamento</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content>
      <div class="info-card">
        <div class="card-header">
          <mat-icon>person</mat-icon>
          <h3>Cliente</h3>
        </div>
        <div class="info-row">
          <span class="label">Nome:</span>
          <span class="value">{{ data.clientName }}</span>
        </div>
        <div class="info-row">
          <span class="label">Email:</span>
          <span class="value">{{ getClientEmail() }}</span>
        </div>
      </div>
      
      <div class="info-card">
        <div class="card-header">
          <mat-icon>payment</mat-icon>
          <h3>Pagamento</h3>
        </div>
        <div class="info-row">
          <span class="label">Referência:</span>
          <span class="value">{{ data.reference }}</span>
        </div>
        <div class="info-row">
          <span class="label">Valor:</span>
          <span class="value amount">{{ data.amount }}€</span>
        </div>
        <div class="info-row">
          <span class="label">Método:</span>
          <span class="value">{{ getMethodText(data.method) }}</span>
        </div>
        <div class="info-row">
          <span class="label">Data:</span>
          <span class="value">{{ formatDate(data.date) }}</span>
        </div>
        <div class="info-row">
          <span class="label">Estado:</span>
          <mat-chip [ngClass]="data.status">{{ getStatusText(data.status) }}</mat-chip>
        </div>
      </div>
      
      <div class="info-card" *ngIf="data.notes">
        <div class="card-header">
          <mat-icon>notes</mat-icon>
          <h3>Observações</h3>
        </div>
        <p class="notes">{{ data.notes }}</p>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions>
      <button mat-raised-button *ngIf="data.status === 'pending'" (click)="approve()" color="primary">
        <mat-icon>check</mat-icon>
        Aprovar
      </button>
      <button mat-raised-button *ngIf="data.status === 'pending'" (click)="reject()" color="warn">
        <mat-icon>close</mat-icon>
        Rejeitar
      </button>
      <button mat-button mat-dialog-close>Fechar</button>
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
    mat-dialog-content {
      max-height: 60vh;
      overflow-y: auto;
      padding: 20px 24px;
    }
    .info-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #2196F3;
    }
    .card-header mat-icon {
      color: #2196F3;
    }
    .card-header h3 {
      margin: 0;
      color: #2196F3;
      font-size: 16px;
      font-weight: 600;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .info-row:last-child { border-bottom: none; }
    .label {
      font-weight: 500;
      color: #666;
    }
    .value {
      font-weight: 500;
      color: #333;
      text-align: right;
    }
    .value.amount {
      color: #2196F3;
      font-weight: 600;
      font-size: 18px;
    }
    .notes {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }
    mat-chip.pending { background: #fff3e0; color: #ef6c00; }
    mat-chip.approved { background: #e8f5e8; color: #2e7d32; }
    mat-chip.rejected { background: #ffebee; color: #c62828; }
    mat-dialog-actions {
      padding: 16px 24px;
      gap: 8px;
    }
    
    @media (max-width: 768px) {
      mat-dialog-actions {
        flex-direction: column;
      }
      mat-dialog-actions button {
        width: 100%;
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