import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

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
          <h2 mat-dialog-title>Renovar Subscrição</h2>
          <p class="subtitle">Estender o período de subscrição</p>
        </div>
      </div>
      <button mat-icon-button mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <div class="client-info">
        <div class="info-header">
          <mat-icon>person</mat-icon>
          <span>Informações do Cliente</span>
        </div>
        <div class="info-content">
          <div class="info-item">
            <span class="label">Nome:</span>
            <span class="value">{{ data.clientName }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ data.clientEmail }}</span>
          </div>
        </div>
      </div>

      <form [formGroup]="renewForm" class="form">
        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>card_membership</mat-icon>
            Plano e Preço
          </h3>

          <mat-form-field appearance="outline">
            <mat-label>Novo plano</mat-label>
            <mat-select formControlName="plan" (selectionChange)="updatePrice()">
              <mat-option value="monthly">1 Mês - €10.00</mat-option>
              <mat-option value="quarterly">3 Meses - €30.00</mat-option>
              <mat-option value="biannual">6 Meses - €60.00</mat-option>
              <mat-option value="annual">12 Meses - €100.00</mat-option>
            </mat-select>
            <mat-icon matSuffix>calendar_view_month</mat-icon>
          </mat-form-field>

          <div class="price-info">
            <mat-icon>euro</mat-icon>
            <div class="price-content">
              <span class="price-label">Valor Total</span>
              <span class="price-value">€{{ renewForm.get('price')?.value }}</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>date_range</mat-icon>
            Período
          </h3>

          <mat-form-field appearance="outline">
            <mat-label>Data de início</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="startDate">
            <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
            <mat-icon matSuffix>event</mat-icon>
          </mat-form-field>

          <div class="end-date-info">
            <mat-icon>event_available</mat-icon>
            <div class="date-content">
              <span class="date-label">Data de fim calculada</span>
              <span class="date-value">{{ getCalculatedEndDate() }}</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>payment</mat-icon>
            Pagamento
          </h3>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Estado do pagamento</mat-label>
              <mat-select formControlName="paymentStatus">
                <mat-option value="paid">Pago</mat-option>
                <mat-option value="pending">Pendente</mat-option>
              </mat-select>
              <mat-icon matSuffix>check_circle</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Método de pagamento</mat-label>
              <mat-select formControlName="paymentMethod">
                <mat-option value="stripe">Cartão (Stripe)</mat-option>
                <mat-option value="transfer">Transferência</mat-option>
                <mat-option value="cash">Dinheiro</mat-option>
                <mat-option value="other">Outro</mat-option>
              </mat-select>
              <mat-icon matSuffix>credit_card</mat-icon>
            </mat-form-field>
          </div>
        </div>
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
      background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
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

    .client-info {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      border-left: 4px solid #2196F3;
    }

    .info-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-weight: 600;
      color: #1976D2;
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
      gap: 24px;
      max-width: 600px;
      min-width: 500px;
    }

    .form-section {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      padding-bottom: 8px;
      border-bottom: 1px solid #e0e0e0;
    }

    .section-title mat-icon {
      color: #4CAF50;
      font-size: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
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
      color: #2e7d32;
    }

    .price-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
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
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-top: 8px;
    }

    .end-date-info mat-icon {
      color: #2196F3;
      font-size: 24px;
    }

    .date-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .date-label {
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }

    .date-value {
      font-size: 16px;
      font-weight: 600;
      color: #333;
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
        max-width: 100%;
      }

      .form-row {
        grid-template-columns: 1fr;
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
