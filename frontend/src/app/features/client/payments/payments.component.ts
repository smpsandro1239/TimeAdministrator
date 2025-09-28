import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { PaymentService } from '../../../services/payment.service';
import { Payment, PaymentStatus } from '../../../models/payment.model';
import { SubscriptionPeriodLabels } from '../../../models/subscription.model';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  loading = false;
  periodLabels = SubscriptionPeriodLabels;

  constructor(
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getMyPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar histórico de pagamentos:', err);
        this.snackBar.open(
          'Não foi possível carregar o seu histórico de pagamentos.',
          'Fechar',
          { duration: 3000 },
        );
        this.loading = false;
      },
    });
  }

  getStatusColor(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'primary';
      case PaymentStatus.PENDING:
      case PaymentStatus.PROCESSING:
        return 'accent';
      default:
        return 'warn';
    }
  }
}
