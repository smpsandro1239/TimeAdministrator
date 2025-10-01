import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-payment-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Adicionar Pagamento</h2>
    
    <mat-dialog-content>
      <form [formGroup]="paymentForm" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Cliente</mat-label>
          <mat-select formControlName="clientName">
            <mat-option value="João Silva">João Silva</mat-option>
            <mat-option value="Maria Santos">Maria Santos</mat-option>
            <mat-option value="Pedro Costa">Pedro Costa</mat-option>
            <mat-option value="Ana Ferreira">Ana Ferreira</mat-option>
            <mat-option value="Carlos Oliveira">Carlos Oliveira</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Valor (€)</mat-label>
          <input matInput type="number" formControlName="amount" step="0.01">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Método de pagamento</mat-label>
          <mat-select formControlName="method">
            <mat-option value="stripe">Cartão (Stripe)</mat-option>
            <mat-option value="transfer">Transferência</mat-option>
            <mat-option value="cash">Dinheiro</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Data do pagamento</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="status">
            <mat-option value="pending">Pendente</mat-option>
            <mat-option value="approved">Aprovado</mat-option>
            <mat-option value="rejected">Rejeitado</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Observações (opcional)</mat-label>
          <textarea matInput formControlName="notes" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="paymentForm.invalid">
        Adicionar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form { display: flex; flex-direction: column; gap: 16px; min-width: 400px; }
  `]
})
export class AddPaymentDialogComponent {
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPaymentDialogComponent>
  ) {
    this.paymentForm = this.fb.group({
      clientName: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      method: ['stripe', Validators.required],
      date: [new Date(), Validators.required],
      status: ['pending', Validators.required],
      notes: ['']
    });
  }

  save(): void {
    if (this.paymentForm.valid) {
      const formValue = this.paymentForm.value;
      const reference = `PAY-${String(Date.now()).slice(-6)}`;
      
      this.dialogRef.close({
        ...formValue,
        reference,
        id: Date.now()
      });
    }
  }
}