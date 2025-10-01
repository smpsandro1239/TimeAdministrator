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
    <h2 mat-dialog-title>Editar Subscrição</h2>
    
    <mat-dialog-content>
      <form [formGroup]="subscriptionForm" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Plano</mat-label>
          <mat-select formControlName="plan" (selectionChange)="updatePrice()">
            <mat-option value="monthly">Mensal - €29.99</mat-option>
            <mat-option value="quarterly">Trimestral - €79.99</mat-option>
            <mat-option value="biannual">Semestral - €149.99</mat-option>
            <mat-option value="annual">Anual - €279.99</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Preço (€)</mat-label>
          <input matInput type="number" formControlName="price" step="0.01">
        </mat-form-field>

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
          <input matInput [matDatepicker]="startPicker" formControlName="startDate">
          <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Data de fim</mat-label>
          <input matInput [matDatepicker]="endPicker" formControlName="endDate">
          <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
          <mat-datepicker #endPicker></mat-datepicker>
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
    .form { display: flex; flex-direction: column; gap: 16px; min-width: 400px; }
    mat-form-field { width: 100%; }
  `]
})
export class EditSubscriptionDialogComponent {
  subscriptionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
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

  updatePrice(): void {
    const plan = this.subscriptionForm.get('plan')?.value;
    const prices: { [key: string]: number } = {
      'monthly': 29.99,
      'quarterly': 79.99,
      'biannual': 149.99,
      'annual': 279.99
    };
    
    if (prices[plan]) {
      this.subscriptionForm.patchValue({ price: prices[plan] });
    }
  }

  save(): void {
    if (this.subscriptionForm.valid) {
      this.dialogRef.close(this.subscriptionForm.value);
    }
  }
}