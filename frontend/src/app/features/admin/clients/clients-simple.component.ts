import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-clients-simple',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatDialogModule, MatSelectModule, MatTooltipModule, FormsModule, LayoutComponent],
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
            <div class="toolbar">
              <div class="search-bar">
                <mat-form-field appearance="outline">
                  <mat-label>Pesquisar clientes</mat-label>
                  <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Nome ou email">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
              
              <div class="filters">
                <mat-form-field appearance="outline">
                  <mat-label>Estado</mat-label>
                  <mat-select [(value)]="statusFilter" (selectionChange)="applyFilter()">
                    <mat-option value="all">Todos</mat-option>
                    <mat-option value="active">Ativo</mat-option>
                    <mat-option value="inactive">Inativo</mat-option>
                    <mat-option value="pending">Pendente</mat-option>
                  </mat-select>
                </mat-form-field>
                
                <button mat-stroked-button (click)="exportData()" matTooltip="Exportar dados filtrados">
                  <mat-icon>download</mat-icon>
                  Exportar
                </button>
                
                <input #fileInput type="file" accept=".csv,.xlsx" (change)="importData($event)" style="display: none">
                <button mat-stroked-button (click)="fileInput.click()" matTooltip="Importar clientes">
                  <mat-icon>upload</mat-icon>
                  Importar
                </button>
                
                <button mat-stroked-button (click)="refreshData()" matTooltip="Actualizar dados">
                  <mat-icon>refresh</mat-icon>
                  Actualizar
                </button>
              </div>
            </div>
            
            <div class="results-info" *ngIf="searchTerm || statusFilter !== 'all'">
              <span>A mostrar {{ filteredClients.length }} de {{ clients.length }} clientes</span>
              <button mat-button (click)="clearFilters()" *ngIf="searchTerm || statusFilter !== 'all'">
                <mat-icon>clear</mat-icon>
                Limpar filtros
              </button>
            </div>
            
            <table mat-table [dataSource]="filteredClients" class="clients-table">
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
              
              <ng-container matColumnDef="notifications">
                <th mat-header-cell *matHeaderCellDef>Notificações</th>
                <td mat-cell *matCellDef="let client">
                  <div class="notification-icons">
                    <mat-icon class="notification-icon" [ngClass]="{enabled: client.notificationPreferences?.email}" matTooltip="Email">email</mat-icon>
                    <mat-icon class="notification-icon" [ngClass]="{enabled: client.notificationPreferences?.whatsapp}" matTooltip="WhatsApp">chat</mat-icon>
                    <mat-icon class="notification-icon" [ngClass]="{enabled: client.notificationPreferences?.telegram}" matTooltip="Telegram">send</mat-icon>
                  </div>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="daysLeft">
                <th mat-header-cell *matHeaderCellDef>Dias</th>
                <td mat-cell *matCellDef="let client" class="days-cell">
                  <span class="days-left" [ngClass]="getDaysLeftClass(client)">{{ getDaysLeftText(client) }}</span>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Ações</th>
                <td mat-cell *matCellDef="let client">
                  <button mat-icon-button (click)="viewClient(client)" matTooltip="Ver detalhes">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button (click)="editClient(client)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="toggleStatus(client)" [matTooltip]="client.status === 'active' ? 'Desativar' : 'Ativar'">
                    <mat-icon>{{ client.status === 'active' ? 'toggle_on' : 'toggle_off' }}</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteClient(client)" color="warn" matTooltip="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="viewClient(row)" class="clickable-row"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styles: [`
    .container { padding: 16px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 16px; }
    h1 { margin: 0 0 8px 0; color: #1976d2; font-size: 28px; }
    p { margin: 0; color: #666; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 8px; flex-wrap: wrap; }
    .search-bar mat-form-field { width: 300px; }
    .filters { display: flex; gap: 16px; }
    .filters mat-form-field { width: 150px; }
    .results-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 8px 16px; background: #f8f9fa; border-radius: 4px; font-size: 14px; color: #666; }
    .clients-table { width: 100%; }
    .status { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .status.active { background: #e8f5e8; color: #2e7d32; }
    .status.inactive { background: #ffebee; color: #c62828; }
    .status.pending { background: #fff3e0; color: #ef6c00; }
    .days-cell { text-align: center; }
    .days-left { padding: 4px 6px; border-radius: 8px; font-size: 13px; font-weight: 600; min-width: 30px; display: inline-block; text-align: center; }
    .days-left.critical { background: #ffebee; color: #c62828; }
    .days-left.warning { background: #fff3e0; color: #ef6c00; }
    .days-left.caution { background: #fffde7; color: #f57f17; }
    .days-left.safe { background: #e8f5e8; color: #2e7d32; }
    .days-left.expired { background: #f3e5f5; color: #7b1fa2; }
    .notification-icons { display: flex; gap: 4px; }
    .notification-icon { font-size: 16px; width: 16px; height: 16px; color: #ccc; }
    .notification-icon.enabled { color: #1976d2; }
    .clickable-row { cursor: pointer; }
    .clickable-row:hover { background: #f5f5f5; }
    
    @media (max-width: 768px) {
      .container { padding: 8px; }
      .header { flex-direction: column; align-items: stretch; gap: 12px; }
      .header button { width: 100%; }
      .toolbar { flex-direction: column; align-items: stretch; gap: 12px; }
      .search-bar mat-form-field { width: 100%; }
      .filters { flex-wrap: wrap; justify-content: space-between; }
      .filters mat-form-field { width: calc(50% - 8px); min-width: 120px; }
      .filters button { flex: 1; min-width: 80px; }
      .clients-table { font-size: 14px; }
      .notification-icons { flex-direction: column; gap: 2px; }
      .notification-icon { font-size: 14px; width: 14px; height: 14px; }
    }
    
    @media (max-width: 480px) {
      .filters mat-form-field { width: 100%; }
      .filters { flex-direction: column; }
      .filters button { width: 100%; margin-bottom: 8px; }
      .clients-table { font-size: 12px; }
      .days-left { font-size: 11px; padding: 2px 4px; }
      .status { font-size: 10px; padding: 2px 6px; }
    }
    
    /* Estilos globais para diálogos responsivos */
    :host ::ng-deep .responsive-dialog {
      width: 95vw !important;
      max-height: 90vh !important;
    }
    
    :host ::ng-deep .responsive-dialog .mat-mdc-dialog-container {
      padding: 16px !important;
    }
    
    @media (max-width: 768px) {
      :host ::ng-deep .responsive-dialog {
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        max-height: none !important;
      }
      
      :host ::ng-deep .responsive-dialog .mat-mdc-dialog-container {
        padding: 8px !important;
        border-radius: 0 !important;
      }
    }
  `]
})
export class ClientsSimpleComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'status', 'notifications', 'daysLeft', 'actions'];
  clients = [
    { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '912345678', status: 'active', subscriptionEnd: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), notificationPreferences: { email: true, whatsapp: true, telegram: false } },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '923456789', status: 'active', subscriptionEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), notificationPreferences: { email: true, whatsapp: false, telegram: true } },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', phone: null, status: 'inactive', subscriptionEnd: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), notificationPreferences: { email: false, whatsapp: false, telegram: false } },
    { id: 4, name: 'Ana Ferreira', email: 'ana@email.com', phone: '934567890', status: 'pending', subscriptionEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), notificationPreferences: { email: true, whatsapp: true, telegram: true } },
    { id: 5, name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '945678901', status: 'active', subscriptionEnd: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), notificationPreferences: { email: true, whatsapp: false, telegram: false } },
    { id: 6, name: 'Luísa Pereira', email: 'luisa@email.com', phone: '956789012', status: 'active', subscriptionEnd: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), notificationPreferences: { email: false, whatsapp: true, telegram: true } },
    { id: 7, name: 'Rui Martins', email: 'rui@email.com', phone: null, status: 'pending', subscriptionEnd: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), notificationPreferences: { email: true, whatsapp: false, telegram: false } },
    { id: 8, name: 'Sofia Rodrigues', email: 'sofia@email.com', phone: '967890123', status: 'inactive', subscriptionEnd: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), notificationPreferences: { email: false, whatsapp: false, telegram: true } }
  ];
  filteredClients = [...this.clients];
  searchTerm = '';
  statusFilter = 'all';
  
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}
  
  ngOnInit(): void {
    this.applyFilter();
  }
  
  applyFilter(): void {
    this.filteredClients = this.clients.filter(client => {
      const matchesSearch = !this.searchTerm || 
        client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || client.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }
  
  addClient(): void {
    import('./add-client-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.AddClientDialogComponent, {
        width: '95vw',
        maxWidth: '600px',
        maxHeight: '90vh',
        disableClose: true,
        panelClass: 'responsive-dialog'
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const newClient = {
            id: Math.max(...this.clients.map(c => c.id)) + 1,
            ...result
          };
          this.clients.push(newClient);
          this.applyFilter();
          this.snackBar.open(`Cliente ${result.name} adicionado`, 'Fechar', { duration: 2000 });
        }
      });
    });
  }
  
  viewClient(client: any): void {
    import('./view-client-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.ViewClientDialogComponent, {
        width: '95vw',
        maxWidth: '700px',
        maxHeight: '90vh',
        data: { client },
        panelClass: 'responsive-dialog'
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result?.action === 'edit') {
          this.editClient(result.client);
        } else if (result?.action === 'subscription') {
          this.snackBar.open('Gerir subscrição: Em desenvolvimento', 'Fechar', { duration: 2000 });
        } else if (result?.action === 'payments') {
          this.snackBar.open('Ver pagamentos: Em desenvolvimento', 'Fechar', { duration: 2000 });
        }
      });
    });
  }
  
  editClient(client: any): void {
    import('./edit-client-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.EditClientDialogComponent, {
        width: '95vw',
        maxWidth: '600px',
        maxHeight: '90vh',
        data: { client },
        panelClass: 'responsive-dialog'
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const index = this.clients.findIndex(c => c.id === client.id);
          if (index > -1) {
            this.clients[index] = result;
            this.applyFilter();
            this.snackBar.open(`Cliente ${result.name} actualizado`, 'Fechar', { duration: 2000 });
          }
        }
      });
    });
  }
  
  toggleStatus(client: any): void {
    const newStatus = client.status === 'active' ? 'inactive' : 'active';
    client.status = newStatus;
    this.snackBar.open(`${client.name} ${newStatus === 'active' ? 'ativado' : 'desativado'}`, 'Fechar', { duration: 2000 });
    this.applyFilter();
  }
  
  deleteClient(client: any): void {
    import('./confirm-delete-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.ConfirmDeleteDialogComponent, {
        width: '95vw',
        maxWidth: '450px',
        data: { client },
        panelClass: 'responsive-dialog'
      });
      
      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          const index = this.clients.findIndex(c => c.id === client.id);
          if (index > -1) {
            this.clients.splice(index, 1);
            this.snackBar.open(`${client.name} eliminado`, 'Fechar', { duration: 2000 });
            this.applyFilter();
          }
        }
      });
    });
  }
  
  exportData(): void {
    const csvData = this.filteredClients.map(client => ({
      Nome: client.name,
      Email: client.email,
      Telefone: client.phone || 'N/A',
      Estado: this.getStatusText(client.status)
    }));
    
    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.snackBar.open('Dados exportados com sucesso', 'Fechar', { duration: 2000 });
  }
  
  private convertToCSV(data: any[]): string {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  }
  
  refreshData(): void {
    this.snackBar.open('Dados actualizados', 'Fechar', { duration: 1500 });
    this.applyFilter();
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.applyFilter();
    this.snackBar.open('Filtros limpos', 'Fechar', { duration: 1500 });
  }
  
  getDaysLeft(client: any): number {
    if (!client.subscriptionEnd) return -999;
    const today = new Date();
    const endDate = new Date(client.subscriptionEnd);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  getDaysLeftText(client: any): string {
    const days = this.getDaysLeft(client);
    if (days < -365) return '--';
    return days.toString();
  }
  
  getDaysLeftClass(client: any): string {
    const days = this.getDaysLeft(client);
    if (days < -365) return 'expired';
    if (days < 0) return 'expired';
    if (days <= 3) return 'critical';
    if (days <= 15) return 'warning';
    if (days <= 30) return 'caution';
    return 'safe';
  }
  
  importData(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        let imported = 0;
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= 3 && values[0] && values[1]) {
            const newClient = {
              id: Math.max(...this.clients.map(c => c.id)) + 1,
              name: values[0].trim(),
              email: values[1].trim(),
              phone: values[2]?.trim() || null,
              status: 'pending',
              subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              notificationPreferences: { email: true, whatsapp: false, telegram: false }
            };
            this.clients.push(newClient);
            imported++;
          }
        }
        
        this.applyFilter();
        this.snackBar.open(`${imported} clientes importados`, 'Fechar', { duration: 2000 });
      } catch (error) {
        this.snackBar.open('Erro ao importar ficheiro', 'Fechar', { duration: 2000 });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
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