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

@Component({
  selector: 'app-add-subscription-dialog',
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
          <h2 mat-dialog-title>Criar Nova Subscrição</h2>
          <p class="subtitle">Adicione uma nova subscrição para um cliente</p>
        </div>
      </div>
    </div>

    <mat-dialog-content>
      <form [formGroup]="subscriptionForm" class="form-container">
        <div class="form-section">
          <h3><mat-icon>person</mat-icon> Informações do Cliente</h3>

          <mat-form-field appearance="outline">
            <mat-label>Cliente</mat-label>
            <input type="text" matInput formControlName="clientName" [matAutocomplete]="auto" placeholder="Escreve para procurar...">
            <mat-autocomplete #auto="matAutocomplete" autoActiveFirstOption>
              <mat-option *ngFor="let client of filteredClients" [value]="client">
                {{ client }}
              </mat-option>
            </mat-autocomplete>
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-section">
          <h3><mat-icon>card_membership</mat-icon> Detalhes da Subscrição</h3>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Plano</mat-label>
              <mat-select formControlName="plan" (selectionChange)="onPlanChange()">
                <mat-option value="monthly">Mensal</mat-option>
                <mat-option value="quarterly">Trimestral</mat-option>
                <mat-option value="biannual">Semestral</mat-option>
                <mat-option value="annual">Anual</mat-option>
              </mat-select>
              <mat-icon matSuffix>calendar_view_month</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Valor (€)</mat-label>
              <input matInput type="number" formControlName="value" step="0.01">
              <mat-icon matSuffix>euro</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Data de Início</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="startDate" (dateChange)="onPlanChange()">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-icon matSuffix>event</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Data de Fim</mat-label>
              <input matInput formControlName="endDate" readonly>
              <mat-icon matSuffix>event_available</mat-icon>
            </mat-form-field>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="dialog-actions">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="subscriptionForm.invalid">
        <mat-icon>save</mat-icon>
        Criar Subscrição
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      color: white;
      margin: -24px -24px 24px -24px;
      padding: 24px;
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

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 100%;
      max-width: 600px;
      min-width: 0;
    }

    .form-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }

    .form-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      color: #1976d2;
      font-size: 16px;
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
      .form-container {
        max-width: 100%;
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

      .form-section {
        padding: 16px;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }
  `]
})
export class AddSubscriptionDialogComponent {
  subscriptionForm: FormGroup;
  clients = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Ferreira', 'Carlos Oliveira', 'Luísa Pereira', 'Rui Martins', 'Sofia Rodrigues'];
  filteredClients: string[];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddSubscriptionDialogComponent>
  ) {
    this.subscriptionForm = this.fb.group({
      clientName: ['', Validators.required],
      plan: ['monthly', Validators.required],
      startDate: [new Date(), Validators.required],
      value: [10.00, [Validators.required, Validators.min(0.01)]],
      endDate: ['']
    });

    this.filteredClients = this.clients;
    this.onPlanChange();

    this.subscriptionForm.get('clientName')?.valueChanges.subscribe(value => {
      this.filteredClients = this._filterClients(value);
    });
  }

  private _filterClients(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.clients.filter(client => client.toLowerCase().includes(filterValue));
  }

  onPlanChange(): void {
    const plan = this.subscriptionForm.get('plan')?.value;
    const startDate = this.subscriptionForm.get('startDate')?.value;

    if (plan && startDate) {
      const endDate = new Date(startDate);
      switch (plan) {
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          this.subscriptionForm.patchValue({ value: 10.00 });
          break;
        case 'quarterly':
          endDate.setMonth(endDate.getMonth() + 3);
          this.subscriptionForm.patchValue({ value: 30.00 });
          break;
        case 'biannual':
          endDate.setMonth(endDate.getMonth() + 6);
          this.subscriptionForm.patchValue({ value: 60.00 });
          break;
        case 'annual':
          endDate.setFullYear(endDate.getFullYear() + 1);
          this.subscriptionForm.patchValue({ value: 100.00 });
          break;
      }
      this.subscriptionForm.patchValue({ endDate: endDate.toLocaleDateString('pt-PT') });
    }
  }

  save(): void {
    if (this.subscriptionForm.valid) {
      const formValue = this.subscriptionForm.value;
      const newSubscription = {
        id: Date.now(),
        clientName: formValue.clientName,
        plan: formValue.plan,
        startDate: formValue.startDate,
        endDate: new Date(formValue.startDate.getTime() + this.getPeriodMs(formValue.plan)),
        status: 'active',
        value: formValue.value,
        manuallyActive: false
      };

      this.dialogRef.close(newSubscription);
    }
  }

  private getPeriodMs(plan: string): number {
    switch (plan) {
      case 'monthly': return 30 * 24 * 60 * 60 * 1000;
      case 'quarterly': return 90 * 24 * 60 * 60 * 1000;
      case 'biannual': return 180 * 24 * 60 * 60 * 1000;
      case 'annual': return 365 * 24 * 60 * 60 * 1000;
      default: return 30 * 24 * 60 * 60 * 1000;
    }
  }
}
