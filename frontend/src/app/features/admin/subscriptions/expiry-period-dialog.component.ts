import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-expiry-period-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTableModule, MatCardModule],
  template: `
    <div class="dialog-header">
      <div class="header-content">
        <mat-icon class="title-icon" [ngClass]="getPeriodClass()">{{ getPeriodIcon() }}</mat-icon>
        <div class="title-section">
          <h2 mat-dialog-title>{{ getTitle() }}</h2>
          <p class="subtitle">{{ data.subscriptions.length }} subscrição(ões)</p>
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
                <mat-icon class="summary-icon">people</mat-icon>
                <div class="summary-content">
                  <span class="summary-value">{{ data.subscriptions.length }}</span>
                  <span class="summary-label">Clientes</span>
                </div>
              </div>
              <div class="summary-item">
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
          <table mat-table [dataSource]="data.subscriptions" class="details-table">
            <ng-container matColumnDef="client">
              <th mat-header-cell *matHeaderCellDef>Cliente</th>
              <td mat-cell *matCellDef="let sub">
                <span class="client-link" (click)="onClientClick(sub)">{{ sub.clientName }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="plan">
              <th mat-header-cell *matHeaderCellDef>Plano</th>
              <td mat-cell *matCellDef="let sub">
                <span class="plan-badge" [ngClass]="sub.plan">{{ getPlanText(sub.plan) }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="endDate">
              <th mat-header-cell *matHeaderCellDef>Data de Fim</th>
              <td mat-cell *matCellDef="let sub">{{ formatDate(sub.endDate) }}</td>
            </ng-container>

            <ng-container matColumnDef="daysLeft">
              <th mat-header-cell *matHeaderCellDef>Dias Restantes</th>
              <td mat-cell *matCellDef="let sub" class="days-cell">
                <span class="days-left" [ngClass]="getDaysLeftClass(sub)">{{ getDaysLeft(sub) }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="value">
              <th mat-header-cell *matHeaderCellDef>Valor</th>
              <td mat-cell *matCellDef="let sub" class="value-cell">{{ sub.value }}€</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let sub">
                <button mat-raised-button color="primary" (click)="onRenewClick(sub)">
                  <mat-icon>refresh</mat-icon>
                  Renovar
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="mobile-cards">
          <div class="subscription-card" *ngFor="let sub of data.subscriptions">
            <div class="subscription-header">
              <span class="subscription-client">{{ sub.clientName }}</span>
              <span class="subscription-value">{{ sub.value }}€</span>
            </div>
            <div class="subscription-details">
              <div class="subscription-detail">
                <mat-icon>calendar_view_month</mat-icon>
                <span class="plan-badge" [ngClass]="sub.plan">{{ getPlanText(sub.plan) }}</span>
              </div>
              <div class="subscription-detail">
                <mat-icon>event</mat-icon>
                <span>{{ formatDate(sub.endDate) }}</span>
              </div>
              <div class="subscription-detail">
                <mat-icon>schedule</mat-icon>
                <span class="days-left" [ngClass]="getDaysLeftClass(sub)">{{ getDaysLeft(sub) }} dias</span>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: -24px -24px 24px -24px;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dialog-header.critical {
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
    }

    .dialog-header.warning {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
    }

    .dialog-header.caution {
      background: linear-gradient(135deg, #ffc107 0%, #ffa000 100%);
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

    .title-icon.critical { color: #ffebee; }
    .title-icon.warning { color: #fff3e0; }
    .title-icon.caution { color: #fffde7; }

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
      max-width: 900px;
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
      border-left: 4px solid #667eea;
    }

    .summary-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #667eea;
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

    .plan-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .plan-badge.monthly { background: #e3f2fd; color: #1976d2; }
    .plan-badge.quarterly { background: #f3e5f5; color: #7b1fa2; }
    .plan-badge.biannual { background: #fff3e0; color: #ef6c00; }
    .plan-badge.annual { background: #e8f5e8; color: #2e7d32; }

    .days-cell {
      text-align: center;
    }

    .days-left {
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }

    .days-left.critical { background: #ffebee; color: #c62828; }
    .days-left.warning { background: #fff3e0; color: #ef6c00; }
    .days-left.caution { background: #fffde7; color: #f57f17; }
    .days-left.safe { background: #e8f5e8; color: #2e7d32; }
    .days-left.expired { background: #f3e5f5; color: #7b1fa2; }

    .value-cell {
      text-align: right;
      font-weight: 600;
      color: #667eea;
      font-size: 15px;
    }

    .client-link {
      color: #1976d2;
      cursor: pointer;
      text-decoration: none;
      font-weight: 500;
    }

    .client-link:hover {
      text-decoration: underline;
    }

    .subscription-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }

    .subscription-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e0e0e0;
    }

    .subscription-client {
      font-weight: 600;
      color: #333;
      font-size: 16px;
    }

    .subscription-value {
      font-size: 18px;
      font-weight: 700;
      color: #667eea;
    }

    .subscription-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .subscription-detail {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .subscription-detail mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #667eea;
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
export class ExpiryPeriodDialogComponent {
  displayedColumns: string[] = ['client', 'plan', 'endDate', 'daysLeft', 'value', 'actions'];

  constructor(
    public dialogRef: MatDialogRef<ExpiryPeriodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getTitle(): string {
    const period = this.data.period;
    if (period === 'expired') return 'Subscrições Expiradas';
    if (period === 1) return 'Expiram em Menos de 1 Dia';
    if (period === 3) return 'Expiram em Menos de 3 Dias';
    if (period === 7) return 'Expiram em Menos de 7 Dias';
    if (period === 15) return 'Expiram em Menos de 15 Dias';
    if (period === 30) return 'Expiram em Menos de 30 Dias';
    if (period === 60) return 'Expiram em Menos de 60 Dias';
    return 'Subscrições';
  }

  getPeriodIcon(): string {
    const period = this.data.period;
    if (period === 'expired') return 'error';
    if (period === 1 || period === 3) return 'warning';
    if (period === 7 || period === 15) return 'schedule';
    return 'event';
  }

  getPeriodClass(): string {
    const period = this.data.period;
    if (period === 'expired' || period === 1) return 'critical';
    if (period === 3 || period === 7) return 'warning';
    if (period === 15) return 'caution';
    return '';
  }

  getTotalValue(): number {
    return this.data.subscriptions.reduce((sum: number, sub: any) => sum + sub.value, 0);
  }

  getPlanText(plan: string): string {
    const plans: { [key: string]: string } = {
      'monthly': 'Mensal',
      'quarterly': '3 Meses',
      'biannual': '6 Meses',
      'annual': '12 Meses'
    };
    return plans[plan] || plan;
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

  getDaysLeftClass(subscription: any): string {
    const days = this.getDaysLeft(subscription);
    if (days < 0) return 'expired';
    if (days <= 3) return 'critical';
    if (days <= 15) return 'warning';
    if (days <= 30) return 'caution';
    return 'safe';
  }

  onClientClick(subscription: any): void {
    // Close dialog and return subscription data for navigation
    this.dialogRef.close({ action: 'view_client', subscription });
  }

  onRenewClick(subscription: any): void {
    // Close dialog and return subscription data for renewal
    this.dialogRef.close({ action: 'renew', subscription });
  }
}
