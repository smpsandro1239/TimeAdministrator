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

import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';
import { PaginatedResponse, PaginationParams } from '../../../models/common.model';

@Component({
  selector: 'app-clients',
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
    MatFormFieldModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'subscriptionStatus', 'actions'];
  clients: Client[] = [];
  loading = false;
  totalClients = 0;
  pageSize = 10;
  currentPage = 0;
  searchTerm = '';

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    const params: PaginationParams = {
      page: this.currentPage + 1, // API usa 1-based indexing
      limit: this.pageSize,
      search: this.searchTerm || undefined
    };

    this.clientService.getClients(params).subscribe({
      next: (response: PaginatedResponse<Client>) => {
        this.clients = response.data;
        this.totalClients = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.snackBar.open('Erro ao carregar clientes', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClients();
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 0; // Reset to first page
    this.loadClients();
  }

  addClient(): void {
    // TODO: Implement add client dialog
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 2000 });
  }

  editClient(client: Client): void {
    // TODO: Implement edit client dialog
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 2000 });
  }

  deleteClient(client: Client): void {
    if (confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      this.clientService.deleteClient(client.id).subscribe({
        next: () => {
          this.snackBar.open('Cliente excluído com sucesso', 'Fechar', { duration: 3000 });
          this.loadClients(); // Reload the list
        },
        error: (error) => {
          console.error('Erro ao excluir cliente:', error);
          this.snackBar.open('Erro ao excluir cliente', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  viewClient(client: Client): void {
    // TODO: Implement view client details
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 2000 });
  }
}
