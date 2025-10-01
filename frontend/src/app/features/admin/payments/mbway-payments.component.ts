import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { Inject } from '@angular/core';

interface MBWayPayment {
  id: string;
  clientName: string;
  clientPhone: string;
  amount: number;
  reference: string;
  status: 'pending' | 'sent' | 'confirmed' | 'failed' | 'expired';
  createdAt: Date;
  sentAt?: Date;
  confirmedAt?: Date;
  expiresAt: Date;
  subscriptionPlan: string;
  errorMessage?: string;
}

interface MBWayRequest {
  clientId: string;
  clientName: string;
  clientPhone: string;
  amount: number;
  subscriptionPlan: string;
  description: string;
}

@Component({
  selector: 'app-mbway-request-dialog',
  template: `
    <h2 mat-dialog-title>Novo Pedido MBWay</h2>
    <mat-dialog-content>
      <form [formGroup]="requestForm" class="request-form">
        <mat-form-field>
          <mat-label>Cliente</mat-label>
          <mat-select formControlName="clientId" required>
            <mat-option *ngFor="let client of clients" [value]="client.id">
              {{ client.name }} - {{ client.phone }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field>
          <mat-label>Plano de Subscrição</mat-label>
          <mat-select formControlName="subscriptionPlan" required>
            <mat-option value="1_month">1 Mês - €29.99</mat-option>
            <mat-option value="3_months">3 Meses - €79.99</mat-option>
            <mat-option value="6_months">6 Meses - €149.99</mat-option>
            <mat-option value="1_year">1 Ano - €279.99</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field>
          <mat-label>Valor (€)</mat-label>
          <input matInput type="number" formControlName="amount" required min="0" step="0.01">
        </mat-form-field>
        
        <mat-form-field>
          <mat-label>Descrição</mat-label>
          <textarea matInput formControlName="description" rows="3" 
                    placeholder="TimeAdministrator - Subscrição 1 Mês"></textarea>
        </mat-form-field>
        
        <div class="mbway-preview">
          <mat-icon>smartphone</mat-icon>
          <div>
            <p><strong>O cliente receberá:</strong></p>
            <p>SMS no número: {{ getSelectedClientPhone() }}</p>
            <p>Valor: {{ requestForm.get('amount')?.value }}€</p>
            <p>Descrição: {{ requestForm.get('description')?.value }}</p>
          </div>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSend()" [disabled]="!requestForm.valid">
        <mat-icon>send</mat-icon>
        Enviar Pedido
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .request-form { display: flex; flex-direction: column; gap: 16px; min-width: 400px; }
    .mbway-preview { display: flex; gap: 12px; margin-top: 16px; padding: 12px; background: #e3f2fd; border-radius: 4px; }
    .mbway-preview mat-icon { color: #1976d2; margin-top: 4px; }
    .mbway-preview p { margin: 2px 0; }
  `],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule]
})
export class MBWayRequestDialogComponent {
  requestForm: FormGroup;
  clients = [
    { id: '1', name: 'João Silva', phone: '+351912345678' },
    { id: '2', name: 'Maria Santos', phone: '+351923456789' },
    { id: '3', name: 'Pedro Costa', phone: '+351934567890' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MBWayRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.requestForm = this.fb.group({
      clientId: ['', Validators.required],
      subscriptionPlan: ['', Validators.required],
      amount: [29.99, [Validators.required, Validators.min(0.01)]],
      description: ['TimeAdministrator - Subscrição', Validators.required]
    });

    // Update amount when plan changes
    this.requestForm.get('subscriptionPlan')?.valueChanges.subscribe(plan => {
      const amounts: { [key: string]: number } = {
        '1_month': 29.99,
        '3_months': 79.99,
        '6_months': 149.99,
        '1_year': 279.99
      };
      if (amounts[plan]) {
        this.requestForm.patchValue({ amount: amounts[plan] });
      }
    });
  }

  getSelectedClientPhone(): string {
    const clientId = this.requestForm.get('clientId')?.value;
    const client = this.clients.find(c => c.id === clientId);
    return client?.phone || '';
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSend() {
    if (this.requestForm.valid) {
      const clientId = this.requestForm.get('clientId')?.value;
      const client = this.clients.find(c => c.id === clientId);
      
      const request: MBWayRequest = {
        clientId,
        clientName: client?.name || '',
        clientPhone: client?.phone || '',
        amount: this.requestForm.get('amount')?.value,
        subscriptionPlan: this.requestForm.get('subscriptionPlan')?.value,
        description: this.requestForm.get('description')?.value
      };
      
      this.dialogRef.close(request);
    }
  }
}

@Component({
  selector: 'app-mbway-payments',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDialogModule, MatSnackBarModule, MatTabsModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <div class="header-info">
          <h1>Pagamentos MBWay</h1>
          <p>Gestão de pedidos de pagamento via MBWay</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="createMBWayRequest()">
            <mat-icon>add</mat-icon>
            Novo Pedido
          </button>
          <button mat-raised-button (click)="refreshPayments()">
            <mat-icon>refresh</mat-icon>
            Atualizar
          </button>
        </div>
      </div>

      <mat-tab-group [(selectedIndex)]="selectedTab">
        <!-- Active Requests Tab -->
        <mat-tab label="Pedidos Ativos">
          <div class="tab-content">
            <!-- Stats Cards -->
            <div class="stats-grid">
              <mat-card class="stat-card">
                <mat-card-content>
                  <div class="stat-header">
                    <mat-icon class="pending-icon">schedule</mat-icon>
                    <span>Pendentes</span>
                  </div>
                  <div class="stat-value">{{ stats.pending }}</div>
                  <div class="stat-details">
                    <span>Aguardam confirmação</span>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card class="stat-card">
                <mat-card-content>
                  <div class="stat-header">
                    <mat-icon class="sent-icon">send</mat-icon>
                    <span>Enviados</span>
                  </div>
                  <div class="stat-value">{{ stats.sent }}</div>
                  <div class="stat-details">
                    <span>SMS enviados hoje</span>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card class="stat-card">
                <mat-card-content>
                  <div class="stat-header">
                    <mat-icon class="confirmed-icon">check_circle</mat-icon>
                    <span>Confirmados</span>
                  </div>
                  <div class="stat-value">{{ stats.confirmed }}</div>
                  <div class="stat-details">
                    <span class="success">{{ stats.confirmedToday }} hoje</span>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card class="stat-card">
                <mat-card-content>
                  <div class="stat-header">
                    <mat-icon class="revenue-icon">euro</mat-icon>
                    <span>Receita Hoje</span>
                  </div>
                  <div class="stat-value">{{ stats.todayRevenue }}€</div>
                  <div class="stat-details">
                    <span class="success">+{{ stats.revenueGrowth }}% vs ontem</span>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>

            <!-- Active Payments Table -->
            <mat-card class="table-card">
              <mat-card-header>
                <mat-card-title>Pedidos Ativos</mat-card-title>
                <div class="header-actions">
                  <mat-form-field>
                    <mat-label>Filtrar por estado</mat-label>
                    <mat-select [(value)]="statusFilter" (selectionChange)="filterPayments()">
                      <mat-option value="">Todos</mat-option>
                      <mat-option value="pending">Pendente</mat-option>
                      <mat-option value="sent">Enviado</mat-option>
                      <mat-option value="confirmed">Confirmado</mat-option>
                      <mat-option value="failed">Falhado</mat-option>
                      <mat-option value="expired">Expirado</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
              </mat-card-header>
              <mat-card-content>
                <table mat-table [dataSource]="filteredPayments" class="payments-table">
                  <ng-container matColumnDef="client">
                    <th mat-header-cell *matHeaderCellDef>Cliente</th>
                    <td mat-cell *matCellDef="let payment">
                      <div class="client-info">
                        <div class="client-name">{{ payment.clientName }}</div>
                        <div class="client-phone">{{ payment.clientPhone }}</div>
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef>Valor</th>
                    <td mat-cell *matCellDef="let payment">{{ payment.amount }}€</td>
                  </ng-container>

                  <ng-container matColumnDef="plan">
                    <th mat-header-cell *matHeaderCellDef>Plano</th>
                    <td mat-cell *matCellDef="let payment">{{ getPlanText(payment.subscriptionPlan) }}</td>
                  </ng-container>

                  <ng-container matColumnDef="reference">
                    <th mat-header-cell *matHeaderCellDef>Referência</th>
                    <td mat-cell *matCellDef="let payment">
                      <code>{{ payment.reference }}</code>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Estado</th>
                    <td mat-cell *matCellDef="let payment">
                      <span class="status-badge" [ngClass]="payment.status">
                        {{ getStatusText(payment.status) }}
                      </span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="expires">
                    <th mat-header-cell *matHeaderCellDef>Expira</th>
                    <td mat-cell *matCellDef="let payment">
                      <div class="expires-info" [ngClass]="getExpiresClass(payment.expiresAt)">
                        {{ payment.expiresAt | date:'dd/MM HH:mm' }}
                        <div class="expires-countdown">{{ getTimeRemaining(payment.expiresAt) }}</div>
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Ações</th>
                    <td mat-cell *matCellDef="let payment">
                      <button mat-icon-button (click)="viewPaymentDetails(payment)">
                        <mat-icon>visibility</mat-icon>
                      </button>
                      <button mat-icon-button (click)="resendMBWayRequest(payment)" 
                              *ngIf="payment.status === 'failed' || payment.status === 'expired'">
                        <mat-icon>refresh</mat-icon>
                      </button>
                      <button mat-icon-button (click)="cancelMBWayRequest(payment)" 
                              *ngIf="payment.status === 'pending' || payment.status === 'sent'"
                              color="warn">
                        <mat-icon>cancel</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="paymentColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: paymentColumns;"></tr>
                </table>
                
                <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- History Tab -->
        <mat-tab label="Histórico">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Histórico de Pagamentos MBWay</mat-card-title>
                <div class="header-actions">
                  <button mat-raised-button (click)="exportHistory()">
                    <mat-icon>download</mat-icon>
                    Exportar
                  </button>
                </div>
              </mat-card-header>
              <mat-card-content>
                <table mat-table [dataSource]="allPayments" class="history-table">
                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Data</th>
                    <td mat-cell *matCellDef="let payment">{{ payment.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="client">
                    <th mat-header-cell *matHeaderCellDef>Cliente</th>
                    <td mat-cell *matCellDef="let payment">{{ payment.clientName }}</td>
                  </ng-container>

                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef>Valor</th>
                    <td mat-cell *matCellDef="let payment">{{ payment.amount }}€</td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Estado Final</th>
                    <td mat-cell *matCellDef="let payment">
                      <span class="status-badge" [ngClass]="payment.status">
                        {{ getStatusText(payment.status) }}
                      </span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="duration">
                    <th mat-header-cell *matHeaderCellDef>Duração</th>
                    <td mat-cell *matCellDef="let payment">
                      {{ getPaymentDuration(payment) }}
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="historyColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: historyColumns;"></tr>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .header h1 { margin: 0; color: #1976d2; font-size: 28px; }
    .header p { margin: 4px 0 0 0; color: #666; }
    .header-actions { display: flex; gap: 12px; }
    .tab-content { padding: 24px 0; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-2px); }
    .stat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .stat-header mat-icon { font-size: 24px; }
    .pending-icon { color: #ff9800; }
    .sent-icon { color: #2196f3; }
    .confirmed-icon { color: #4caf50; }
    .revenue-icon { color: #9c27b0; }
    .stat-value { font-size: 32px; font-weight: 600; color: #1976d2; margin-bottom: 8px; }
    .stat-details { display: flex; flex-direction: column; gap: 4px; }
    .success { color: #2e7d32; }
    
    .table-card .mat-card-header { display: flex; justify-content: space-between; align-items: center; }
    .payments-table, .history-table { width: 100%; }
    .client-info { display: flex; flex-direction: column; }
    .client-name { font-weight: 500; }
    .client-phone { font-size: 12px; color: #666; }
    
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-badge.pending { background: #fff3e0; color: #f57c00; }
    .status-badge.sent { background: #e3f2fd; color: #1976d2; }
    .status-badge.confirmed { background: #e8f5e8; color: #2e7d32; }
    .status-badge.failed { background: #ffebee; color: #c62828; }
    .status-badge.expired { background: #f5f5f5; color: #666; }
    
    .expires-info { display: flex; flex-direction: column; }
    .expires-countdown { font-size: 11px; color: #666; }
    .expires-info.warning { color: #f57c00; }
    .expires-info.danger { color: #d32f2f; }
    
    code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-size: 12px; }
    
    @media (max-width: 768px) {
      .container { padding: 16px; }
      .header { flex-direction: column; gap: 16px; }
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class MBWayPaymentsComponent implements OnInit {
  selectedTab = 0;
  statusFilter = '';
  
  stats = {
    pending: 8,
    sent: 15,
    confirmed: 23,
    confirmedToday: 5,
    todayRevenue: 149.95,
    revenueGrowth: 12
  };

  paymentColumns = ['client', 'amount', 'plan', 'reference', 'status', 'expires', 'actions'];
  historyColumns = ['date', 'client', 'amount', 'status', 'duration'];
  
  payments: MBWayPayment[] = [];
  filteredPayments: MBWayPayment[] = [];
  allPayments: MBWayPayment[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loadMockData();
  }

  ngOnInit() {
    this.filterPayments();
    // Simulate real-time updates
    setInterval(() => this.updatePaymentStatuses(), 30000);
  }

  loadMockData() {
    const now = new Date();
    
    this.payments = [
      {
        id: '1',
        clientName: 'João Silva',
        clientPhone: '+351912345678',
        amount: 29.99,
        reference: 'MB001234',
        status: 'sent',
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        sentAt: new Date(now.getTime() - 2 * 60 * 60 * 1000 + 30000),
        expiresAt: new Date(now.getTime() + 22 * 60 * 60 * 1000),
        subscriptionPlan: '1_month'
      },
      {
        id: '2',
        clientName: 'Maria Santos',
        clientPhone: '+351923456789',
        amount: 79.99,
        reference: 'MB001235',
        status: 'pending',
        createdAt: new Date(now.getTime() - 30 * 60 * 1000),
        expiresAt: new Date(now.getTime() + 23.5 * 60 * 60 * 1000),
        subscriptionPlan: '3_months'
      },
      {
        id: '3',
        clientName: 'Pedro Costa',
        clientPhone: '+351934567890',
        amount: 149.99,
        reference: 'MB001236',
        status: 'confirmed',
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        sentAt: new Date(now.getTime() - 4 * 60 * 60 * 1000 + 45000),
        confirmedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        expiresAt: new Date(now.getTime() + 20 * 60 * 60 * 1000),
        subscriptionPlan: '6_months'
      }
    ];

    this.allPayments = [...this.payments];
  }

  filterPayments() {
    this.filteredPayments = this.payments.filter(payment => {
      return !this.statusFilter || payment.status === this.statusFilter;
    });
  }

  getPlanText(plan: string): string {
    const planMap: { [key: string]: string } = {
      '1_month': '1 Mês',
      '3_months': '3 Meses',
      '6_months': '6 Meses',
      '1_year': '1 Ano'
    };
    return planMap[plan] || plan;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendente',
      sent: 'Enviado',
      confirmed: 'Confirmado',
      failed: 'Falhado',
      expired: 'Expirado'
    };
    return statusMap[status] || status;
  }

  getExpiresClass(expiresAt: Date): string {
    const now = new Date();
    const timeLeft = expiresAt.getTime() - now.getTime();
    const hoursLeft = timeLeft / (1000 * 60 * 60);
    
    if (hoursLeft < 2) return 'danger';
    if (hoursLeft < 6) return 'warning';
    return '';
  }

  getTimeRemaining(expiresAt: Date): string {
    const now = new Date();
    const timeLeft = expiresAt.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expirado';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  getPaymentDuration(payment: MBWayPayment): string {
    if (!payment.confirmedAt) return '-';
    
    const duration = payment.confirmedAt.getTime() - payment.createdAt.getTime();
    const minutes = Math.floor(duration / (1000 * 60));
    
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  createMBWayRequest() {
    const dialogRef = this.dialog.open(MBWayRequestDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((request: MBWayRequest) => {
      if (request) {
        this.sendMBWayRequest(request);
      }
    });
  }

  sendMBWayRequest(request: MBWayRequest) {
    const newPayment: MBWayPayment = {
      id: Date.now().toString(),
      clientName: request.clientName,
      clientPhone: request.clientPhone,
      amount: request.amount,
      reference: 'MB' + Math.random().toString().substr(2, 6),
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      subscriptionPlan: request.subscriptionPlan
    };

    this.payments.unshift(newPayment);
    this.allPayments.unshift(newPayment);
    this.filterPayments();

    // Simulate sending SMS
    setTimeout(() => {
      newPayment.status = 'sent';
      newPayment.sentAt = new Date();
      this.snackBar.open(`Pedido MBWay enviado para ${request.clientName}`, 'Fechar', { duration: 3000 });
    }, 2000);

    this.snackBar.open('A processar pedido MBWay...', 'Fechar', { duration: 2000 });
  }

  viewPaymentDetails(payment: MBWayPayment) {
    console.log('View payment details:', payment);
  }

  resendMBWayRequest(payment: MBWayPayment) {
    payment.status = 'pending';
    payment.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    setTimeout(() => {
      payment.status = 'sent';
      payment.sentAt = new Date();
      this.snackBar.open(`Pedido MBWay reenviado para ${payment.clientName}`, 'Fechar', { duration: 3000 });
    }, 2000);

    this.snackBar.open('A reenviar pedido MBWay...', 'Fechar', { duration: 2000 });
  }

  cancelMBWayRequest(payment: MBWayPayment) {
    if (confirm(`Cancelar pedido MBWay para ${payment.clientName}?`)) {
      payment.status = 'expired';
      this.snackBar.open('Pedido MBWay cancelado', 'Fechar', { duration: 2000 });
    }
  }

  refreshPayments() {
    this.snackBar.open('A atualizar pagamentos...', 'Fechar', { duration: 1000 });
    // Simulate API call
    setTimeout(() => {
      this.updatePaymentStatuses();
      this.snackBar.open('Pagamentos atualizados', 'Fechar', { duration: 2000 });
    }, 1000);
  }

  updatePaymentStatuses() {
    // Simulate random status updates
    this.payments.forEach(payment => {
      if (payment.status === 'sent' && Math.random() < 0.1) {
        payment.status = 'confirmed';
        payment.confirmedAt = new Date();
      }
      
      // Check for expired payments
      if ((payment.status === 'pending' || payment.status === 'sent') && 
          new Date() > payment.expiresAt) {
        payment.status = 'expired';
      }
    });
  }

  exportHistory() {
    this.snackBar.open('Histórico exportado com sucesso', 'Fechar', { duration: 2000 });
  }
}