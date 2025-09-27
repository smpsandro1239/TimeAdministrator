import { Component, Inject } from '@angular/core';
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

import { ClientService } from '../../../../services/client.service';
import { SubscriptionService } from '../../../../services/subscription.service';
import { SubscriptionPeriod, SubscriptionPeriodLabels } from '../../../../models/subscription.model';

@Component({
  selector: 'app-add-client-dialog',
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
  templateUrl: './add-client-dialog.component.html',
  styleUrl: './add-client-dialog.component.scss'
})
export class AddClientDialogComponent {
  clientForm: FormGroup;
  subscriptionForm: FormGroup;
  loading = false;

  periods = Object.values(SubscriptionPeriod);
  periodLabels = SubscriptionPeriodLabels;

  get createSubscription(): boolean {
    return this.clientForm.get('createSubscription')?.value || false;
  }

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private subscriptionService: SubscriptionService,
    private dialogRef: MatDialogRef<AddClientDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\-\s\(\)]{8,}$/)]],
      notes: [''],
      createSubscription: [false]
    });

    this.subscriptionForm = this.fb.group({
      period: [SubscriptionPeriod.ONE_YEAR, [Validators.required]],
      price: [120.00, [Validators.required, Validators.min(0.01)]],
      startDate: [new Date(), [Validators.required]],
      autoRenew: [true]
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid && (!this.createSubscription || this.subscriptionForm.valid)) {
      this.loading = true;
      const clientData = this.clientForm.value;

      this.clientService.createClient(clientData).subscribe({
        next: async (client) => {
          if (this.createSubscription) {
            // Calcular datas de fim e renovação baseado no período
            const startDate = new Date(this.subscriptionForm.value.startDate);
            const period = this.subscriptionForm.value.period;
            let endDate: Date;
            let renewalDate: Date;

            if (period === SubscriptionPeriod.ONE_MONTH) {
              endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
              renewalDate = new Date(endDate);
            } else if (period === SubscriptionPeriod.THREE_MONTHS) {
              endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);
              renewalDate = new Date(endDate);
            } else { // ONE_YEAR
              endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
              renewalDate = new Date(endDate);
            }

            // Criar subscrição para o cliente
            const subscriptionData = {
              clientId: client.id,
              period: this.subscriptionForm.value.period,
              price: this.subscriptionForm.value.price,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              renewalDate: renewalDate.toISOString(),
              autoRenew: this.subscriptionForm.value.autoRenew
            };

            this.subscriptionService.createSubscription(subscriptionData).subscribe({
              next: (subscription) => {
                this.snackBar.open('Cliente e subscrição criados com sucesso!', 'Fechar', { duration: 3000 });
                this.dialogRef.close({ client, subscription });
              },
              error: (error) => {
                console.error('Erro ao criar subscrição:', error);
                this.snackBar.open('Cliente criado, mas erro na subscrição.', 'Fechar', { duration: 5000 });
                this.dialogRef.close(client); // Ainda retorna o cliente
              }
            });
          } else {
            this.snackBar.open('Cliente criado com sucesso!', 'Fechar', { duration: 3000 });
            this.dialogRef.close(client);
          }
        },
        error: (error) => {
          console.error('Erro ao criar cliente:', error);
          this.snackBar.open('Erro ao criar cliente. Verifique os dados.', 'Fechar', { duration: 5000 });
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
    const field = this.clientForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    if (field?.hasError('minlength')) {
      return 'Mínimo 2 caracteres';
    }
    if (field?.hasError('pattern')) {
      return 'Telefone inválido';
    }
    return '';
  }
}
