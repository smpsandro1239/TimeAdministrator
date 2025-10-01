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
import { AddClientDialogComponent } from './add-client-dialog/add-client-dialog.component';
import { EditClientDialogComponent } from './edit-client-dialog/edit-client-dialog.component';
import { ViewClientDialogComponent } from './view-client-dialog/view-client-dialog.component';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

import * as XLSX from 'xlsx';

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
    MatFormFieldModule,
    LayoutComponent
  ],
  template: `
    <app-layout>
    <div class="page-container">
      <div class="header">
        <h1>Gestão de Clientes</h1>
        <p>Gerir todos os clientes do sistema</p>
        <button mat-raised-button color="primary" (click)="addClient()">
          <mat-icon>add</mat-icon>
          Novo Cliente
        </button>
      </div>
      
      <mat-card>
        <mat-card-content>
          <div class="empty-state">
            <mat-icon>people</mat-icon>
            <h2>Lista de Clientes</h2>
            <p>Funcionalidade em desenvolvimento</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    </app-layout>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header h1 { margin: 0; color: #333; }
    .header p { margin: 8px 0 0 0; color: #666; }
    .empty-state { text-align: center; padding: 48px; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; color: #666; margin-bottom: 16px; }
    .empty-state h2 { margin: 0 0 8px 0; color: #333; }
    .empty-state p { margin: 0; color: #666; }
  `]
})
export class ClientsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'subscriptionStatus', 'daysRemaining', 'actions'];
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
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  editClient(client: Client): void {
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  deleteClient(client: Client): void {
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  viewClient(client: Client): void {
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  getDaysRemaining(client: Client): number {
    if (!client.subscriptionEndDate) {
      return -1; // No subscription
    }

    const endDate = new Date(client.subscriptionEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  getDaysRemainingText(client: Client): string {
    const days = this.getDaysRemaining(client);

    if (days === -1) {
      return 'Sem subscrição';
    } else if (days < 0) {
      return 'Expirada';
    } else if (days === 0) {
      return 'Expira hoje';
    } else if (days === 1) {
      return '1 dia';
    } else {
      return `${days} dias`;
    }
  }

  getDaysRemainingClass(client: Client): string {
    const days = this.getDaysRemaining(client);

    if (days === -1) {
      return 'no-subscription';
    } else if (days < 0) {
      return 'expired-red'; // Vermelho para expirado
    } else if (days <= 30) {
      return 'warning-orange'; // Laranja para 0-30 dias
    } else if (days <= 60) {
      return 'warning-yellow'; // Amarelo para 30-60 dias
    } else {
      return 'active-green'; // Verde para >60 dias
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      // Assume que os dados estão na primeira planilha
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      this.processExcelData(jsonData);
    };
    fileReader.readAsArrayBuffer(file);
  }

  private processExcelData(data: any[]): void {
    if (data.length < 2) {
      this.snackBar.open('Arquivo Excel deve conter pelo menos cabeçalhos e uma linha de dados', 'Fechar', { duration: 5000 });
      return;
    }

    const headers = data[0];
    const rows = data.slice(1);

    // Mapeamento esperado: Nome, Email, Telefone, Notas
    const expectedHeaders = ['nome', 'email', 'telefone', 'notas'];
    const normalizedHeaders = headers.map((h: string) => h?.toString().toLowerCase().trim());

    // Verificar se os cabeçalhos estão presentes
    const hasRequiredHeaders = expectedHeaders.some(expected =>
      normalizedHeaders.includes(expected)
    );

    if (!hasRequiredHeaders) {
      this.snackBar.open('Arquivo deve conter colunas: Nome, Email, Telefone (opcional), Notas (opcional)', 'Fechar', { duration: 5000 });
      return;
    }

    const clientsToCreate: any[] = [];
    const errors: string[] = [];

    rows.forEach((row: any[], index: number) => {
      const rowData = {
        name: this.getCellValue(row, normalizedHeaders.indexOf('nome')),
        email: this.getCellValue(row, normalizedHeaders.indexOf('email')),
        phone: this.getCellValue(row, normalizedHeaders.indexOf('telefone')),
        notes: this.getCellValue(row, normalizedHeaders.indexOf('notas'))
      };

      // Validações básicas
      if (!rowData.name || !rowData.email) {
        errors.push(`Linha ${index + 2}: Nome e Email são obrigatórios`);
        return;
      }

      if (!this.isValidEmail(rowData.email)) {
        errors.push(`Linha ${index + 2}: Email inválido - ${rowData.email}`);
        return;
      }

      clientsToCreate.push({
        name: rowData.name,
        email: rowData.email,
        phone: rowData.phone || undefined,
        notes: rowData.notes || undefined
      });
    });

    if (errors.length > 0) {
      this.snackBar.open(`Erros encontrados: ${errors.slice(0, 3).join('; ')}`, 'Fechar', { duration: 10000 });
      return;
    }

    if (clientsToCreate.length === 0) {
      this.snackBar.open('Nenhum cliente válido encontrado no arquivo', 'Fechar', { duration: 5000 });
      return;
    }

    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  private getCellValue(row: any[], index: number): string {
    return index >= 0 && row[index] ? row[index].toString().trim() : '';
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private importClients(clients: any[]): void {
    this.loading = true;
    let successCount = 0;
    let errorCount = 0;

    const importPromises = clients.map(client =>
      this.clientService.createClient(client).toPromise()
        .then(() => successCount++)
        .catch(() => errorCount++)
    );

    Promise.allSettled(importPromises).then(() => {
      this.loading = false;
      this.loadClients(); // Recarregar lista

      if (errorCount === 0) {
        this.snackBar.open(`${successCount} cliente(s) importado(s) com sucesso!`, 'Fechar', { duration: 5000 });
      } else {
        this.snackBar.open(`${successCount} importado(s), ${errorCount} erro(s)`, 'Fechar', { duration: 5000 });
      }
    });
  }

  manageSubscription(client: Client): void {
    // TODO: Implementar gestão de subscrição
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  viewPayments(client: Client): void {
    // TODO: Implementar visualização de pagamentos
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  sendNotification(client: Client): void {
    // TODO: Implementar envio de notificação
    this.snackBar.open('Funcionalidade em desenvolvimento', 'Fechar', { duration: 3000 });
  }

  private sanitizeText(text: string): string {
    if (!text) return '';
    return text.replace(/[<>"'&]/g, (match) => {
      const escapeMap: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return escapeMap[match];
    });
  }
}
