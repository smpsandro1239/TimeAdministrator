import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { DialogConfigService } from '../../../shared/services/dialog-config.service';

@Component({
  selector: 'app-subscriptions-simple',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatSelectModule, MatTooltipModule, MatDialogModule, FormsModule, LayoutComponent],
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

        <!-- Expiry Period Stats -->
        <div class="stats-grid">
          <div class="stat-card critical" (click)="showExpiryPeriod('expired')" matTooltip="Ver lista de subscrições expiradas">
            <div class="stat-icon">
              <mat-icon>error</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getExpiryCount('expired') }}</div>
              <div class="stat-label">OFF</div>
            </div>
          </div>

          <div class="stat-card critical" (click)="showExpiryPeriod(1)" matTooltip="Ver lista de subscrições que expiram em menos de 1 dia">
            <div class="stat-icon">
              <mat-icon>warning</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getExpiryCount(1) }}</div>
              <div class="stat-label">< 1 Dia</div>
            </div>
          </div>

          <div class="stat-card warning" (click)="showExpiryPeriod(3)" matTooltip="Ver lista de subscrições que expiram em menos de 3 dias">
            <div class="stat-icon">
              <mat-icon>schedule</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getExpiryCount(3) }}</div>
              <div class="stat-label">< 3 Dias</div>
            </div>
          </div>

          <div class="stat-card warning" (click)="showExpiryPeriod(7)" matTooltip="Ver lista de subscrições que expiram em menos de 7 dias">
            <div class="stat-icon">
              <mat-icon>event</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getExpiryCount(7) }}</div>
              <div class="stat-label">< 7 Dias</div>
            </div>
          </div>

          <div class="stat-card caution" (click)="showExpiryPeriod(15)" matTooltip="Ver lista de subscrições que expiram em menos de 15 dias">
            <div class="stat-icon">
              <mat-icon>calendar_today</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getExpiryCount(15) }}</div>
              <div class="stat-label">< 15 Dias</div>
            </div>
          </div>

          <div class="stat-card info" (click)="showExpiryPeriod(30)" matTooltip="Ver lista de subscrições que expiram em menos de 30 dias">
            <div class="stat-icon">
              <mat-icon>date_range</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getExpiryCount(30) }}</div>
              <div class="stat-label">< 30 Dias</div>
            </div>
          </div>

          <div class="stat-card info" (click)="showExpiryPeriod(60)" matTooltip="Ver lista de subscrições que expiram em menos de 60 dias">
            <div class="stat-icon">
              <mat-icon>event_available</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ getExpiryCount(60) }}</div>
              <div class="stat-label">< 60 Dias</div>
            </div>
          </div>
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
                    <mat-option value="inactive">Inativa</mat-option>
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

            <!-- Desktop Table -->
            <div class="desktop-table">
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
                    <button mat-icon-button *ngIf="getDaysLeft(sub) < 0 && sub.status === 'inactive'"
                            (click)="keepActive(sub)" color="primary" matTooltip="Manter ativo +1 mês">
                      <mat-icon>play_arrow</mat-icon>
                    </button>
                    <button mat-icon-button *ngIf="sub.manuallyActive"
                            (click)="deactivate(sub)" color="warn" matTooltip="Desativar">
                      <mat-icon>stop</mat-icon>
                    </button>
                    <button mat-icon-button (click)="cancelSubscription(sub)" color="warn" matTooltip="Cancelar">
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="viewSubscription(row)" class="clickable-row"></tr>
              </table>
            </div>

            <!-- Mobile Cards -->
            <div class="mobile-cards">
              <div class="subscription-card" *ngFor="let sub of filteredSubscriptions" (click)="viewSubscription(sub)">
                <div class="subscription-card-header">
                  <div class="subscription-card-title">{{ sub.clientName }}</div>
                  <span class="status" [ngClass]="sub.status">{{ getStatusText(sub.status) }}</span>
                </div>

                <div class="subscription-card-details">
                  <div class="subscription-card-detail">
                    <div class="subscription-card-label">Plano</div>
                    <div class="subscription-card-value">
                      <span class="plan-badge" [ngClass]="sub.plan">{{ getPlanText(sub.plan) }}</span>
                    </div>
                  </div>
                  <div class="subscription-card-detail">
                    <div class="subscription-card-label">Valor</div>
                    <div class="subscription-card-value subscription-price">{{ sub.value }}€</div>
                  </div>
                  <div class="subscription-card-detail">
                    <div class="subscription-card-label">Dias Restantes</div>
                    <div class="subscription-card-value">
                      <span class="days-left" [ngClass]="getDaysLeftClass(sub)">{{ getDaysLeft(sub) }}</span>
                    </div>
                  </div>
                  <div class="subscription-card-detail">
                    <div class="subscription-card-label">Data Fim</div>
                    <div class="subscription-card-value">{{ formatDate(sub.endDate) }}</div>
                  </div>
                </div>

                <div class="subscription-card-actions" (click)="$event.stopPropagation()">
                  <button mat-stroked-button (click)="viewSubscription(sub)">
                    <mat-icon>visibility</mat-icon>
                    Ver
                  </button>
                  <button mat-stroked-button color="primary" (click)="renewSubscription(sub)">
                    <mat-icon>refresh</mat-icon>
                    Renovar
                  </button>
                  <button mat-stroked-button color="warn" (click)="cancelSubscription(sub)">
                    <mat-icon>cancel</mat-icon>
                    Cancelar
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-card.critical {
      border-color: #f44336;
      background: linear-gradient(135deg, #fff 0%, #ffebee 100%);
    }

    .stat-card.critical:hover {
      background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    }

    .stat-card.warning {
      border-color: #ff9800;
      background: linear-gradient(135deg, #fff 0%, #fff3e0 100%);
    }

    .stat-card.warning:hover {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    }

    .stat-card.caution {
      border-color: #ffc107;
      background: linear-gradient(135deg, #fff 0%, #fffde7 100%);
    }

    .stat-card.caution:hover {
      background: linear-gradient(135deg, #fffde7 0%, #fff9c4 100%);
    }

    .stat-card.info {
      border-color: #2196F3;
      background: linear-gradient(135deg, #fff 0%, #e3f2fd 100%);
    }

    .stat-card.info:hover {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .stat-card.critical .stat-icon {
      background: #ffebee;
    }

    .stat-card.critical .stat-icon mat-icon {
      color: #f44336;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-card.warning .stat-icon {
      background: #fff3e0;
    }

    .stat-card.warning .stat-icon mat-icon {
      color: #ff9800;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-card.caution .stat-icon {
      background: #fffde7;
    }

    .stat-card.caution .stat-icon mat-icon {
      color: #ffc107;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-card.info .stat-icon {
      background: #e3f2fd;
    }

    .stat-card.info .stat-icon mat-icon {
      color: #2196F3;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      line-height: 1;
      color: #333;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 500;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h1 { margin: 0 0 8px 0; color: #2196F3; font-size: 28px; }
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

    .mobile-cards { display: none; }
    .desktop-table { display: block; }

    .subscription-card {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s;
    }

    .subscription-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .subscription-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .subscription-card-title {
      font-weight: 600;
      color: #333;
      font-size: 16px;
    }

    .subscription-card-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }

    .subscription-card-detail {
      display: flex;
      flex-direction: column;
    }

    .subscription-card-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .subscription-card-value {
      font-size: 14px;
      color: #333;
    }

    .subscription-price {
      font-weight: 600;
      color: #2196F3;
      font-size: 16px;
    }

    .subscription-card-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .container { padding: 16px; }
      .header { flex-direction: column; align-items: flex-start; gap: 16px; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .stat-card { padding: 16px; gap: 12px; }
      .stat-icon { width: 40px; height: 40px; }
      .stat-card .stat-icon mat-icon { font-size: 24px !important; width: 24px !important; height: 24px !important; }
      .stat-value { font-size: 24px; }
      .stat-label { font-size: 11px; }
      .toolbar { flex-direction: column; align-items: stretch; gap: 16px; }
      .search-bar mat-form-field { width: 100%; }
      .filters { flex-wrap: wrap; }
      .filters mat-form-field { width: 120px; }
      .desktop-table { display: none; }
      .mobile-cards { display: block; }
      .subscription-card-details { grid-template-columns: 1fr; }
      .subscription-card-actions { justify-content: stretch; }
      .subscription-card-actions button { flex: 1; }
    }

    @media (max-width: 480px) {
      .stats-grid { grid-template-columns: 1fr; }
      .subscription-card-actions {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class SubscriptionsSimpleComponent implements OnInit {
  displayedColumns: string[] = ['client', 'plan', 'startDate', 'endDate', 'daysLeft', 'status', 'value', 'actions'];
  subscriptions = [...mockDatabase.subscriptions];
  filteredSubscriptions = [...this.subscriptions];
  searchTerm = '';
  statusFilter = 'all';
  planFilter = 'all';

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogConfig: DialogConfigService
  ) {}

  ngOnInit(): void {
    this.checkExpiredSubscriptions();
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
      case 'quarterly': return '3 Meses';
      case 'biannual': return '6 Meses';
      case 'annual': return '12 Meses';
      default: return plan;
    }
  }

  getDefaultPrice(plan: string): number {
    switch(plan) {
      case 'monthly': return 10.00;
      case 'quarterly': return 30.00;
      case 'biannual': return 60.00;
      case 'annual': return 100.00;
      default: return 0;
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'active': return 'Ativa';
      case 'inactive': return 'Inativa';
      case 'expired': return 'Expirada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  }

  checkExpiredSubscriptions(): void {
    this.subscriptions.forEach(sub => {
      const days = this.getDaysLeft(sub);
      if (days < 0 && !sub.manuallyActive && sub.status === 'active') {
        sub.status = 'inactive';
      }
    });
  }

  keepActive(subscription: any): void {
    import('../../../shared/components/confirm-dialog/confirm-dialog.component').then(m => {
      const dialogRef = this.dialog.open(
        m.ConfirmDialogComponent,
        this.dialogConfig.getResponsiveConfig({
          data: {
            title: 'Manter Subscrição Ativa',
            message: `Deseja manter ${subscription.clientName} ativo mesmo com a subscrição expirada? Será adicionado 1 mês.`,
            confirmText: 'Manter Ativo',
            cancelText: 'Cancelar'
          }
        })
      );

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const index = this.subscriptions.findIndex(s => s.id === subscription.id);
          if (index !== -1) {
            const newEndDate = new Date();
            newEndDate.setDate(newEndDate.getDate() + 30);
            this.subscriptions[index].status = 'active';
            this.subscriptions[index].manuallyActive = true;
            this.subscriptions[index].endDate = newEndDate;
            this.applyFilter();
            this.snackBar.open(`${subscription.clientName} mantido ativo por mais 1 mês`, 'Fechar', { duration: 3000 });
          }
        }
      });
    }).catch(() => {
      if (confirm(`Deseja manter ${subscription.clientName} ativo mesmo com a subscrição expirada?`)) {
        const index = this.subscriptions.findIndex(s => s.id === subscription.id);
        if (index !== -1) {
          const newEndDate = new Date();
          newEndDate.setDate(newEndDate.getDate() + 30);
          this.subscriptions[index].status = 'active';
          this.subscriptions[index].manuallyActive = true;
          this.subscriptions[index].endDate = newEndDate;
          this.applyFilter();
          this.snackBar.open(`${subscription.clientName} mantido ativo por mais 1 mês`, 'Fechar', { duration: 3000 });
        }
      }
    });
  }

  deactivate(subscription: any): void {
    const index = this.subscriptions.findIndex(s => s.id === subscription.id);
    if (index !== -1) {
      this.subscriptions[index].status = 'inactive';
      this.subscriptions[index].manuallyActive = false;
      this.applyFilter();
      this.snackBar.open(`${subscription.clientName} desativado`, 'Fechar', { duration: 2000 });
    }
  }

  getExpiryCount(period: number | string): number {
    if (period === 'expired') {
      return this.subscriptions.filter(sub => this.getDaysLeft(sub) < 0).length;
    }

    const periodNum = Number(period);
    return this.subscriptions.filter(sub => {
      const days = this.getDaysLeft(sub);
      return days >= 0 && days < periodNum;
    }).length;
  }

  showExpiryPeriod(period: number | string): void {
    let filteredSubs;

    if (period === 'expired') {
      filteredSubs = this.subscriptions.filter(sub => this.getDaysLeft(sub) < 0);
    } else {
      const periodNum = Number(period);
      filteredSubs = this.subscriptions.filter(sub => {
        const days = this.getDaysLeft(sub);
        return days >= 0 && days < periodNum;
      });
    }

    if (filteredSubs.length === 0) {
      this.snackBar.open('Nenhuma subscrição encontrada neste período', 'Fechar', { duration: 2000 });
      return;
    }

    import('./expiry-period-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.ExpiryPeriodDialogComponent, {
        width: '95vw',
        maxWidth: '900px',
        maxHeight: '90vh',
        panelClass: 'responsive-dialog',
        data: {
          period: period,
          subscriptions: filteredSubs
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.action === 'renew') {
          this.renewSubscription(result.subscription);
        } else if (result?.action === 'view_client') {
          // Aqui poderia navegar para a página do cliente
          this.snackBar.open(`Ver cliente: ${result.subscription.clientName}`, 'Fechar', { duration: 2000 });
        }
      });
    });
  }

  addSubscription(): void {
    this.snackBar.open('Adicionar nova subscrição: Em desenvolvimento', 'Fechar', { duration: 2000 });
  }

  viewSubscription(subscription: any): void {
    import('./view-subscription-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.ViewSubscriptionDialogComponent, {
        width: '95vw',
        maxWidth: '600px',
        maxHeight: '90vh',
        panelClass: 'responsive-dialog',
        data: {
          ...subscription,
          clientEmail: `${subscription.clientName.toLowerCase().replace(' ', '.')}@email.com`,
          clientPhone: '912345678',
          price: subscription.value,
          paymentStatus: 'paid',
          paymentMethod: 'stripe',
          paymentDate: subscription.startDate
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.action === 'edit') {
          this.editSubscription(result.subscription);
        } else if (result?.action === 'renew') {
          this.renewSubscription(result.subscription);
        } else if (result?.action === 'cancel') {
          this.confirmCancelSubscription(result.subscription);
        }
      });
    });
  }

  editSubscription(subscription: any): void {
    import('./edit-subscription-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.EditSubscriptionDialogComponent, {
        width: '95vw',
        maxWidth: '500px',
        maxHeight: '90vh',
        panelClass: 'responsive-dialog',
        data: {
          ...subscription,
          price: subscription.value,
          paymentStatus: 'paid',
          paymentMethod: 'stripe'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const index = this.subscriptions.findIndex(s => s.id === subscription.id);
          if (index !== -1) {
            this.subscriptions[index] = { ...this.subscriptions[index], ...result, value: result.price };
            this.applyFilter();
            this.snackBar.open('Subscrição atualizada com sucesso', 'Fechar', { duration: 2000 });
          }
        }
      });
    });
  }

  renewSubscription(subscription: any): void {
    // Criar objeto cliente baseado nos dados da subscrição
    const clientData = {
      id: subscription.id,
      name: subscription.clientName,
      email: `${subscription.clientName.toLowerCase().replace(' ', '.')}@email.com`,
      subscriptionEnd: subscription.endDate,
      status: subscription.status === 'active' ? 'active' : 'inactive'
    };

    import('../clients/manage-subscription-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.ManageSubscriptionDialogComponent, {
        width: '95vw',
        maxWidth: '800px',
        maxHeight: '90vh',
        panelClass: 'responsive-dialog',
        data: { client: clientData }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const index = this.subscriptions.findIndex(s => s.id === subscription.id);
          if (index !== -1) {
            // Atualizar subscrição baseado no resultado
            if (result.action === 'extended' || result.action === 'create') {
              this.subscriptions[index].endDate = result.client.subscriptionEnd;
              this.subscriptions[index].status = 'active';
              this.applyFilter();
              this.snackBar.open(`Subscrição de ${subscription.clientName} ${result.action === 'extended' ? 'estendida' : 'criada'}`, 'Fechar', { duration: 3000 });
            }
          }
        }
      });
    });
  }

  cancelSubscription(subscription: any): void {
    this.confirmCancelSubscription(subscription);
  }

  confirmCancelSubscription(subscription: any): void {
    import('../../../shared/components/confirm-dialog/confirm-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.ConfirmDialogComponent, {
        width: '95vw',
        maxWidth: '400px',
        maxHeight: '90vh',
        panelClass: 'responsive-dialog',
        data: {
          title: 'Cancelar Subscrição',
          message: `Tem a certeza que deseja cancelar a subscrição de ${subscription.clientName}?`,
          confirmText: 'Cancelar Subscrição',
          cancelText: 'Manter Ativa'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const index = this.subscriptions.findIndex(s => s.id === subscription.id);
          if (index !== -1) {
            this.subscriptions[index].status = 'cancelled';
            this.applyFilter();
            this.snackBar.open(`Subscrição de ${subscription.clientName} cancelada`, 'Fechar', { duration: 2000 });
          }
        }
      });
    }).catch(() => {
      // Fallback se o componente não existir
      if (confirm(`Tem a certeza que deseja cancelar a subscrição de ${subscription.clientName}?`)) {
        const index = this.subscriptions.findIndex(s => s.id === subscription.id);
        if (index !== -1) {
          this.subscriptions[index].status = 'cancelled';
          this.applyFilter();
          this.snackBar.open(`Subscrição de ${subscription.clientName} cancelada`, 'Fechar', { duration: 2000 });
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
    this.planFilter = 'all';
    this.applyFilter();
    this.snackBar.open('Filtros limpos', 'Fechar', { duration: 1500 });
  }
}
