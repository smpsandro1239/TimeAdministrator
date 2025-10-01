import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-subscription-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Editar Subscrição - {{ data.clientName }}</h2>
    
    <mat-dialog-content>
      <div class="current-info">
        <p><strong>Subscrição atual:</strong> {{ getPlanText(data.plan) }} - {{ data.price }}€</p>
        <p><strong>Expira em:</strong> {{ formatDate(data.endDate) }}</p>
      </div>
      
      <form [formGroup]="subscriptionForm" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Plano</mat-label>
          <mat-select formControlName="plan" (selectionChange)="updatePrice()">
            <mat-option value="monthly">1 Mês - €10.00 (padrão)</mat-option>
            <mat-option value="quarterly">3 Meses - €30.00 (padrão)</mat-option>
            <mat-option value="biannual">6 Meses - €60.00 (padrão)</mat-option>
            <mat-option value="annual">12 Meses - €100.00 (padrão)</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Preço personalizado (€)</mat-label>
          <input matInput type="number" formControlName="price" step="0.01" (input)="onPriceChange()">
          <mat-hint>Preço padrão: {{ getDefaultPrice() }}€</mat-hint>
        </mat-form-field>
        
        <div class="extend-section">
          <h3>Ou estender subscrição atual:</h3>
          <div class="extend-buttons">
            <button type="button" mat-stroked-button (click)="extendSubscription(1)">+1 Mês</button>
            <button type="button" mat-stroked-button (click)="extendSubscription(3)">+3 Meses</button>
            <button type="button" mat-stroked-button (click)="extendSubscription(6)">+6 Meses</button>
            <button type="button" mat-stroked-button (click)="extendSubscription(12)">+12 Meses</button>
          </div>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="status">
            <mat-option value="active">Ativa</mat-option>
            <mat-option value="expired">Expirada</mat-option>
            <mat-option value="cancelled">Cancelada</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Data de início</mat-label>
          <input matInput [matDatepicker]="startPicker" formControlName="startDate" (dateChange)="updateEndDate()">
          <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Data de fim (calculada automaticamente)</mat-label>
          <input matInput [matDatepicker]="endPicker" formControlName="endDate">
          <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
          <mat-datepicker #endPicker></mat-datepicker>
          <mat-hint>Calculada com base no plano selecionado</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estado do pagamento</mat-label>
          <mat-select formControlName="paymentStatus">
            <mat-option value="paid">Pago</mat-option>
            <mat-option value="pending">Pendente</mat-option>
            <mat-option value="failed">Falhado</mat-option>
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
      <button mat-raised-button color="primary" (click)="save()" [disabled]="subscriptionForm.invalid">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .current-info { background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
    .current-info p { margin: 4px 0; }
    .form { display: flex; flex-direction: column; gap: 16px; min-width: 500px; }
    .extend-section { margin: 16px 0; padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
    .extend-section h3 { margin: 0 0 12px 0; font-size: 14px; color: #666; }
    .extend-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
    .extend-buttons button { flex: 1; min-width: 80px; }
    mat-form-field { width: 100%; }
  `]
})
export class EditSubscriptionDialogComponent {
  subscriptionForm: FormGroup;
  originalEndDate: Date;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.originalEndDate = new Date(data.endDate);
    this.subscriptionForm = this.fb.group({
      plan: [data.plan, Validators.required],
      price: [data.price, [Validators.required, Validators.min(0)]],
      status: [data.status, Validators.required],
      startDate: [new Date(data.startDate), Validators.required],
      endDate: [new Date(data.endDate), Validators.required],
      paymentStatus: [data.paymentStatus, Validators.required],
      paymentMethod: [data.paymentMethod]
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-PT');
  }

  getDefaultPrice(): number {
    const plan = this.subscriptionForm.get('plan')?.value;
    const prices: { [key: string]: number } = {
      'monthly': 10.00,
      'quarterly': 30.00,
      'biannual': 60.00,
      'annual': 100.00
    };
    return prices[plan] || 0;
  }

  updatePrice(): void {
    const defaultPrice = this.getDefaultPrice();
    this.subscriptionForm.patchValue({ price: defaultPrice });
    this.updateEndDate();
  }

  onPriceChange(): void {
    // Permite preço personalizado sem alterar a data
  }

  updateEndDate(): void {
    const startDate = this.subscriptionForm.get('startDate')?.value;
    const plan = this.subscriptionForm.get('plan')?.value;
    
    if (startDate && plan) {
      const endDate = new Date(startDate);
      const durations: { [key: string]: number } = {
        'monthly': 30,
        'quarterly': 90,
        'biannual': 180,
        'annual': 365
      };
      
      endDate.setDate(endDate.getDate() + durations[plan]);
      this.subscriptionForm.patchValue({ endDate });
    }
  }

  extendSubscription(months: number): void {
    const currentEndDate = new Date(this.originalEndDate);
    const newEndDate = new Date(currentEndDate);
    
    // Adicionar meses à data atual de expiração
    if (months === 1) {
      newEndDate.setDate(newEndDate.getDate() + 30);
      this.subscriptionForm.patchValue({ 
        price: this.subscriptionForm.get('price')?.value + 10.00,
        endDate: newEndDate 
      });
    } else if (months === 3) {
      newEndDate.setDate(newEndDate.getDate() + 90);
      this.subscriptionForm.patchValue({ 
        price: this.subscriptionForm.get('price')?.value + 30.00,
        endDate: newEndDate 
      });
    } else if (months === 6) {
      newEndDate.setDate(newEndDate.getDate() + 180);
      this.subscriptionForm.patchValue({ 
        price: this.subscriptionForm.get('price')?.value + 60.00,
        endDate: newEndDate 
      });
    } else if (months === 12) {
      newEndDate.setDate(newEndDate.getDate() + 365);
      this.subscriptionForm.patchValue({ 
        price: this.subscriptionForm.get('price')?.value + 100.00,
        endDate: newEndDate 
      });
    }
  }

  save(): void {
    if (this.subscriptionForm.valid) {
      this.dialogRef.close(this.subscriptionForm.value);
    }
  }
}