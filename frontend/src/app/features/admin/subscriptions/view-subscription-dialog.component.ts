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
      <h2 mat-dialog-title>Detalhes da Subscrição</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content>
      <div class="subscription-info">
        <div class="info-section">
          <h3>Cliente</h3>
          <p><strong>Nome:</strong> {{ data.clientName }}</p>
          <p><strong>Email:</strong> {{ data.clientEmail }}</p>
          <p><strong>Telefone:</strong> {{ data.clientPhone || 'N/A' }}</p>
        </div>
        
        <mat-divider></mat-divider>
        
        <div class="info-section">
          <h3>Subscrição</h3>
          <p><strong>Plano:</strong> {{ getPlanText(data.plan) }}</p>
          <p><strong>Valor:</strong> {{ data.price }}€</p>
          <p><strong>Estado:</strong> 
            <mat-chip [ngClass]="data.status">{{ getStatusText(data.status) }}</mat-chip>
          </p>
        </div>
        
        <mat-divider></mat-divider>
        
        <div class="info-section">
          <h3>Datas</h3>
          <p><strong>Início:</strong> {{ formatDate(data.startDate) }}</p>
          <p><strong>Fim:</strong> {{ formatDate(data.endDate) }}</p>
          <p><strong>Dias restantes:</strong> 
            <span class="days-left" [ngClass]="getDaysLeftClass(data)">{{ getDaysLeftText(data) }}</span>
          </p>
        </div>
        
        <mat-divider></mat-divider>
        
        <div class="info-section">
          <h3>Pagamento</h3>
          <p><strong>Estado:</strong> 
            <mat-chip [ngClass]="data.paymentStatus">{{ getPaymentStatusText(data.paymentStatus) }}</mat-chip>
          </p>
          <p><strong>Método:</strong> {{ data.paymentMethod || 'N/A' }}</p>
          <p><strong>Data do pagamento:</strong> {{ data.paymentDate ? formatDate(data.paymentDate) : 'N/A' }}</p>
        </div>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions>
      <button mat-button (click)="editSubscription()">
        <mat-icon>edit</mat-icon>
        Editar
      </button>
      <button mat-button (click)="renewSubscription()" *ngIf="data.status === 'expired'">
        <mat-icon>refresh</mat-icon>
        Renovar
      </button>
      <button mat-button (click)="cancelSubscription()" *ngIf="data.status === 'active'" color="warn">
        <mat-icon>cancel</mat-icon>
        Cancelar
      </button>
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .subscription-info { max-height: 500px; overflow-y: auto; }
    .info-section { margin: 16px 0; }
    .info-section h3 { margin: 0 0 12px 0; color: #333; font-size: 16px; }
    .info-section p { margin: 8px 0; }
    mat-chip.active { background: #e8f5e8; color: #2e7d32; }
    mat-chip.expired { background: #f3e5f5; color: #7b1fa2; }
    mat-chip.cancelled { background: #ffebee; color: #c62828; }
    mat-chip.paid { background: #e8f5e8; color: #2e7d32; }
    mat-chip.pending { background: #fff3e0; color: #ef6c00; }
    mat-chip.failed { background: #ffebee; color: #c62828; }
    .days-left { padding: 4px 8px; border-radius: 8px; font-weight: 600; }
    .days-left.critical { background: #ffebee; color: #c62828; }
    .days-left.warning { background: #fff3e0; color: #ef6c00; }
    .days-left.caution { background: #fffde7; color: #f57f17; }
    .days-left.safe { background: #e8f5e8; color: #2e7d32; }
    .days-left.expired { background: #f3e5f5; color: #7b1fa2; }
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

  cancelSubscription(): void {
    this.dialogRef.close({ action: 'cancel', subscription: this.data });
  }
}