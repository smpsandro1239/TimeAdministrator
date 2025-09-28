import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
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
import { CancelSubscriptionDialogComponent } from './cancel-subscription-dialog.component';
import { SubscriptionDisplayItem } from './subscription-display.model';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [
    MatDialogModule,
    RouterLink,
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
  isRenewing = false;
  isCancelling = false;

  constructor(
    private clientService: ClientService,
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
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

  /**
   * Obtém o estado da subscrição, incluindo o texto e a cor para a UI.
   * Este método prioriza o estado vindo do backend e adiciona lógica de UI,
   * como o aviso de expiração.
   * @returns Um objeto com o texto do estado e a cor correspondente.
   */
  getSubscriptionStatus(): { text: string; color: 'primary' | 'accent' | 'warn' | '' } {
    if (!this.subscription) {
      return { text: 'Sem subscrição', color: '' };
    }

    const now = new Date().getTime();
    const endDate = new Date(this.subscription.endDate).getTime();
    const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

    // Prioriza os estados finais ou pendentes vindos do backend.
    switch (this.subscription.status) {
      case 'cancelled':
        return { text: 'Cancelada', color: 'warn' };
      case 'expired':
        return { text: 'Expirada', color: 'warn' };
      case 'pending':
        return { text: 'Pendente', color: 'accent' };
    }

    // Se o estado for 'active', verificamos a proximidade da data de expiração.
    if (this.subscription.status === 'active') {
      // Fallback caso o backend ainda não tenha atualizado o estado para 'expired'.
      if (endDate < now) {
        return { text: 'Expirada', color: 'warn' };
      }
      // Se expira em menos de 30 dias, mostra um aviso.
      if (endDate - now < THIRTY_DAYS_IN_MS) {
        return { text: 'Expirando em breve', color: 'accent' };
      }
      // Caso contrário, está simplesmente ativa.
      return { text: 'Ativa', color: 'primary' };
    }

    // Caso padrão para qualquer outro estado inesperado.
    return {
      text: this.subscription.status.charAt(0).toUpperCase() + this.subscription.status.slice(1),
      color: ''
    }
  }

  /**
   * Transforma os dados da subscrição num formato de exibição mais simples para o template.
   * @returns Um array de itens de exibição da subscrição.
   */
  getSubscriptionDetailsForDisplay(): SubscriptionDisplayItem[] {
    if (!this.subscription) {
      return [];
    }

    const details: SubscriptionDisplayItem[] = [
      { label: 'Plano', value: this.subscription.period },
      { label: 'Valor', value: `€${this.subscription.price.toFixed(2)}` },
      { label: 'Data de início', value: this.subscription.startDate, isDate: true },
      { label: 'Data de término', value: this.subscription.endDate, isDate: true },
      { label: 'Próxima renovação', value: this.subscription.renewalDate, isDate: true },
    ];

    if (this.subscription.notes) {
      details.push({ label: 'Observações', value: this.subscription.notes });
    }

    return details;
  }

  renewSubscription(): void {
    // TODO: Implementar a lógica de pagamento (Stripe) antes de renovar.
    // Por agora, esta funcionalidade será um placeholder.
    this.snackBar.open('A renovação automática via Stripe será implementada em breve.', 'Fechar', { duration: 3000 });
  }

  upgradeSubscription(): void {
    // Redireciona o utilizador para a página de seleção de novos planos.
    this.router.navigate(['/client/new-subscription']);
  }

  cancelSubscription(): void {
    if (!this.subscription) return;

    const dialogRef = this.dialog.open(CancelSubscriptionDialogComponent, {
      width: '450px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // O diálogo retorna 'true' se o utilizador confirmar.
      if (result && this.subscription) {
        this.isCancelling = true;
        this.subscriptionService.cancel(this.subscription.id).subscribe({
          next: (updatedSubscription) => {
            this.snackBar.open('Subscrição cancelada com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            // Atualiza o objeto local e recarrega os dados para garantir consistência.
            this.subscription = updatedSubscription;
            this.loadClientProfile();
          },
          error: (err) => {
            console.error('Erro ao cancelar a subscrição:', err);
            this.snackBar.open(
              'Não foi possível cancelar a subscrição. Tente novamente.',
              'Fechar',
              { duration: 3000, panelClass: ['error-snackbar'] }
            );
          },
          complete: () => {
            this.isCancelling = false;
          },
        });
      }
    });
  }
}
