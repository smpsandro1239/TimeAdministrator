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
      <h2 mat-dialog-title>Renovar Subscrição</h2>
      <mat-icon color="primary">refresh</mat-icon>
    </div>
    
    <mat-dialog-content>
      <div class="client-info">
        <h3>Cliente: {{ data.clientName }}</h3>
        <p>Email: {{ data.clientEmail }}</p>
      </div>
      
      <form [formGroup]="renewForm" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Novo plano</mat-label>
          <mat-select formControlName="plan" (selectionChange)="updatePrice()">
            <mat-option value="monthly">Mensal - €29.99</mat-option>
            <mat-option value="quarterly">Trimestral - €79.99</mat-option>
            <mat-option value="biannual">Semestral - €149.99</mat-option>
            <mat-option value="annual">Anual - €279.99</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="price-info">
          <strong>Preço: €{{ renewForm.get('price')?.value }}</strong>
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
    
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="renew()" [disabled]="renewForm.invalid">
        <mat-icon>refresh</mat-icon>
        Renovar Subscrição
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .client-info { background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
    .client-info h3 { margin: 0 0 8px 0; color: #333; }
    .client-info p { margin: 0; color: #666; }
    .form { display: flex; flex-direction: column; gap: 16px; min-width: 400px; }
    .price-info { padding: 12px; background: #e8f5e8; border-radius: 8px; text-align: center; color: #2e7d32; }
    .end-date-info { padding: 8px; background: #f0f0f0; border-radius: 4px; }
    .end-date-info p { margin: 0; font-size: 14px; }
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
      price: [29.99],
      startDate: [today, Validators.required],
      paymentStatus: ['pending', Validators.required],
      paymentMethod: ['stripe']
    });
  }

  updatePrice(): void {
    const plan = this.renewForm.get('plan')?.value;
    const prices: { [key: string]: number } = {
      'monthly': 29.99,
      'quarterly': 79.99,
      'biannual': 149.99,
      'annual': 279.99
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