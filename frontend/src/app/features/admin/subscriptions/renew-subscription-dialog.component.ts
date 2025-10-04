import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-renew-subscription-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <div class="header-content">
        <mat-icon class="title-icon">refresh</mat-icon>
        <div class="title-section">
          <h2 mat-dialog-title>{{ data.clientName }}</h2>
          <p class="subtitle">Renovar Subscrição</p>
        </div>
      </div>
      <button mat-icon-button mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content>
      <div class="current-info">
        <div class="info-header">
          <mat-icon>info</mat-icon>
          <span>Subscrição Expirada</span>
        </div>
        <div class="info-content">
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ data.clientEmail }}</span>
          </div>
          <div class="info-item">
            <span class="label">Plano Anterior:</span>
            <span class="value">{{ getPlanText(data.plan) }}</span>
          </div>
        </div>
      </div>
      
      <form [formGroup]="renewForm" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Novo plano</mat-label>
          <mat-select formControlName="plan" (selectionChange)="updatePrice()">
            <mat-option value="monthly">1 Mês - €10.00</mat-option>
            <mat-option value="quarterly">3 Meses - €30.00</mat-option>
            <mat-option value="biannual">6 Meses - €60.00</mat-option>
            <mat-option value="annual">12 Meses - €100.00</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="price-info">
          <mat-icon>euro</mat-icon>
          <div>
            <div class="price-label">Valor Total</div>
            <div class="price-value">€{{ renewForm.get('price')?.value }}</div>
          </div>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Data de início</mat-label>
          <input matInput [matDatepicker]="startPicker" formControlName="startDate">
          <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
        </mat-form-field>

        <div class="end-date-info">
          <p><strong>Data de fim calculada:</strong> {{ getCalculatedEndDate() }}</p>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Estado do pagamento</mat-label>
          <mat-select formControlName="paymentStatus">
            <mat-option value="paid">Pago</mat-option>
            <mat-option value="pending">Pendente</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Método de pagamento</mat-label>
          <mat-select formControlName="paymentMethod">
            <mat-option value="stripe">Cartão (Stripe)</mat-option>
            <mat-option value="transfer">Transferência</mat-option>
            <mat-option value="cash">Dinheiro</mat-option>
            <mat-option value="other">Outro</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions class="dialog-actions">
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="renew()" [disabled]="renewForm.invalid">
        <mat-icon>refresh</mat-icon>
        Renovar Subscrição
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
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
    .current-info {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      border-left: 4px solid #FF9800;
    }
    .info-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-weight: 600;
      color: #E65100;
    }
    .info-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
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
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 450px;
    }
    .price-info {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
      border-radius: 12px;
      border-left: 4px solid #4CAF50;
    }
    .price-info mat-icon {
      font-size: 32px;
      color: #4CAF50;
    }
    .price-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      font-weight: 500;
    }
    .price-value {
      font-size: 24px;
      font-weight: 700;
      color: #2e7d32;
    }
    .end-date-info {
      padding: 12px;
      background: #e3f2fd;
      border-radius: 8px;
      border-left: 3px solid #2196F3;
    }
    .end-date-info p {
      margin: 0;
      font-size: 14px;
      color: #1565C0;
    }
    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      margin: 24px -24px -24px -24px;
    }
    
    @media (max-width: 768px) {
      .form {
        min-width: 0;
      }
      .info-content {
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
    }
  `]
})
export class RenewSubscriptionDialogComponent {
  renewForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RenewSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const today = new Date();
    this.renewForm = this.fb.group({
      plan: ['monthly', Validators.required],
      price: [10.00],
      startDate: [today, Validators.required],
      paymentStatus: ['pending', Validators.required],
      paymentMethod: ['stripe']
    });
  }

  getPlanText(plan: string): string {
    const plans: { [key: string]: string } = {
      'monthly': '1 Mês',
      'quarterly': '3 Meses',
      'biannual': '6 Meses',
      'annual': '12 Meses'
    };
    return plans[plan] || plan;
  }

  updatePrice(): void {
    const plan = this.renewForm.get('plan')?.value;
    const prices: { [key: string]: number } = {
      'monthly': 10.00,
      'quarterly': 30.00,
      'biannual': 60.00,
      'annual': 100.00
    };
    
    if (prices[plan]) {
      this.renewForm.patchValue({ price: prices[plan] });
    }
  }

  getCalculatedEndDate(): string {
    const startDate = this.renewForm.get('startDate')?.value;
    const plan = this.renewForm.get('plan')?.value;
    
    if (!startDate || !plan) return 'N/A';
    
    const endDate = new Date(startDate);
    const durations: { [key: string]: number } = {
      'monthly': 30,
      'quarterly': 90,
      'biannual': 180,
      'annual': 365
    };
    
    endDate.setDate(endDate.getDate() + durations[plan]);
    return endDate.toLocaleDateString('pt-PT');
  }

  renew(): void {
    if (this.renewForm.valid) {
      const formValue = this.renewForm.value;
      const startDate = new Date(formValue.startDate);
      const plan = formValue.plan;
      
      const durations: { [key: string]: number } = {
        'monthly': 30,
        'quarterly': 90,
        'biannual': 180,
        'annual': 365
      };
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durations[plan]);
      
      const renewalData = {
        ...formValue,
        endDate: endDate,
        status: 'active',
        paymentDate: formValue.paymentStatus === 'paid' ? new Date() : null
      };
      
      this.dialogRef.close(renewalData);
    }
  }
}