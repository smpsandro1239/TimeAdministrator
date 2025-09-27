import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SubscriptionService } from '../../../../services/subscription.service';
import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../models/client.model';
import { SubscriptionPeriod, SubscriptionPeriodLabels, CreateSubscriptionRequest } from '../../../../models/subscription.model';

@Component({
  selector: 'app-add-subscription-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSlideToggleModule
  ],
  templateUrl: './add-subscription-dialog.component.html',
  styleUrl: './add-subscription-dialog.component.scss'
})
export class AddSubscriptionDialogComponent implements OnInit {
  subscriptionForm: FormGroup;
  clients: Client[] = [];
  loading = false;
  periodLabels = SubscriptionPeriodLabels;
  periods = Object.values(SubscriptionPeriod);

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private clientService: ClientService,
    private dialogRef: MatDialogRef<AddSubscriptionDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subscriptionForm = this.fb.group({
      clientId: ['', Validators.required],
      period: [SubscriptionPeriod.ONE_YEAR, Validators.required],
      startDate: [new Date(), Validators.required],
      price: [120.00, [Validators.required, Validators.min(0)]],
      autoRenew: [true],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.onPeriodChange(); // Calculate initial dates
  }

  loadClients(): void {
    this.clientService.getClients({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.clients = response.data;
      },
      error: (error: any) => {
        console.error('Erro ao carregar clientes:', error);
        this.snackBar.open('Erro ao carregar clientes', 'Fechar', { duration: 3000 });
      }
    });
  }

  onPeriodChange(): void {
    const period = this.subscriptionForm.get('period')?.value;
    const startDate = this.subscriptionForm.get('startDate')?.value;

    if (period && startDate) {
      this.subscriptionService.calculateDates(period, startDate.toISOString()).subscribe({
        next: (dates) => {
          this.subscriptionForm.patchValue({
            endDate: new Date(dates.endDate),
            renewalDate: new Date(dates.renewalDate)
          });
        },
        error: (error: any) => {
          console.error('Erro ao calcular datas:', error);
        }
      });
    }
  }

  onStartDateChange(): void {
    this.onPeriodChange();
  }

  onSubmit(): void {
    if (this.subscriptionForm.valid) {
      this.loading = true;
      const formData = this.subscriptionForm.value;

      const subscriptionData: CreateSubscriptionRequest = {
        clientId: formData.clientId,
        period: formData.period,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        renewalDate: formData.renewalDate.toISOString(),
        price: formData.price,
        autoRenew: formData.autoRenew,
        notes: formData.notes || undefined
      };

      this.subscriptionService.createSubscription(subscriptionData).subscribe({
        next: (subscription) => {
          this.snackBar.open('Subscrição criada com sucesso!', 'Fechar', { duration: 3000 });
          this.dialogRef.close(subscription);
        },
        error: (error: any) => {
          console.error('Erro ao criar subscrição:', error);
          this.snackBar.open('Erro ao criar subscrição. Verifique os dados.', 'Fechar', { duration: 5000 });
          this.loading = false;
        }
      });
    } else {
      this.snackBar.open('Por favor, corrija os erros no formulário.', 'Fechar', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.subscriptionForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (field?.hasError('min')) {
      return 'Valor deve ser maior que 0';
    }
    return '';
  }
}
