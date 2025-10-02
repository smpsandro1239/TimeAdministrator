import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-subscription-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule, 
    MatCardModule, MatDividerModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, FormsModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>
        <mat-icon class="title-icon">subscriptions</mat-icon>
        <span>Gerir Subscrição - {{ data.client.name }}</span>
      </h2>
    </div>
    
    <mat-dialog-content>
      <div class="subscription-container">
        <!-- Estado Atual -->
        <mat-card class="current-status">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>info</mat-icon>
              Estado Actual
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="status-grid">
              <div class="status-item">
                <span class="label">Estado:</span>
                <span class="value" [ngClass]="getStatusClass()">{{ getStatusText() }}</span>
              </div>
              <div class="status-item">
                <span class="label">Expira em:</span>
                <span class="value">{{ getDaysLeft() }} dias</span>
              </div>
              <div class="status-item">
                <span class="label">Data de Expiração:</span>
                <span class="value">{{ data.client.subscriptionEnd | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="status-item">
                <span class="label">Plano Actual:</span>
                <span class="value">{{ getCurrentPlan() }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Acções Rápidas -->
        <mat-card class="quick-actions">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>flash_on</mat-icon>
              Acções Rápidas
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="actions-grid">
              <button mat-raised-button color="primary" (click)="extendSubscription(30, 'monthly')">
                <mat-icon>looks_one</mat-icon>
                1 Mês
              </button>
              <button mat-raised-button color="primary" (click)="extendSubscription(90, 'quarterly')">
                <mat-icon>looks_3</mat-icon>
                3 Meses
              </button>
              <button mat-raised-button color="primary" (click)="extendSubscription(180, 'biannual')">
                <mat-icon>looks_6</mat-icon>
                6 Meses
              </button>
              <button mat-raised-button color="primary" (click)="extendSubscription(365, 'annual')">
                <mat-icon>looks_one</mat-icon>
                12 Meses
              </button>
              <button mat-raised-button color="accent" (click)="renewSubscription()">
                <mat-icon>refresh</mat-icon>
                Renovar {{ getCurrentPlanText() }}
              </button>
              <button mat-raised-button [color]="isActive() ? 'warn' : 'primary'" (click)="toggleStatus()">
                <mat-icon>{{ isActive() ? 'pause' : 'play_arrow' }}</mat-icon>
                {{ isActive() ? 'Suspender' : 'Activar' }}
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Nova Subscrição -->
        <mat-card class="new-subscription">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>add</mat-icon>
              Nova Subscrição
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Plano</mat-label>
                <mat-select [(value)]="newSubscription.plan">
                  <mat-option value="monthly">Mensal - €29.99</mat-option>
                  <mat-option value="quarterly">Trimestral - €79.99</mat-option>
                  <mat-option value="biannual">Semestral - €149.99</mat-option>
                  <mat-option value="annual">Anual - €279.99</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Data de Início</mat-label>
                <input matInput [matDatepicker]="startPicker" [(ngModel)]="newSubscription.startDate">
                <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Valor Personalizado</mat-label>
                <input matInput type="number" [(ngModel)]="newSubscription.customPrice" placeholder="Deixar vazio para preço padrão">
                <span matSuffix>€</span>
              </mat-form-field>
            </div>

            <button mat-raised-button color="primary" (click)="createSubscription()" [disabled]="!newSubscription.plan">
              <mat-icon>save</mat-icon>
              Criar Nova Subscrição
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="close()">Fechar</button>
      <button mat-raised-button color="primary" (click)="viewPayments()">
        <mat-icon>payment</mat-icon>
        Ver Pagamentos
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header { 
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); 
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
    
    .subscription-container { 
      display: flex; 
      flex-direction: column; 
      gap: 20px; 
      max-width: 600px; 
    }
    
    .current-status mat-card-title,
    .quick-actions mat-card-title,
    .new-subscription mat-card-title { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      color: #1976d2; 
    }
    
    .status-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 16px; 
    }
    .status-item { 
      display: flex; 
      justify-content: space-between; 
      padding: 12px; 
      background: #f8f9fa; 
      border-radius: 8px; 
    }
    .status-item .label { font-weight: 500; color: #666; }
    .status-item .value { font-weight: 600; }
    .status-item .value.active { color: #4caf50; }
    .status-item .value.inactive { color: #f44336; }
    .status-item .value.expired { color: #ff9800; }
    
    .actions-grid { 
      display: grid; 
      grid-template-columns: repeat(3, 1fr); 
      gap: 8px; 
    }
    .actions-grid button {
      font-size: 12px;
      padding: 8px 12px;
    }
    
    .form-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 16px; 
      margin-bottom: 16px; 
    }
    
    .dialog-actions { 
      display: flex; 
      justify-content: space-between; 
      padding: 16px 24px; 
    }
    
    @media (max-width: 768px) {
      .subscription-container { max-width: 100%; }
      .status-grid { grid-template-columns: 1fr; }
      .actions-grid { 
        grid-template-columns: repeat(2, 1fr); 
        gap: 8px; 
      }
      .actions-grid button {
        font-size: 11px;
        padding: 12px 8px;
      }
      .form-grid { grid-template-columns: 1fr; }
      .dialog-actions { 
        flex-direction: column; 
        gap: 12px; 
      }
      .dialog-actions button { width: 100%; }
      .dialog-header { 
        margin: -24px -16px 16px -16px; 
        padding: 16px; 
      }
    }
  `]
})
export class ManageSubscriptionDialogComponent {
  newSubscription = {
    plan: '',
    startDate: new Date(),
    customPrice: null
  };

  constructor(
    private dialogRef: MatDialogRef<ManageSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: any }
  ) {}

  getStatusText(): string {
    const days = this.getDaysLeft();
    if (days < 0) return 'Expirada';
    if (days <= 7) return 'A Expirar';
    return 'Activa';
  }

  getStatusClass(): string {
    const days = this.getDaysLeft();
    if (days < 0) return 'expired';
    if (days <= 7) return 'inactive';
    return 'active';
  }

  getDaysLeft(): number {
    if (!this.data.client.subscriptionEnd) return -999;
    const today = new Date();
    const endDate = new Date(this.data.client.subscriptionEnd);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getCurrentPlan(): string {
    // Simular detecção do plano atual baseado nos dias restantes
    const days = this.getDaysLeft();
    if (days > 300) return 'annual';
    if (days > 150) return 'biannual';
    if (days > 60) return 'quarterly';
    return 'monthly';
  }

  getCurrentPlanText(): string {
    const plan = this.getCurrentPlan();
    switch(plan) {
      case 'monthly': return '1 Mês';
      case 'quarterly': return '3 Meses';
      case 'biannual': return '6 Meses';
      case 'annual': return '12 Meses';
      default: return 'Subscrição';
    }
  }

  isActive(): boolean {
    return this.getDaysLeft() > 0;
  }

  extendSubscription(days: number, planType: string): void {
    const currentEnd = new Date(this.data.client.subscriptionEnd);
    currentEnd.setDate(currentEnd.getDate() + days);
    this.data.client.subscriptionEnd = currentEnd;
    this.dialogRef.close({ 
      action: 'extended', 
      client: this.data.client, 
      days, 
      planType,
      planText: this.getPlanText(planType)
    });
  }

  renewSubscription(): void {
    const currentPlan = this.getCurrentPlan();
    const planDays = this.getPlanDays(currentPlan);
    this.extendSubscription(planDays, currentPlan);
  }

  getPlanDays(plan: string): number {
    switch(plan) {
      case 'monthly': return 30;
      case 'quarterly': return 90;
      case 'biannual': return 180;
      case 'annual': return 365;
      default: return 30;
    }
  }

  getPlanText(plan: string): string {
    switch(plan) {
      case 'monthly': return '1 Mês';
      case 'quarterly': return '3 Meses';
      case 'biannual': return '6 Meses';
      case 'annual': return '12 Meses';
      default: return plan;
    }
  }

  toggleStatus(): void {
    const newStatus = this.isActive() ? 'inactive' : 'active';
    this.dialogRef.close({ action: 'toggle', client: this.data.client, status: newStatus });
  }

  createSubscription(): void {
    this.dialogRef.close({ 
      action: 'create', 
      client: this.data.client, 
      subscription: this.newSubscription 
    });
  }

  viewPayments(): void {
    this.dialogRef.close({ action: 'payments', client: this.data.client });
  }

  close(): void {
    this.dialogRef.close();
  }
}