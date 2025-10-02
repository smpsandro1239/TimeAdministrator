import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule,
    MatChipsModule, MatProgressSpinnerModule
  ],
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent {
  displayedColumns: string[] = ['clientName', 'period', 'status', 'startDate', 'endDate', 'price', 'actions'];
  subscriptions: any[] = [
    {
      id: 1,
      clientId: 1,
      period: 1,
      status: 'Ativa',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15'),
      price: 29.99
    },
    {
      id: 2,
      clientId: 2,
      period: 12,
      status: 'A Expirar',
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-12-01'),
      price: 279.99
    },
    {
      id: 3,
      clientId: 3,
      period: 3,
      status: 'Expirada',
      startDate: new Date('2023-10-01'),
      endDate: new Date('2024-01-01'),
      price: 79.99
    }
  ];
  
  loading = false;
  totalSubscriptions = 3;
  pageSize = 10;

  getClientName(clientId: number): string {
    const clients: { [key: number]: string } = {
      1: 'João Silva',
      2: 'Maria Santos',
      3: 'Pedro Costa'
    };
    return clients[clientId] || 'Cliente Desconhecido';
  }

  getPeriodText(period: number): string {
    const periods: { [key: number]: string } = {
      1: '1 Mês',
      3: '3 Meses',
      6: '6 Meses',
      12: '1 Ano'
    };
    return periods[period] || `${period} Meses`;
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'Ativa': return 'primary';
      case 'A Expirar': return 'warn';
      case 'Expirada': return 'accent';
      default: return '';
    }
  }

  onSearchChange(value: string): void {
    // Implementar pesquisa
  }

  onPageChange(event: any): void {
    // Implementar paginação
  }

  addSubscription(): void {
    // Implementar adição de subscrição
  }

  editSubscription(subscription: any): void {
    // Implementar edição de subscrição
  }

  cancelSubscription(subscription: any): void {
    // Implementar cancelamento de subscrição
  }
}