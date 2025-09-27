import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { ClientService } from '../../../services/client.service';
import { SubscriptionService } from '../../../services/subscription.service';
import { AuthService } from '../../../services/auth.service';
import { Client } from '../../../models/client.model';
import { Subscription } from '../../../models/subscription.model';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent implements OnInit {
  client: Client | null = null;
  subscription: Subscription | null = null;
  loading = false;

  constructor(
    private clientService: ClientService,
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClientProfile();
  }

  private loadClientProfile(): void {
    this.loading = true;

    this.clientService.getMyProfile().subscribe({
      next: (client) => {
        this.client = client;
        this.loadSubscription();
      },
      error: (error) => {
        console.error('Erro ao carregar perfil do cliente:', error);
        this.snackBar.open('Erro ao carregar dados do perfil', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  private loadSubscription(): void {
    if (!this.client?.id) {
      this.loading = false;
      return;
    }

    this.subscriptionService.getClientSubscriptions(this.client.id).subscribe({
      next: (subscriptions) => {
        // Get the most recent active subscription
        this.subscription = subscriptions.find(sub => sub.status === 'active') || subscriptions[0] || null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar subscrição:', error);
        this.snackBar.open('Erro ao carregar dados da subscrição', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getSubscriptionStatus(): string {
    if (!this.subscription) return 'Sem subscrição';

    const now = new Date();
    const endDate = new Date(this.subscription.endDate);

    if (this.subscription.status === 'cancelled') return 'Cancelada';
    if (this.subscription.status === 'expired' || endDate < now) return 'Expirada';
    if (this.subscription.status === 'pending') return 'Pendente';
    if (this.subscription.status === 'active' && endDate.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) return 'Expirando em breve';

    return 'Ativa';
  }

  getStatusColor(): string {
    const status = this.getSubscriptionStatus();
    switch (status) {
      case 'Ativa': return 'primary';
      case 'Expirando em breve': return 'accent';
      case 'Expirada': return 'warn';
      case 'Inativa': return 'warn';
      default: return '';
    }
  }

  renewSubscription(): void {
    // TODO: Implement subscription renewal
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 2000 });
  }

  upgradeSubscription(): void {
    // TODO: Implement subscription upgrade
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 2000 });
  }

  cancelSubscription(): void {
    if (confirm('Tem certeza que deseja cancelar sua subscrição?')) {
      // TODO: Implement subscription cancellation
      this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 2000 });
    }
  }
}
