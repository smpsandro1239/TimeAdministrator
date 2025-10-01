import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-clients-simple',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="container">
        <div class="header">
          <div>
            <h1>Gestão de Clientes</h1>
            <p>{{ clients.length }} clientes registados</p>
          </div>
          <button mat-raised-button color="primary" (click)="addClient()">
            <mat-icon>add</mat-icon>
            Novo Cliente
          </button>
        </div>
        
        <mat-card>
          <mat-card-content>
            <div class="search-bar">
              <mat-form-field appearance="outline">
                <mat-label>Pesquisar clientes</mat-label>
                <input matInput (keyup)="applyFilter($event)" placeholder="Nome ou email">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </div>
            
            <table mat-table [dataSource]="clients" class="clients-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nome</th>
                <td mat-cell *matCellDef="let client">{{ client.name }}</td>
              </ng-container>
              
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let client">{{ client.email }}</td>
              </ng-container>
              
              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Telefone</th>
                <td mat-cell *matCellDef="let client">{{ client.phone || 'N/A' }}</td>
              </ng-container>
              
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let client">
                  <span class="status" [ngClass]="client.status">{{ getStatusText(client.status) }}</span>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Ações</th>
                <td mat-cell *matCellDef="let client">
                  <button mat-icon-button (click)="editClient(client)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteClient(client)" color="warn">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    h1 { margin: 0 0 8px 0; color: #333; font-size: 28px; }
    p { margin: 0; color: #666; }
    .search-bar { margin-bottom: 16px; }
    .search-bar mat-form-field { width: 300px; }
    .clients-table { width: 100%; }
    .status { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .status.active { background: #e8f5e8; color: #2e7d32; }
    .status.inactive { background: #ffebee; color: #c62828; }
    .status.pending { background: #fff3e0; color: #ef6c00; }
  `]
})
export class ClientsSimpleComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'status', 'actions'];
  clients = [
    { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '912345678', status: 'active' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '923456789', status: 'active' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', phone: null, status: 'inactive' },
    { id: 4, name: 'Ana Ferreira', email: 'ana@email.com', phone: '934567890', status: 'pending' },
    { id: 5, name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '945678901', status: 'active' }
  ];
  
  constructor(private snackBar: MatSnackBar) {}
  
  ngOnInit(): void {}
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    // TODO: Implementar filtro real
    console.log('Filtrar por:', filterValue);
  }
  
  addClient(): void {
    this.snackBar.open('Funcionalidade: Adicionar cliente em desenvolvimento', 'Fechar', { duration: 3000 });
  }
  
  editClient(client: any): void {
    this.snackBar.open(`Editar cliente: ${client.name}`, 'Fechar', { duration: 3000 });
  }
  
  deleteClient(client: any): void {
    this.snackBar.open(`Eliminar cliente: ${client.name}`, 'Fechar', { duration: 3000 });
  }
  
  getStatusText(status: string): string {
    switch(status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return status;
    }
  }
}