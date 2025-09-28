import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { environment } from '@env/environment';
import { SubscriptionPlan } from '../../../models/plan.model';
import { SubscriptionPeriod } from '../../../models/subscription.model';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-new-subscription',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './new-subscription.component.html',
  styleUrl: './new-subscription.component.scss',
})
export class NewSubscriptionComponent implements OnInit {
  @ViewChild('paymentElement') paymentElementRef?: ElementRef;

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
  isLoading = false; // Loading geral ou para seleção de plano
  isProcessingPayment = false; // Loading específico para o pagamento

  private stripe: Stripe | null = null;
  private elements?: StripeElements;

  constructor(
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe(environment.stripePublishableKey);
  }

  selectPlan(plan: SubscriptionPlan): void {
    if (this.isLoading) return;

    this.selectedPlan = plan;
    this.isLoading = true;

    this.paymentService
      .createPaymentIntent({
        subscriptionPeriod: plan.period,
        amount: plan.price,
      })
      .subscribe({
        next: (response) => {
          this.setupStripeElements(response.clientSecret);
          this.isLoading = false;
        },
        error: (err) => {
          this.snackBar.open('Falha ao preparar o pagamento. Tente novamente.', 'Fechar', { duration: 3000 });
          this.isLoading = false;
          this.selectedPlan = null;
        },
      });
  }

  private setupStripeElements(clientSecret: string): void {
    if (!this.stripe) return;

    this.elements = this.stripe.elements({ clientSecret, appearance: { theme: 'stripe' } });
    const paymentElement = this.elements.create('payment');

    // Usamos um ChangeDetectorRef para garantir que o DOM é atualizado antes de montar o elemento
    this.cdr.detectChanges();
    if (this.paymentElementRef) {
      paymentElement.mount(this.paymentElementRef.nativeElement);
    }
  }

  async processPayment(): Promise<void> {
    if (this.isProcessingPayment || !this.stripe || !this.elements) {
      return;
    }

    this.isProcessingPayment = true;

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        // URL para onde o cliente será redirecionado após o pagamento.
        // O estado do pagamento será verificado no backend via webhooks.
        return_url: `${window.location.origin}/client/subscription?payment_success=true`,
      },
    });

    // Este código só é executado se houver um erro imediato.
    // Caso contrário, o utilizador é redirecionado.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      this.snackBar.open(error.message || 'Ocorreu um erro com o seu cartão.', 'Fechar', { duration: 5000 });
    } else {
      this.snackBar.open('Ocorreu um erro inesperado. Tente novamente.', 'Fechar', { duration: 5000 });
    }

    this.isProcessingPayment = false;
  }
}
