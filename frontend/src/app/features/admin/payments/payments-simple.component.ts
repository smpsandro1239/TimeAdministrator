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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-payments-simple',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatSelectModule, MatTooltipModule, MatDialogModule, FormsModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="container">
        <div class="header">
          <div>
            <h1>Gestão de Pagamentos</h1>
            <p>{{ payments.length }} pagamentos registados</p>
          </div>
          <button mat-raised-button color="primary" (click)="addPayment()">
            <mat-icon>add</mat-icon>
            Novo Pagamento
          </button>
        </div>
        
        <div class="stats-grid">
          <mat-card class="stat-card pending clickable" (click)="showStatusDetails('pending')">
            <mat-card-content>
              <mat-icon>pending</mat-icon>
              <h3>{{ getStatusCount('pending') }}</h3>
              <p>Pendentes</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card approved clickable" (click)="showStatusDetails('approved')">
            <mat-card-content>
              <mat-icon>check_circle</mat-icon>
              <h3>{{ getStatusCount('approved') }}</h3>
              <p>Aprovados</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card rejected clickable" (click)="showStatusDetails('rejected')">
            <mat-card-content>
              <mat-icon>cancel</mat-icon>
              <h3>{{ getStatusCount('rejected') }}</h3>
              <p>Rejeitados</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card total clickable" (click)="showTotalDetails()">
            <mat-card-content>
              <mat-icon>euro</mat-icon>
              <h3>{{ getTotalAmount() }}€</h3>
              <p>Total Aprovado</p>
            </mat-card-content>
          </mat-card>
        </div>
        
        <mat-card>
          <mat-card-content>
            <div class="toolbar">
              <div class="search-bar">
                <mat-form-field appearance="outline">
                  <mat-label>Pesquisar pagamentos</mat-label>
                  <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Cliente ou referência">
                  <mat-icon matSuffix>search</mat-icon>
                </mat-form-field>
              </div>
              
              <div class="filters">
                <mat-form-field appearance="outline">
                  <mat-label>Estado</mat-label>
                  <mat-select [(value)]="statusFilter" (selectionChange)="applyFilter()">
                    <mat-option value="all">Todos</mat-option>
                    <mat-option value="pending">Pendente</mat-option>
                    <mat-option value="approved">Aprovado</mat-option>
                    <mat-option value="rejected">Rejeitado</mat-option>
                  </mat-select>
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Método</mat-label>
                  <mat-select [(value)]="methodFilter" (selectionChange)="applyFilter()">
                    <mat-option value="all">Todos</mat-option>
                    <mat-option value="stripe">Cartão</mat-option>
                    <mat-option value="transfer">Transferência</mat-option>
                    <mat-option value="cash">Dinheiro</mat-option>
                  </mat-select>
                </mat-form-field>
                
                <button mat-stroked-button (click)="exportData()" matTooltip="Exportar dados">
                  <mat-icon>download</mat-icon>
                  Exportar
                </button>
              </div>
            </div>
            
            <div class="results-info" *ngIf="searchTerm || statusFilter !== 'all' || methodFilter !== 'all'">
              <span>A mostrar {{ filteredPayments.length }} de {{ payments.length }} pagamentos</span>
              <button mat-button (click)="clearFilters()">
                <mat-icon>clear</mat-icon>
                Limpar filtros
              </button>
            </div>
            
            <!-- Desktop Table -->
            <div class="desktop-table">
              <table mat-table [dataSource]="filteredPayments" class="payments-table">
                <ng-container matColumnDef="client">
                  <th mat-header-cell *matHeaderCellDef>Cliente</th>
                  <td mat-cell *matCellDef="let payment">{{ payment.clientName }}</td>
                </ng-container>
                
                <ng-container matColumnDef="reference">
                  <th mat-header-cell *matHeaderCellDef>Referência</th>
                  <td mat-cell *matCellDef="let payment">{{ payment.reference }}</td>
                </ng-container>
                
                <ng-container matColumnDef="amount">
                  <th mat-header-cell *matHeaderCellDef>Valor</th>
                  <td mat-cell *matCellDef="let payment" class="amount-cell">{{ payment.amount }}€</td>
                </ng-container>
                
                <ng-container matColumnDef="method">
                  <th mat-header-cell *matHeaderCellDef>Método</th>
                  <td mat-cell *matCellDef="let payment">
                    <span class="method-badge" [ngClass]="payment.method">{{ getMethodText(payment.method) }}</span>
                  </td>
                </ng-container>
                
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Data</th>
                  <td mat-cell *matCellDef="let payment">{{ formatDate(payment.date) }}</td>
                </ng-container>
                
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let payment">
                    <span class="status" [ngClass]="payment.status">{{ getStatusText(payment.status) }}</span>
                  </td>
                </ng-container>
                
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Ações</th>
                  <td mat-cell *matCellDef="let payment" (click)="$event.stopPropagation()">
                    <button mat-icon-button (click)="viewPayment(payment)" matTooltip="Ver detalhes">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button *ngIf="payment.status === 'pending'" 
                            (click)="approvePayment(payment)" color="primary" matTooltip="Aprovar">
                      <mat-icon>check</mat-icon>
                    </button>
                    <button mat-icon-button *ngIf="payment.status === 'pending'" 
                            (click)="rejectPayment(payment)" color="warn" matTooltip="Rejeitar">
                      <mat-icon>close</mat-icon>
                    </button>
                  </td>
                </ng-container>
                
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="viewPayment(row)" class="clickable-row"></tr>
              </table>
            </div>

            <!-- Mobile Cards -->
            <div class="mobile-cards">
              <div class="payment-card" *ngFor="let payment of filteredPayments" (click)="viewPayment(payment)">
                <div class="card-header">
                  <div class="payment-info">
                    <h3>{{ payment.clientName }}</h3>
                    <p class="reference">{{ payment.reference }}</p>
                  </div>
                  <div class="amount">{{ payment.amount }}€</div>
                </div>
                
                <div class="card-content">
                  <div class="info-row">
                    <mat-icon>payment</mat-icon>
                    <span class="method-badge" [ngClass]="payment.method">{{ getMethodText(payment.method) }}</span>
                  </div>
                  
                  <div class="info-row">
                    <mat-icon>schedule</mat-icon>
                    <span>{{ formatDate(payment.date) }}</span>
                  </div>
                  
                  <div class="info-row">
                    <mat-icon>info</mat-icon>
                    <span class="status" [ngClass]="payment.status">{{ getStatusText(payment.status) }}</span>
                  </div>
                </div>
                
                <div class="card-actions" (click)="$event.stopPropagation()">
                  <button mat-icon-button (click)="viewPayment(payment)" matTooltip="Ver detalhes">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button *ngIf="payment.status === 'pending'" 
                          (click)="approvePayment(payment)" color="primary" matTooltip="Aprovar">
                    <mat-icon>check</mat-icon>
                  </button>
                  <button mat-icon-button *ngIf="payment.status === 'pending'" 
                          (click)="rejectPayment(payment)" color="warn" matTooltip="Rejeitar">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    h1 { margin: 0 0 8px 0; color: #2196F3; font-size: 28px; }
    p { margin: 0; color: #666; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { text-align: center; }
    .stat-card.pending { border-left: 4px solid #FF9800; }
    .stat-card.approved { border-left: 4px solid #4CAF50; }
    .stat-card.rejected { border-left: 4px solid #f44336; }
    .stat-card.total { border-left: 4px solid #2196F3; }
    .stat-card.clickable { cursor: pointer; transition: transform 0.2s; }
    .stat-card.clickable:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .stat-card mat-icon { font-size: 32px; width: 32px; height: 32px; margin-bottom: 8px; }
    .stat-card h3 { margin: 8px 0 4px 0; font-size: 24px; }
    .stat-card p { margin: 0; color: #666; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 16px; }
    .search-bar mat-form-field { width: 300px; }
    .filters { display: flex; gap: 16px; }
    .filters mat-form-field { width: 130px; }
    .results-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 8px 16px; background: #f8f9fa; border-radius: 4px; font-size: 14px; color: #666; }
    .payments-table { width: 100%; }
    .method-badge { padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; }
    .method-badge.stripe { background: #e3f2fd; color: #1976d2; }
    .method-badge.transfer { background: #f3e5f5; color: #7b1fa2; }
    .method-badge.cash { background: #e8f5e8; color: #2e7d32; }
    .status { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .status.pending { background: #fff3e0; color: #ef6c00; }
    .status.approved { background: #e8f5e8; color: #2e7d32; }
    .status.rejected { background: #ffebee; color: #c62828; }
    .amount-cell { text-align: right; font-weight: 500; }
    .clickable-row { cursor: pointer; }
    .clickable-row:hover { background: #f5f5f5; }
    
    /* Mobile Cards Layout */
    .desktop-table { display: block; }
    .mobile-cards { display: none; }
    
    .payment-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.2s ease;
      border-left: 4px solid #2196F3;
    }
    
    .payment-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    
    .payment-info h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    
    .reference {
      margin: 0;
      font-size: 12px;
      color: #666;
      font-family: monospace;
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
    }
    
    .amount {
      font-size: 18px;
      font-weight: 700;
      color: #2196F3;
    }
    
    .card-content {
      margin-bottom: 12px;
    }
    
    .info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      color: #666;
    }
    
    .info-row mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #1976d2;
    }
    
    .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
      padding-top: 8px;
      border-top: 1px solid #eee;
    }
    
    @media (max-width: 768px) {
      .container { padding: 16px; }
      .header { flex-direction: column; align-items: stretch; gap: 12px; }
      .header button { width: 100%; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .toolbar { flex-direction: column; align-items: stretch; gap: 12px; }
      .search-bar mat-form-field { width: 100%; }
      .filters { flex-wrap: wrap; justify-content: space-between; }
      .filters mat-form-field { width: calc(50% - 8px); min-width: 120px; }
      .filters button { flex: 1; min-width: 80px; }
      
      /* Switch to mobile layout */
      .desktop-table { display: none; }
      .mobile-cards { display: block; }
    }
    
    @media (max-width: 480px) {
      .container { padding: 12px; }
      .stats-grid { grid-template-columns: 1fr; }
      .filters mat-form-field { width: 100%; }
      .filters { flex-direction: column; }
      .filters button { width: 100%; margin-bottom: 8px; }
      
      .payment-card {
        padding: 12px;
        margin-bottom: 8px;
      }
      
      .payment-info h3 {
        font-size: 15px;
      }
      
      .amount {
        font-size: 16px;
      }
      
      .info-row {
        font-size: 13px;
        margin-bottom: 6px;
      }
      
      .info-row mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }
  `]
})
export class PaymentsSimpleComponent implements OnInit {
  displayedColumns: string[] = ['client', 'reference', 'amount', 'method', 'date', 'status', 'actions'];
  payments = [
    { id: 1, clientName: 'João Silva', reference: 'PAY-001', amount: 10.00, method: 'stripe', date: new Date('2024-10-01'), status: 'approved' },
    { id: 2, clientName: 'Maria Santos', reference: 'PAY-002', amount: 30.00, method: 'transfer', date: new Date('2024-09-28'), status: 'pending' },
    { id: 3, clientName: 'Pedro Costa', reference: 'PAY-003', amount: 60.00, method: 'cash', date: new Date('2024-09-25'), status: 'rejected' },
    { id: 4, clientName: 'Ana Ferreira', reference: 'PAY-004', amount: 100.00, method: 'stripe', date: new Date('2024-09-30'), status: 'approved' },
    { id: 5, clientName: 'Carlos Oliveira', reference: 'PAY-005', amount: 10.00, method: 'transfer', date: new Date('2024-10-02'), status: 'pending' },
    { id: 6, clientName: 'Luísa Pereira', reference: 'PAY-006', amount: 30.00, method: 'stripe', date: new Date('2024-09-29'), status: 'approved' },
    { id: 7, clientName: 'Rui Martins', reference: 'PAY-007', amount: 60.00, method: 'cash', date: new Date('2024-09-27'), status: 'pending' },
    { id: 8, clientName: 'Sofia Rodrigues', reference: 'PAY-008', amount: 10.00, method: 'stripe', date: new Date('2024-10-01'), status: 'approved' }
  ];
  filteredPayments = [...this.payments];
  searchTerm = '';
  statusFilter = 'all';
  methodFilter = 'all';
  
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}
  
  ngOnInit(): void {
    this.applyFilter();
  }
  
  applyFilter(): void {
    this.filteredPayments = this.payments.filter(payment => {
      const matchesSearch = !this.searchTerm || 
        payment.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        payment.reference.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || payment.status === this.statusFilter;
      const matchesMethod = this.methodFilter === 'all' || payment.method === this.methodFilter;
      
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }
  
  getStatusCount(status: string): number {
    return this.payments.filter(p => p.status === status).length;
  }
  
  getTotalAmount(): number {
    return this.payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0);
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-PT');
  }
  
  getMethodText(method: string): string {
    switch(method) {
      case 'stripe': return 'Cartão';
      case 'transfer': return 'Transferência';
      case 'cash': return 'Dinheiro';
      default: return method;
    }
  }
  
  getStatusText(status: string): string {
    switch(status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  }
  
  addPayment(): void {
    import('./add-payment-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.AddPaymentDialogComponent, {
        width: '500px',
        disableClose: true
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.payments.push(result);
          this.applyFilter();
          this.snackBar.open(`Pagamento ${result.reference} adicionado`, 'Fechar', { duration: 2000 });
        }
      });
    });
  }
  
  viewPayment(payment: any): void {
    import('./view-payment-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.ViewPaymentDialogComponent, {
        width: '600px',
        data: payment
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result?.action === 'approve') {
          this.approvePayment(result.payment);
        } else if (result?.action === 'reject') {
          this.rejectPayment(result.payment);
        }
      });
    });
  }
  
  approvePayment(payment: any): void {
    import('../../../shared/components/confirm-dialog/confirm-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Aprovar Pagamento',
          message: `Confirma a aprovação do pagamento ${payment.reference} de ${payment.clientName} no valor de ${payment.amount}€?`,
          confirmText: 'Aprovar',
          cancelText: 'Cancelar'
        }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const index = this.payments.findIndex(p => p.id === payment.id);
          if (index !== -1) {
            this.payments[index].status = 'approved';
            this.applyFilter();
            this.snackBar.open(`Pagamento ${payment.reference} aprovado`, 'Fechar', { duration: 2000 });
          }
        }
      });
    }).catch(() => {
      if (confirm(`Confirma a aprovação do pagamento ${payment.reference}?`)) {
        const index = this.payments.findIndex(p => p.id === payment.id);
        if (index !== -1) {
          this.payments[index].status = 'approved';
          this.applyFilter();
          this.snackBar.open(`Pagamento ${payment.reference} aprovado`, 'Fechar', { duration: 2000 });
        }
      }
    });
  }
  
  rejectPayment(payment: any): void {
    import('../../../shared/components/confirm-dialog/confirm-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Rejeitar Pagamento',
          message: `Confirma a rejeição do pagamento ${payment.reference} de ${payment.clientName}?`,
          confirmText: 'Rejeitar',
          cancelText: 'Cancelar'
        }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const index = this.payments.findIndex(p => p.id === payment.id);
          if (index !== -1) {
            this.payments[index].status = 'rejected';
            this.applyFilter();
            this.snackBar.open(`Pagamento ${payment.reference} rejeitado`, 'Fechar', { duration: 2000 });
          }
        }
      });
    }).catch(() => {
      if (confirm(`Confirma a rejeição do pagamento ${payment.reference}?`)) {
        const index = this.payments.findIndex(p => p.id === payment.id);
        if (index !== -1) {
          this.payments[index].status = 'rejected';
          this.applyFilter();
          this.snackBar.open(`Pagamento ${payment.reference} rejeitado`, 'Fechar', { duration: 2000 });
        }
      }
    });
  }
  
  exportData(): void {
    this.snackBar.open('Exportar dados: Em desenvolvimento', 'Fechar', { duration: 2000 });
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.methodFilter = 'all';
    this.applyFilter();
    this.snackBar.open('Filtros limpos', 'Fechar', { duration: 1500 });
  }
  
  showStatusDetails(status: string): void {
    const statusPayments = this.payments.filter(p => p.status === status);
    
    import('./status-details-dialog.component').then(m => {
      this.dialog.open(m.StatusDetailsDialogComponent, {
        width: '700px',
        data: {
          status: status,
          payments: statusPayments
        }
      });
    });
  }
  
  showTotalDetails(): void {
    const approvedPayments = this.payments.filter(p => p.status === 'approved');
    
    import('./status-details-dialog.component').then(m => {
      this.dialog.open(m.StatusDetailsDialogComponent, {
        width: '700px',
        data: {
          status: 'total',
          payments: approvedPayments
        }
      });
    });
  }
}