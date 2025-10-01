import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-subscriptions-simple',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatSelectModule, MatTooltipModule, FormsModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="container">
        <div class="header">
          <div>
            <h1>Gestão de Subscrições</h1>
            <p>{{ subscriptions.length }} subscrições registadas</p>
          </div>
          <button mat-raised-button color="primary" (click)="addSubscription()">
            <mat-icon>add</mat-icon>
            Nova Subscrição
          </button>
        </div>
        
        <mat-card>
          <mat-card-content>
            <div class="toolbar">
              <div class="search-bar">
                <mat-form-field appearance="outline">
                  <mat-label>Pesquisar subscrições</mat-label>
                  <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Cliente ou email">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
              
              <div class="filters">
                <mat-form-field appearance="outline">
                  <mat-label>Estado</mat-label>
                  <mat-select [(value)]="statusFilter" (selectionChange)="applyFilter()">
                    <mat-option value="all">Todos</mat-option>
                    <mat-option value="active">Ativa</mat-option>
                    <mat-option value="expired">Expirada</mat-option>
                    <mat-option value="cancelled">Cancelada</mat-option>
                  </mat-select>
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Plano</mat-label>
                  <mat-select [(value)]="planFilter" (selectionChange)="applyFilter()">
                    <mat-option value="all">Todos</mat-option>
                    <mat-option value="monthly">Mensal</mat-option>
                    <mat-option value="quarterly">Trimestral</mat-option>
                    <mat-option value="biannual">Semestral</mat-option>
                    <mat-option value="annual">Anual</mat-option>
                  </mat-select>
                </mat-form-field>
                
                <button mat-stroked-button (click)="exportData()" matTooltip="Exportar dados">
                  <mat-icon>download</mat-icon>
                  Exportar
                </button>
              </div>
            </div>
            
            <div class="results-info" *ngIf="searchTerm || statusFilter !== 'all' || planFilter !== 'all'">
              <span>A mostrar {{ filteredSubscriptions.length }} de {{ subscriptions.length }} subscrições</span>
              <button mat-button (click)="clearFilters()">
                <mat-icon>clear</mat-icon>
                Limpar filtros
              </button>
            </div>
            
            <table mat-table [dataSource]="filteredSubscriptions" class="subscriptions-table">
              <ng-container matColumnDef="client">
                <th mat-header-cell *matHeaderCellDef>Cliente</th>
                <td mat-cell *matCellDef="let sub">{{ sub.clientName }}</td>
              </ng-container>
              
              <ng-container matColumnDef="plan">
                <th mat-header-cell *matHeaderCellDef>Plano</th>
                <td mat-cell *matCellDef="let sub">
                  <span class="plan-badge" [ngClass]="sub.plan">{{ getPlanText(sub.plan) }}</span>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="startDate">
                <th mat-header-cell *matHeaderCellDef>Início</th>
                <td mat-cell *matCellDef="let sub">{{ formatDate(sub.startDate) }}</td>
              </ng-container>
              
              <ng-container matColumnDef="endDate">
                <th mat-header-cell *matHeaderCellDef>Fim</th>
                <td mat-cell *matCellDef="let sub">{{ formatDate(sub.endDate) }}</td>
              </ng-container>
              
              <ng-container matColumnDef="daysLeft">
                <th mat-header-cell *matHeaderCellDef>Dias</th>
                <td mat-cell *matCellDef="let sub" class="days-cell">
                  <span class="days-left" [ngClass]="getDaysLeftClass(sub)">{{ getDaysLeft(sub) }}</span>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let sub">
                  <span class="status" [ngClass]="sub.status">{{ getStatusText(sub.status) }}</span>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="value">
                <th mat-header-cell *matHeaderCellDef>Valor</th>
                <td mat-cell *matCellDef="let sub" class="value-cell">{{ sub.value }}€</td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Ações</th>
                <td mat-cell *matCellDef="let sub" (click)="$event.stopPropagation()">
                  <button mat-icon-button (click)="viewSubscription(sub)" matTooltip="Ver detalhes">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button (click)="renewSubscription(sub)" matTooltip="Renovar">
                    <mat-icon>refresh</mat-icon>
                  </button>
                  <button mat-icon-button (click)="cancelSubscription(sub)" color="warn" matTooltip="Cancelar">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="viewSubscription(row)" class="clickable-row"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    h1 { margin: 0 0 8px 0; color: #333; font-size: 28px; }
    p { margin: 0; color: #666; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 16px; }
    .search-bar mat-form-field { width: 300px; }
    .filters { display: flex; gap: 16px; }
    .filters mat-form-field { width: 130px; }
    .results-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 8px 16px; background: #f8f9fa; border-radius: 4px; font-size: 14px; color: #666; }
    .subscriptions-table { width: 100%; }
    .plan-badge { padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; }
    .plan-badge.monthly { background: #e3f2fd; color: #1976d2; }
    .plan-badge.quarterly { background: #f3e5f5; color: #7b1fa2; }
    .plan-badge.biannual { background: #fff3e0; color: #ef6c00; }
    .plan-badge.annual { background: #e8f5e8; color: #2e7d32; }
    .status { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .status.active { background: #e8f5e8; color: #2e7d32; }
    .status.expired { background: #ffebee; color: #c62828; }
    .status.cancelled { background: #f5f5f5; color: #757575; }
    .days-cell { text-align: center; }
    .days-left { padding: 4px 6px; border-radius: 8px; font-size: 13px; font-weight: 600; min-width: 30px; display: inline-block; text-align: center; }
    .days-left.critical { background: #ffebee; color: #c62828; }
    .days-left.warning { background: #fff3e0; color: #ef6c00; }
    .days-left.caution { background: #fffde7; color: #f57f17; }
    .days-left.safe { background: #e8f5e8; color: #2e7d32; }
    .days-left.expired { background: #f3e5f5; color: #7b1fa2; }
    .value-cell { text-align: right; font-weight: 500; }
    .clickable-row { cursor: pointer; }
    .clickable-row:hover { background: #f5f5f5; }
  `]
})
export class SubscriptionsSimpleComponent implements OnInit {
  displayedColumns: string[] = ['client', 'plan', 'startDate', 'endDate', 'daysLeft', 'status', 'value', 'actions'];
  subscriptions = [
    { id: 1, clientName: 'João Silva', plan: 'annual', startDate: new Date('2024-01-15'), endDate: new Date('2025-01-15'), status: 'active', value: 279.99 },
    { id: 2, clientName: 'Maria Santos', plan: 'monthly', startDate: new Date('2024-09-01'), endDate: new Date('2024-10-01'), status: 'expired', value: 29.99 },
    { id: 3, clientName: 'Pedro Costa', plan: 'quarterly', startDate: new Date('2024-07-01'), endDate: new Date('2024-10-01'), status: 'expired', value: 79.99 },
    { id: 4, clientName: 'Ana Ferreira', plan: 'biannual', startDate: new Date('2024-05-01'), endDate: new Date('2024-11-01'), status: 'active', value: 149.99 },
    { id: 5, clientName: 'Carlos Oliveira', plan: 'monthly', startDate: new Date('2024-09-15'), endDate: new Date('2024-10-15'), status: 'active', value: 29.99 },
    { id: 6, clientName: 'Luísa Pereira', plan: 'annual', startDate: new Date('2024-03-01'), endDate: new Date('2025-03-01'), status: 'active', value: 279.99 },
    { id: 7, clientName: 'Rui Martins', plan: 'quarterly', startDate: new Date('2024-08-01'), endDate: new Date('2024-11-01'), status: 'cancelled', value: 79.99 },
    { id: 8, clientName: 'Sofia Rodrigues', plan: 'monthly', startDate: new Date('2024-09-20'), endDate: new Date('2024-10-20'), status: 'active', value: 29.99 }
  ];
  filteredSubscriptions = [...this.subscriptions];
  searchTerm = '';
  statusFilter = 'all';
  planFilter = 'all';
  
  constructor(private snackBar: MatSnackBar) {}
  
  ngOnInit(): void {
    this.applyFilter();
  }
  
  applyFilter(): void {
    this.filteredSubscriptions = this.subscriptions.filter(sub => {
      const matchesSearch = !this.searchTerm || 
        sub.clientName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || sub.status === this.statusFilter;
      const matchesPlan = this.planFilter === 'all' || sub.plan === this.planFilter;
      
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }
  
  getDaysLeft(subscription: any): number {
    const today = new Date();
    const endDate = new Date(subscription.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  getDaysLeftClass(subscription: any): string {
    const days = this.getDaysLeft(subscription);
    if (days < 0) return 'expired';
    if (days <= 3) return 'critical';
    if (days <= 15) return 'warning';
    if (days <= 30) return 'caution';
    return 'safe';
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-PT');
  }
  
  getPlanText(plan: string): string {
    switch(plan) {
      case 'monthly': return 'Mensal';
      case 'quarterly': return 'Trimestral';
      case 'biannual': return 'Semestral';
      case 'annual': return 'Anual';
      default: return plan;
    }
  }
  
  getStatusText(status: string): string {
    switch(status) {
      case 'active': return 'Ativa';
      case 'expired': return 'Expirada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  }
  
  addSubscription(): void {
    this.snackBar.open('Adicionar nova subscrição: Em desenvolvimento', 'Fechar', { duration: 2000 });
  }
  
  viewSubscription(subscription: any): void {
    this.snackBar.open(`Ver detalhes: ${subscription.clientName}`, 'Fechar', { duration: 2000 });
  }
  
  renewSubscription(subscription: any): void {
    this.snackBar.open(`Renovar subscrição: ${subscription.clientName}`, 'Fechar', { duration: 2000 });
  }
  
  cancelSubscription(subscription: any): void {
    this.snackBar.open(`Cancelar subscrição: ${subscription.clientName}`, 'Fechar', { duration: 2000 });
  }
  
  exportData(): void {
    this.snackBar.open('Exportar dados: Em desenvolvimento', 'Fechar', { duration: 2000 });
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.planFilter = 'all';
    this.applyFilter();
    this.snackBar.open('Filtros limpos', 'Fechar', { duration: 1500 });
  }
}