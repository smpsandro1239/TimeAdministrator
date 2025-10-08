import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-payment-dialog',
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
    MatNativeDateModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <div class="header-content">
        <mat-icon class="title-icon">add_circle</mat-icon>
        <div class="title-section">
          <h2 mat-dialog-title>Adicionar Pagamento</h2>
          <p class="subtitle">Registar novo pagamento de cliente</p>
        </div>
      </div>
      <button mat-icon-button mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <form [formGroup]="paymentForm" class="form">
        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>person</mat-icon>
            Cliente
          </h3>

          <mat-form-field appearance="outline">
            <mat-label>Cliente</mat-label>
            <input matInput formControlName="clientName" [matAutocomplete]="auto" placeholder="Digite para pesquisar...">
            <mat-autocomplete #auto="matAutocomplete">
              <mat-option *ngFor="let client of filteredClients | async" [value]="client">
                {{ client }}
              </mat-option>
            </mat-autocomplete>
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>euro</mat-icon>
            Detalhes do Pagamento
          </h3>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Valor (€)</mat-label>
              <input matInput type="number" formControlName="amount" step="0.01">
              <mat-icon matSuffix>payments</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Método de pagamento</mat-label>
              <mat-select formControlName="method">
                <mat-option value="stripe">Cartão (Stripe)</mat-option>
                <mat-option value="transfer">Transferência</mat-option>
                <mat-option value="cash">Dinheiro</mat-option>
              </mat-select>
              <mat-icon matSuffix>credit_card</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Data do pagamento</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-icon matSuffix>event</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select formControlName="status">
                <mat-option value="pending">Pendente</mat-option>
                <mat-option value="approved">Aprovado</mat-option>
                <mat-option value="rejected">Rejeitado</mat-option>
              </mat-select>
              <mat-icon matSuffix>check_circle</mat-icon>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Observações (opcional)</mat-label>
            <textarea matInput formControlName="notes" rows="3" placeholder="Adicione notas sobre este pagamento..."></textarea>
            <mat-icon matSuffix>notes</mat-icon>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="dialog-actions">
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="paymentForm.invalid">
        <mat-icon>save</mat-icon>
        Adicionar Pagamento
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
      color: #FF9800;
      font-size: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row:last-child {
      margin-bottom: 0;
    }

    mat-form-field {
      width: 100%;
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
        padding: 16px;
      }

      .dialog-actions button {
        width: 100%;
        margin-bottom: 8px;
      }

      .dialog-actions button:last-child {
        margin-bottom: 0;
      }

      .form-section {
        padding: 16px;
      }

      .section-title {
        font-size: 14px;
      }
    }

    @media (max-width: 480px) {
      .dialog-header {
        margin: -16px -12px 12px -12px;
        padding: 12px;
      }

      .header-content {
        gap: 8px;
      }

      .title-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .title-section h2 {
        font-size: 18px;
      }

      .subtitle {
        font-size: 12px;
      }

      .form {
        gap: 16px;
      }

      .form-section {
        padding: 12px;
        border-radius: 8px;
      }

      .section-title {
        margin-bottom: 12px;
        font-size: 13px;
      }

      .section-title mat-icon {
        font-size: 16px;
      }

      .form-row {
        gap: 12px;
      }

      .dialog-actions {
        margin: 12px -12px -16px -12px;
        padding: 12px;
      }
    }
  `]
})
export class AddPaymentDialogComponent {
  paymentForm: FormGroup;
  clients = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Ferreira', 'Carlos Oliveira', 'Luísa Pereira', 'Rui Martins', 'Sofia Rodrigues'];
  filteredClients: Observable<string[]>;

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

    this.filteredClients = this.paymentForm.get('clientName')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.clients.filter(client => client.toLowerCase().includes(filterValue));
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
