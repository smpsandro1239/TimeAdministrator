import { Component } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { loadStripe, Stripe } from '@stripe/stripe-js';

import { SubscriptionPlan } from '../../../models/plan.model';
import { SubscriptionPeriod } from '../../../models/subscription.model';
import { PaymentService } from '../../../services/payment.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-new-subscription',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './new-subscription.component.html',
  styleUrl: './new-subscription.component.scss'
})
export class NewSubscriptionComponent {
export class NewSubscriptionComponent implements OnInit {
  plans: SubscriptionPlan[] = [
    {
      period: SubscriptionPeriod.ONE_MONTH,
      name: 'Mensal',
      price: 29.99,
      description: 'Acesso completo por 1 mês.',
    },
    {
      period: SubscriptionPeriod.THREE_MONTHS,
      name: 'Trimestral',
      price: 79.99,
      description: 'Acesso completo por 3 meses.',
      discount: 'Poupe 11%',
    },
    {
      period: SubscriptionPeriod.SIX_MONTHS,
      name: 'Semestral',
      price: 149.99,
      description: 'Acesso completo por 6 meses.',
      discount: 'Poupe 17%',
    },
    {
      period: SubscriptionPeriod.ONE_YEAR,
      name: 'Anual',
      price: 279.99,
      description: 'Acesso completo por 1 ano.',
      discount: 'Poupe 22%',
    },
  ];

  selectedPlan: SubscriptionPlan | null = null;
  isLoading = false;
  private stripe: Stripe | null = null;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  async ngOnInit(): Promise<void> {
    // Carrega a instância do Stripe com a chave publicável do ambiente
    this.stripe = await loadStripe(environment.stripePublishableKey);
  }

  selectPlan(plan: SubscriptionPlan): void {
    this.selectedPlan = plan;
    this.initiatePayment(plan);
  }

  initiatePayment(plan: SubscriptionPlan): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.clientId) {
      this.snackBar.open('Erro: Utilizador não associado a um cliente.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.paymentService.createStripePaymentIntent({
      clientId: currentUser.clientId,
      amount: plan.price,
      subscriptionPeriod: plan.period,
    }).subscribe({
      next: (response) => {
        // TODO: Redirecionar para uma página de checkout do Stripe ou usar Stripe Elements.
        // Por agora, simulamos o sucesso.
        this.snackBar.open(`Pagamento para o plano ${plan.name} iniciado!`, 'Fechar', { duration: 3000 });
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Falha ao iniciar o pagamento. Tente novamente.', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}
