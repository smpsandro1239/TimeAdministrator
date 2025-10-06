import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RenewSubscriptionDialogComponent } from './renew-subscription-dialog.component';

interface SubscriptionData {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  plan: string;
  duration: number;
  durationUnit: 'days' | 'months' | 'years';
  price: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  paymentMethod: string;
  autoRenew: boolean;
  notes?: string;
  payments: PaymentData[];
}

interface PaymentData {
  id: string;
  date: Date;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
}

@Component({
  selector: 'app-subscription-details-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatCardModule, MatChipsModule, MatDividerModule, MatProgressBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-info">
          <h2>{{ data.clientName }}</h2>
          <p>{{ data.clientEmail }}</p>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="close()" matTooltip="Fechar">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <mat-divider></mat-divider>

      <div class="dialog-content">
        <!-- Subscription Overview -->
        <mat-card class="overview-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>info</mat-icon>
              Detalhes da Subscrição
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="overview-grid">
              <div class="overview-item">
                <label>Plano:</label>
                <span class="plan-chip" [ngClass]="getPlanClass(data.plan)">
                  {{ data.plan }}
                </span>
              </div>

              <div class="overview-item">
                <label>Estado:</label>
                <mat-chip [color]="getStatusColor(data.status)" selected>
                  {{ getStatusText(data.status) }}
                </mat-chip>
              </div>

              <div class="overview-item">
                <label>Duração:</label>
                <span>{{ data.duration }} {{ getDurationUnitText(data.durationUnit) }}</span>
              </div>

              <div class="overview-item">
                <label>Valor:</label>
                <span class="price">{{ data.price }}€</span>
              </div>

              <div class="overview-item">
                <label>Data de Início:</label>
                <span>{{ data.startDate | date:'dd/MM/yyyy' }}</span>
              </div>

              <div class="overview-item">
                <label>Data de Fim:</label>
                <span [ngClass]="getExpiryClass(data.endDate)">
                  {{ data.endDate | date:'dd/MM/yyyy' }}
                </span>
              </div>

              <div class="overview-item">
                <label>Método de Pagamento:</label>
                <span>{{ getPaymentMethodText(data.paymentMethod) }}</span>
              </div>

              <div class="overview-item">
                <label>Renovação Automática:</label>
                <mat-icon [ngClass]="data.autoRenew ? 'auto-renew-on' : 'auto-renew-off'">
                  {{ data.autoRenew ? 'autorenew' : 'cancel' }}
                </mat-icon>
              </div>
            </div>

            <!-- Progress Bar for Subscription -->
            <div class="progress-section" *ngIf="data.status === 'active'">
              <label>Tempo Restante:</label>
              <mat-progress-bar
                mode="determinate"
                [value]="getProgressValue()"
                [ngClass]="getProgressClass()">
              </mat-progress-bar>
              <span class="progress-text">{{ getDaysRemaining() }} dias restantes</span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Payment History -->
        <mat-card class="payments-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>payment</mat-icon>
              Histórico de Pagamentos
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="payments-list" *ngIf="data.payments.length > 0; else noPayments">
              <div class="payment-item" *ngFor="let payment of data.payments">
                <div class="payment-info">
                  <div class="payment-date">{{ payment.date | date:'dd/MM/yyyy' }}</div>
                  <div class="payment-method">{{ getPaymentMethodText(payment.method) }}</div>
                </div>
                <div class="payment-amount">
                  <span class="amount">{{ payment.amount }}€</span>
                  <mat-chip [color]="getPaymentStatusColor(payment.status)" selected>
                    {{ getPaymentStatusText(payment.status) }}
                  </mat-chip>
                </div>
              </div>
            </div>
            <ng-template #noPayments>
              <div class="no-payments">
                <mat-icon>payment</mat-icon>
                <p>Nenhum pagamento registado</p>
              </div>
            </ng-template>
          </mat-card-content>
        </mat-card>

        <!-- Notes -->
        <mat-card class="notes-card" *ngIf="data.notes">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>notes</mat-icon>
              Notas
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ data.notes }}</p>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-divider></mat-divider>

      <div class="dialog-actions">
        <button mat-button (click)="close()">
          <mat-icon>close</mat-icon>
          Fechar
        </button>

        <div class="action-buttons">
          <button mat-raised-button color="accent" (click)="editSubscription()">
            <mat-icon>edit</mat-icon>
            Editar
          </button>

          <button mat-raised-button color="primary" (click)="renewSubscription()"
                  [disabled]="data.status !== 'active' && data.status !== 'expired'">
            <mat-icon>autorenew</mat-icon>
            Renovar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      max-width: 800px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .header-info h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
    }

    .header-info p {
      margin: 0;
      opacity: 0.9;
      font-size: 16px;
    }

    .header-actions {
      margin-top: -8px;
      margin-right: -8px;
    }

    .header-actions button {
      color: white;
    }

    .dialog-content {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }

    .overview-card, .payments-card, .notes-card {
      margin-bottom: 24px;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .overview-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .overview-item label {
      font-weight: 600;
      color: #666;
      font-size: 14px;
    }

    .plan-chip {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .plan-chip.monthly { background: #e3f2fd; color: #1976d2; }
    .plan-chip.quarterly { background: #f3e5f5; color: #7b1fa2; }
    .plan-chip.semiannual { background: #e8f5e8; color: #388e3c; }
    .plan-chip.annual { background: #fff3e0; color: #f57c00; }

    .price {
      font-size: 18px;
      font-weight: 600;
      color: #2e7d32;
    }

    .progress-section {
      margin-top: 24px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .progress-section label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #666;
    }

    .progress-text {
      display: block;
      margin-top: 8px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }

    .mat-progress-bar {
      height: 8px;
      border-radius: 4px;
    }

    .progress-normal .mat-progress-bar-fill::after {
      background-color: #4caf50;
    }

    .progress-warning .mat-progress-bar-fill::after {
      background-color: #ff9800;
    }

    .progress-critical .mat-progress-bar-fill::after {
      background-color: #f44336;
    }

    .payments-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .payment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .payment-item:last-child {
      border-bottom: none;
    }

    .payment-info {
      flex: 1;
    }

    .payment-date {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .payment-method {
      font-size: 14px;
      color: #666;
    }

    .payment-amount {
      text-align: right;
    }

    .amount {
      display: block;
      font-size: 18px;
      font-weight: 600;
      color: #2e7d32;
      margin-bottom: 8px;
    }

    .no-payments {
      text-align: center;
      padding: 48px;
      color: #666;
    }

    .no-payments mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: #f8f9fa;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
    }

    .auto-renew-on {
      color: #4caf50;
    }

    .auto-renew-off {
      color: #f44336;
    }

    .expiry-warning {
      color: #ff9800;
      font-weight: 600;
    }

    .expiry-critical {
      color: #f44336;
      font-weight: 600;
    }

    .expiry-normal {
      color: #4caf50;
    }

    @media (max-width: 600px) {
      .dialog-container {
        margin: 8px;
        max-height: calc(100vh - 16px);
      }

      .dialog-header {
        padding: 16px;
      }

      .dialog-content {
        padding: 16px;
      }

      .overview-grid {
        grid-template-columns: 1fr;
      }

      .dialog-actions {
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }

      .action-buttons {
        width: 100%;
      }

      .action-buttons button {
        flex: 1;
      }
    }
  `]
})
export class SubscriptionDetailsDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<SubscriptionDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubscriptionData,
    private dialog: MatDialog
  ) {}

  close() {
    this.dialogRef.close();
  }

  editSubscription() {
    // TODO: Implement edit subscription functionality
    console.log('Edit subscription:', this.data.id);
  }

  renewSubscription() {
    const dialogRef = this.dialog.open(RenewSubscriptionDialogComponent, {
      width: '600px',
      data: {
        subscriptionId: this.data.id,
        clientName: this.data.clientName,
        currentPlan: this.data.plan,
        currentPrice: this.data.price,
        endDate: this.data.endDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Subscription renewed:', result);
        this.close();
      }
    });
  }

  getPlanClass(plan: string): string {
    const planMap: { [key: string]: string } = {
      '1 Mês': 'monthly',
      '3 Meses': 'quarterly',
      '6 Meses': 'semiannual',
      '1 Ano': 'annual'
    };
    return planMap[plan] || 'monthly';
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    const colorMap: { [key: string]: 'primary' | 'accent' | 'warn' } = {
      'active': 'primary',
      'expired': 'warn',
      'cancelled': 'warn',
      'pending': 'accent'
    };
    return colorMap[status] || 'primary';
  }

  getStatusText(status: string): string {
    const textMap: { [key: string]: string } = {
      'active': 'Ativa',
      'expired': 'Expirada',
      'cancelled': 'Cancelada',
      'pending': 'Pendente'
    };
    return textMap[status] || status;
  }

  getDurationUnitText(unit: string): string {
    const textMap: { [key: string]: string } = {
      'days': 'dias',
      'months': 'meses',
      'years': 'anos'
    };
    return textMap[unit] || unit;
  }

  getPaymentMethodText(method: string): string {
    const textMap: { [key: string]: string } = {
      'stripe': 'Stripe',
      'paypal': 'PayPal',
      'mbway': 'MBWay',
      'manual': 'Manual',
      'bank_transfer': 'Transferência Bancária'
    };
    return textMap[method] || method;
  }

  getPaymentStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    const colorMap: { [key: string]: 'primary' | 'accent' | 'warn' } = {
      'completed': 'primary',
      'pending': 'accent',
      'failed': 'warn'
    };
    return colorMap[status] || 'primary';
  }

  getPaymentStatusText(status: string): string {
    const textMap: { [key: string]: string } = {
      'completed': 'Completo',
      'pending': 'Pendente',
      'failed': 'Falhado'
    };
    return textMap[status] || status;
  }

  getExpiryClass(endDate: Date): string {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expiry-critical';
    if (diffDays <= 7) return 'expiry-critical';
    if (diffDays <= 30) return 'expiry-warning';
    return 'expiry-normal';
  }

  getProgressValue(): number {
    const now = new Date();
    const start = this.data.startDate.getTime();
    const end = this.data.endDate.getTime();
    const current = now.getTime();

    const total = end - start;
    const elapsed = current - start;
    const progress = (elapsed / total) * 100;

    return Math.max(0, Math.min(100, progress));
  }

  getProgressClass(): string {
    const days = this.getDaysRemaining();
    if (days <= 7) return 'progress-critical';
    if (days <= 30) return 'progress-warning';
    return 'progress-normal';
  }

  getDaysRemaining(): number {
    const now = new Date();
    const diffTime = this.data.endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
