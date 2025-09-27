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
import { Subscription, SubscriptionPeriod, SubscriptionPeriodLabels, UpdateSubscriptionRequest } from '../../../../models/subscription.model';

@Component({
  selector: 'app-edit-subscription-dialog',
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
  templateUrl: './edit-subscription-dialog.component.html',
  styleUrl: './edit-subscription-dialog.component.scss'
})
export class EditSubscriptionDialogComponent implements OnInit {
  subscriptionForm: FormGroup;
  clients: Client[] = [];
  loading = false;
  periodLabels = SubscriptionPeriodLabels;
  periods = Object.values(SubscriptionPeriod);
  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private clientService: ClientService,
    private dialogRef: MatDialogRef<EditSubscriptionDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { subscription: Subscription }
  ) {
    this.subscription = data.subscription;
    this.subscriptionForm = this.fb.group({
      clientId: [this.subscription.clientId, Validators.required],
      period: [this.subscription.period, Validators.required],
      startDate: [new Date(this.subscription.startDate), Validators.required],
      endDate: [new Date(this.subscription.endDate), Validators.required],
      renewalDate: [new Date(this.subscription.renewalDate), Validators.required],
      price: [this.subscription.price, [Validators.required, Validators.min(0)]],
      autoRenew: [this.subscription.autoRenew],
      notes: [this.subscription.notes || '']
    });
  }

  ngOnInit(): void {
    this.loadClients();
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

  onSubmit(): void {
    if (this.subscriptionForm.valid) {
      this.loading = true;
      const formData = this.subscriptionForm.value;

      const updateData: UpdateSubscriptionRequest = {
        clientId: formData.clientId,
        period: formData.period,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        renewalDate: formData.renewalDate.toISOString(),
        price: formData.price,
        autoRenew: formData.autoRenew,
        notes: formData.notes || undefined
      };

      this.subscriptionService.updateSubscription(this.subscription.id, updateData).subscribe({
        next: (updatedSubscription) => {
          this.snackBar.open('Subscrição atualizada com sucesso!', 'Fechar', { duration: 3000 });
          this.dialogRef.close(updatedSubscription);
        },
        error: (error: any) => {
          console.error('Erro ao atualizar subscrição:', error);
          this.snackBar.open('Erro ao atualizar subscrição. Verifique os dados.', 'Fechar', { duration: 5000 });
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
