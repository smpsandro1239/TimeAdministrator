import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-view-client-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, MatChipsModule],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>
        <div class="title-content">
          <mat-icon class="title-icon">person</mat-icon>
          <div>
            <div class="title-text">{{ data.client.name }}</div>
            <div class="subtitle-text">Detalhes do Cliente</div>
          </div>
        </div>
        <span class="status-chip" [ngClass]="data.client.status">{{ getStatusText(data.client.status) }}</span>
      </h2>
    </div>
    
    <mat-dialog-content>
      <div class="client-details">
        <!-- Informações Pessoais -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>contact_mail</mat-icon>
              Informações Pessoais
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <mat-icon class="info-icon">person</mat-icon>
                <div class="info-content">
                  <div class="info-label">Nome Completo</div>
                  <div class="info-value">{{ data.client.name }}</div>
                </div>
              </div>
              
              <div class="info-item">
                <mat-icon class="info-icon">email</mat-icon>
                <div class="info-content">
                  <div class="info-label">Email</div>
                  <div class="info-value">{{ data.client.email }}</div>
                </div>
              </div>
              
              <div class="info-item">
                <mat-icon class="info-icon">phone</mat-icon>
                <div class="info-content">
                  <div class="info-label">Telefone</div>
                  <div class="info-value">{{ data.client.phone || 'Não informado' }}</div>
                </div>
              </div>
              
              <div class="info-item">
                <mat-icon class="info-icon">tag</mat-icon>
                <div class="info-content">
                  <div class="info-label">ID do Cliente</div>
                  <div class="info-value">#{{ data.client.id }}</div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <!-- Preferências de Notificação -->
        <mat-card class="info-card" *ngIf="data.client.notificationPreferences">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>notifications</mat-icon>
              Preferências de Notificação
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-chip-set>
              <mat-chip [class.enabled]="data.client.notificationPreferences.email">
                <mat-icon>email</mat-icon>
                Email
              </mat-chip>
              <mat-chip [class.enabled]="data.client.notificationPreferences.whatsapp">
                <mat-icon>chat</mat-icon>
                WhatsApp
              </mat-chip>
              <mat-chip [class.enabled]="data.client.notificationPreferences.telegram">
                <mat-icon>send</mat-icon>
                Telegram
              </mat-chip>
            </mat-chip-set>
          </mat-card-content>
        </mat-card>
        
        <!-- Subscrição -->
        <mat-card class="info-card" *ngIf="data.client.subscriptionEnd">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>schedule</mat-icon>
              Subscrição
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="subscription-info">
              <div class="subscription-item">
                <span class="label">Expira em:</span>
                <span class="value" [ngClass]="getDaysLeftClass()">{{ getDaysLeftText() }}</span>
              </div>
              <div class="subscription-item">
                <span class="label">Data de Expiração:</span>
                <span class="value">{{ data.client.subscriptionEnd | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </mat-dialog-content>
    
    <mat-divider></mat-divider>
    
    <mat-dialog-actions class="dialog-actions">
      <div class="action-buttons">
        <button mat-raised-button color="primary" (click)="editClient()">
          <mat-icon>edit</mat-icon>
          Editar Cliente
        </button>
        <button mat-raised-button (click)="manageSubscription()">
          <mat-icon>subscriptions</mat-icon>
          Gerir Subscrição
        </button>
        <button mat-raised-button (click)="viewPayments()">
          <mat-icon>payment</mat-icon>
          Ver Pagamentos
        </button>
      </div>
      <button mat-button (click)="close()">Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header { background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: white; margin: -24px -24px 24px -24px; padding: 24px; }
    .title-content { display: flex; align-items: center; gap: 12px; }
    .title-icon { font-size: 32px; width: 32px; height: 32px; }
    .title-text { font-size: 24px; font-weight: 600; margin: 0; }
    .subtitle-text { font-size: 14px; opacity: 0.9; margin: 0; }
    .status-chip { padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-chip.active { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
    .status-chip.inactive { background: rgba(244, 67, 54, 0.2); color: #f44336; }
    .status-chip.pending { background: rgba(255, 152, 0, 0.2); color: #ff9800; }
    
    .client-details { width: 100%; max-width: 600px; display: flex; flex-direction: column; gap: 16px; overflow: visible; }
    .info-card { transition: transform 0.2s; }
    .info-card:hover { transform: translateY(-2px); }
    .info-card mat-card-title { display: flex; align-items: center; gap: 8px; color: #1976d2; }
    
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .info-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8f9fa; border-radius: 8px; }
    .info-icon { color: #1976d2; font-size: 20px; }
    .info-content { flex: 1; }
    .info-label { font-size: 12px; color: #666; font-weight: 500; text-transform: uppercase; }
    .info-value { font-size: 14px; color: #333; font-weight: 600; margin-top: 2px; }
    
    mat-chip-set { display: flex; gap: 8px; }
    mat-chip { background: #f5f5f5; color: #666; }
    mat-chip.enabled { background: #e3f2fd; color: #1976d2; }
    mat-chip mat-icon { font-size: 16px; margin-right: 4px; }
    
    .subscription-info { display: flex; flex-direction: column; gap: 12px; }
    .subscription-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f8f9fa; border-radius: 6px; }
    .subscription-item .label { font-weight: 500; color: #666; }
    .subscription-item .value { font-weight: 600; }
    .subscription-item .value.critical { color: #f44336; }
    .subscription-item .value.warning { color: #ff9800; }
    .subscription-item .value.safe { color: #4caf50; }
    
    .dialog-actions { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; }
    .action-buttons { display: flex; gap: 8px; }
    
    @media (max-width: 768px) {
      .client-details { max-width: 100%; min-width: 0; }
      .info-grid { grid-template-columns: 1fr; }
      .action-buttons { flex-direction: column; gap: 8px; }
      .dialog-header { margin: -24px -16px 16px -16px; padding: 16px; }
      .info-item { flex-direction: column; align-items: flex-start; text-align: left; }
      .info-icon { margin-bottom: 4px; }
    }
  `]
})
export class ViewClientDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ViewClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: any }
  ) {}

  getStatusText(status: string): string {
    switch(status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return status;
    }
  }

  editClient(): void {
    this.dialogRef.close({ action: 'edit', client: this.data.client });
  }

  manageSubscription(): void {
    this.dialogRef.close({ action: 'subscription', client: this.data.client });
  }

  viewPayments(): void {
    this.dialogRef.close({ action: 'payments', client: this.data.client });
  }

  close(): void {
    this.dialogRef.close();
  }

  getDaysLeft(): number {
    if (!this.data.client.subscriptionEnd) return -999;
    const today = new Date();
    const endDate = new Date(this.data.client.subscriptionEnd);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysLeftText(): string {
    const days = this.getDaysLeft();
    if (days < -365) return '--';
    if (days < 0) return 'Expirada';
    return `${days} dias`;
  }

  getDaysLeftClass(): string {
    const days = this.getDaysLeft();
    if (days < 0) return 'critical';
    if (days <= 15) return 'warning';
    return 'safe';
  }
}