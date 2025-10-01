import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatBadgeModule, MatTableModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="page-container">
        <div class="header">
          <h1>Pagamentos</h1>
          <p>Gerir pagamentos e aprovações</p>
        </div>
        
        <div class="stats-grid">
          <mat-card class="stat-card pending">
            <mat-card-content>
              <mat-icon>pending</mat-icon>
              <h3>3</h3>
              <p>Pendentes</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card approved">
            <mat-card-content>
              <mat-icon>check_circle</mat-icon>
              <h3>15</h3>
              <p>Aprovados</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card rejected">
            <mat-card-content>
              <mat-icon>cancel</mat-icon>
              <h3>2</h3>
              <p>Rejeitados</p>
            </mat-card-content>
          </mat-card>
        </div>
        
        <mat-card class="payments-table">
          <mat-card-header>
            <mat-card-title>Pagamentos Pendentes</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table class="payment-table">
              <tr class="payment-row">
                <td class="client-cell">
                  <div class="client-info">
                    <strong>João Silva</strong>
                    <small>Plano Mensal</small>
                  </div>
                </td>
                <td class="amount-cell">€29.99</td>
                <td class="date-cell">28/09/2024</td>
                <td class="status-cell">
                  <span class="status pending">Pendente</span>
                </td>
                <td class="actions-cell">
                  <button mat-button color="primary">Aprovar</button>
                  <button mat-button color="warn">Rejeitar</button>
                </td>
              </tr>
              
              <tr class="payment-row">
                <td class="client-cell">
                  <div class="client-info">
                    <strong>Maria Santos</strong>
                    <small>Plano Anual</small>
                  </div>
                </td>
                <td class="amount-cell">€279.99</td>
                <td class="date-cell">27/09/2024</td>
                <td class="status-cell">
                  <span class="status pending">Pendente</span>
                </td>
                <td class="actions-cell">
                  <button mat-button color="primary">Aprovar</button>
                  <button mat-button color="warn">Rejeitar</button>
                </td>
              </tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>
    </app-layout>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { margin-bottom: 24px; }
    .header h1 { margin: 0; color: #333; }
    .header p { margin: 8px 0 0 0; color: #666; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { text-align: center; }
    .stat-card.pending { border-left: 4px solid #FF9800; }
    .stat-card.approved { border-left: 4px solid #4CAF50; }
    .stat-card.rejected { border-left: 4px solid #f44336; }
    .stat-card mat-icon { font-size: 32px; width: 32px; height: 32px; margin-bottom: 8px; }
    .stat-card h3 { margin: 8px 0 4px 0; font-size: 24px; }
    .stat-card p { margin: 0; color: #666; }
    .payments-table { margin-top: 24px; }
    .payment-table { width: 100%; }
    .payment-row { border-bottom: 1px solid #e0e0e0; }
    .payment-row td { padding: 16px 8px; }
    .client-info strong { display: block; }
    .client-info small { color: #666; }
    .amount-cell { font-weight: 500; color: #4CAF50; }
    .status.pending { background: #fff3e0; color: #FF9800; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
    .actions-cell button { margin-right: 8px; }
  `]
})
export class PaymentsComponent {}