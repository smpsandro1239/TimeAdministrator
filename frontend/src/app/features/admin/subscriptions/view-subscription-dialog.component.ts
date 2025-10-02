import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-view-subscription-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="dialog-header">
      <div class="header-content">
        <mat-icon class="title-icon">subscriptions</mat-icon>
        <div class="title-section">
          <h2 mat-dialog-title>{{ data.clientName }}</h2>
          <p class="subtitle">Detalhes da Subscrição</p>
        </div>
      </div>
      <button mat-icon-button mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content>
      <div class="subscription-info">
        <!-- Status Card -->
        <div class="status-card">
          <div class="status-header">
            <mat-icon class="status-icon" [ngClass]="data.status">{{ getStatusIcon(data.status) }}</mat-icon>
            <div class="status-info">
              <div class="status-text">{{ getStatusText(data.status) }}</div>
              <div class="days-info">
                <span class="days-left" [ngClass]="getDaysLeftClass(data)">{{ getDaysLeftText(data) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="info-grid">
          <!-- Cliente -->
          <div class="info-card">
            <div class="card-header">
              <mat-icon>person</mat-icon>
              <h3>Cliente</h3>
            </div>
            <div class="card-content">
              <div class="info-item">
                <span class="label">Nome</span>
                <span class="value">{{ data.clientName }}</span>
              </div>
              <div class="info-item">
                <span class="label">Email</span>
                <span class="value">{{ data.clientEmail }}</span>
              </div>
              <div class="info-item" *ngIf="data.clientPhone">
                <span class="label">Telefone</span>
                <span class="value">{{ data.clientPhone }}</span>
              </div>
            </div>
          </div>

          <!-- Subscrição -->
          <div class="info-card">
            <div class="card-header">
              <mat-icon>card_membership</mat-icon>
              <h3>Subscrição</h3>
            </div>
            <div class="card-content">
              <div class="info-item">
                <span class="label">Plano</span>
                <span class="value plan-badge" [ngClass]="data.plan">{{ getPlanText(data.plan) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Valor</span>
                <span class="value price">{{ data.price }}€</span>
              </div>
              <div class="info-item">
                <span class="label">Período</span>
                <span class="value">{{ formatDate(data.startDate) }} - {{ formatDate(data.endDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Pagamento -->
          <div class="info-card">
            <div class="card-header">
              <mat-icon>payment</mat-icon>
              <h3>Pagamento</h3>
            </div>
            <div class="card-content">
              <div class="info-item">
                <span class="label">Estado</span>
                <mat-chip class="payment-chip" [ngClass]="data.paymentStatus">{{ getPaymentStatusText(data.paymentStatus) }}</mat-chip>
              </div>
              <div class="info-item" *ngIf="data.paymentMethod">
                <span class="label">Método</span>
                <span class="value">{{ getPaymentMethodText(data.paymentMethod) }}</span>
              </div>
              <div class="info-item" *ngIf="data.paymentDate">
                <span class="label">Data</span>
                <span class="value">{{ formatDate(data.paymentDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions class="dialog-actions">
      <button mat-stroked-button (click)="editSubscription()">
        <mat-icon>edit</mat-icon>
        Editar
      </button>
      <button mat-stroked-button color="primary" (click)="renewSubscription()" *ngIf="data.status === 'expired' || data.status === 'inactive'">
        <mat-icon>refresh</mat-icon>
        Renovar
      </button>
      <button mat-stroked-button color="warn" (click)="cancelSubscription()" *ngIf="data.status === 'active'">
        <mat-icon>cancel</mat-icon>
        Cancelar
      </button>
      <button mat-raised-button mat-dialog-close>Fechar</button>
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
    
    .subscription-info {
      max-width: 700px;
      min-width: 500px;
    }
    
    .status-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      border-left: 4px solid #2196F3;
    }
    
    .status-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .status-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }
    
    .status-icon.active { color: #4caf50; }
    .status-icon.inactive { color: #ff9800; }
    .status-icon.expired { color: #f44336; }
    .status-icon.cancelled { color: #9e9e9e; }
    
    .status-text {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }
    
    .info-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .card-header mat-icon {
      color: #2196F3;
      font-size: 24px;
    }
    
    .card-header h3 {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 8px 0;
    }
    
    .info-item:last-child {
      margin-bottom: 0;
    }
    
    .label {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }
    
    .value {
      color: #333;
      font-weight: 600;
      text-align: right;
    }
    
    .price {
      color: #2196F3;
      font-size: 18px;
    }
    
    .plan-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .plan-badge.monthly { background: #e3f2fd; color: #1976d2; }
    .plan-badge.quarterly { background: #f3e5f5; color: #7b1fa2; }
    .plan-badge.biannual { background: #fff3e0; color: #ef6c00; }
    .plan-badge.annual { background: #e8f5e8; color: #2e7d32; }
    
    .payment-chip {
      font-size: 12px !important;
      height: 24px !important;
    }
    
    .payment-chip.paid { background: #e8f5e8; color: #2e7d32; }
    .payment-chip.pending { background: #fff3e0; color: #ef6c00; }
    .payment-chip.failed { background: #ffebee; color: #c62828; }
    
    .days-left {
      padding: 6px 12px;
      border-radius: 16px;
      font-weight: 600;
      font-size: 14px;
    }
    
    .days-left.critical { background: #ffebee; color: #c62828; }
    .days-left.warning { background: #fff3e0; color: #ef6c00; }
    .days-left.caution { background: #fffde7; color: #f57f17; }
    .days-left.safe { background: #e8f5e8; color: #2e7d32; }
    .days-left.expired { background: #f3e5f5; color: #7b1fa2; }
    
    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      margin: 24px -24px -24px -24px;
    }
    
    @media (max-width: 768px) {
      .subscription-info {
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
        margin: 16px -16px -24px -16px;
      }
      
      .dialog-actions button {
        width: 100%;
      }
      
      .info-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
      
      .value {
        text-align: left;
      }
    }
  `]
})
export class ViewSubscriptionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getPlanText(plan: string): string {
    const plans: { [key: string]: string } = {
      'monthly': 'Mensal',
      'quarterly': 'Trimestral',
      'biannual': 'Semestral',
      'annual': 'Anual'
    };
    return plans[plan] || plan;
  }

  getStatusText(status: string): string {
    const statuses: { [key: string]: string } = {
      'active': 'Ativa',
      'expired': 'Expirada',
      'cancelled': 'Cancelada'
    };
    return statuses[status] || status;
  }

  getPaymentStatusText(status: string): string {
    const statuses: { [key: string]: string } = {
      'paid': 'Pago',
      'pending': 'Pendente',
      'failed': 'Falhado'
    };
    return statuses[status] || status;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-PT');
  }

  getDaysLeft(subscription: any): number {
    const today = new Date();
    const endDate = new Date(subscription.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysLeftText(subscription: any): string {
    const days = this.getDaysLeft(subscription);
    if (days < 0) return `${Math.abs(days)} dias em atraso`;
    if (days === 0) return 'Expira hoje';
    if (days === 1) return '1 dia';
    return `${days} dias`;
  }

  getDaysLeftClass(subscription: any): string {
    const days = this.getDaysLeft(subscription);
    if (days < 0) return 'expired';
    if (days <= 3) return 'critical';
    if (days <= 15) return 'warning';
    if (days <= 30) return 'caution';
    return 'safe';
  }

  editSubscription(): void {
    this.dialogRef.close({ action: 'edit', subscription: this.data });
  }

  renewSubscription(): void {
    this.dialogRef.close({ action: 'renew', subscription: this.data });
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'active': return 'check_circle';
      case 'inactive': return 'pause_circle';
      case 'expired': return 'error';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  }

  getPaymentMethodText(method: string): string {
    switch(method) {
      case 'stripe': return 'Cartão de Crédito';
      case 'transfer': return 'Transferência Bancária';
      case 'mbway': return 'MBWay';
      case 'cash': return 'Dinheiro';
      default: return method || 'N/A';
    }
  }

  cancelSubscription(): void {
    this.dialogRef.close({ action: 'cancel', subscription: this.data });
  }
}