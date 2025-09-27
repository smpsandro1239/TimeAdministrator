import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';

import { SubscriptionService } from '../../../services/subscription.service';
import { ClientService } from '../../../services/client.service';
import { Subscription } from '../../../models/subscription.model';
import { Client } from '../../../models/client.model';
import { PaginatedResponse, PaginationParams } from '../../../models/common.model';
import { AddSubscriptionDialogComponent } from './add-subscription-dialog/add-subscription-dialog.component';
import { EditSubscriptionDialogComponent } from './edit-subscription-dialog/edit-subscription-dialog.component';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule
  ],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit {
  displayedColumns: string[] = ['clientName', 'period', 'status', 'startDate', 'endDate', 'price', 'actions'];
  subscriptions: Subscription[] = [];
  clients: Client[] = [];
  loading = false;
  totalSubscriptions = 0;
  pageSize = 10;
  currentPage = 0;
  searchTerm = '';

  constructor(
    private subscriptionService: SubscriptionService,
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSubscriptions();
    this.loadClients();
  }

  loadSubscriptions(): void {
    this.loading = true;
    const params: PaginationParams = {
      page: this.currentPage + 1,
      limit: this.pageSize,
      search: this.searchTerm || undefined
    };

    this.subscriptionService.getSubscriptions(params).subscribe({
      next: (response: PaginatedResponse<Subscription>) => {
        this.subscriptions = response.data;
        this.totalSubscriptions = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar subscrições:', error);
        this.snackBar.open('Erro ao carregar subscrições', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadClients(): void {
    this.clientService.getClients({ page: 1, limit: 1000 }).subscribe({
      next: (response: PaginatedResponse<Client>) => {
        this.clients = response.data;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSubscriptions();
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 0;
    this.loadSubscriptions();
  }

  addSubscription(): void {
    const dialogRef = this.dialog.open(AddSubscriptionDialogComponent, {
      width: '700px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSubscriptions(); // Reload the list after adding a subscription
      }
    });
  }

  editSubscription(subscription: Subscription): void {
    const dialogRef = this.dialog.open(EditSubscriptionDialogComponent, {
      width: '700px',
      disableClose: true,
      data: { subscription }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSubscriptions(); // Reload the list after editing a subscription
      }
    });
  }

  cancelSubscription(subscription: Subscription): void {
    if (confirm(`Tem certeza que deseja cancelar a subscrição de ${this.getClientName(subscription.clientId)}?`)) {
      this.subscriptionService.cancelSubscription(subscription.id).subscribe({
        next: () => {
          this.snackBar.open('Subscrição cancelada com sucesso', 'Fechar', { duration: 3000 });
          this.loadSubscriptions();
        },
        error: (error: any) => {
          console.error('Erro ao cancelar subscrição:', error);
          this.snackBar.open('Erro ao cancelar subscrição', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  getClientName(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente não encontrado';
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'primary';
      case 'pending': return 'accent';
      case 'expired': return 'warn';
      case 'cancelled': return 'warn';
      default: return '';
    }
  }

  getPeriodText(period: string): string {
    switch (period) {
      case 'ONE_YEAR': return '1 Ano';
      case 'THREE_MONTHS': return '3 Meses';
      default: return period;
    }
  }
}
