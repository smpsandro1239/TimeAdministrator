import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { Client } from '../../../models/client.model';
import { ClientActionsMenuComponent } from '../client-actions-menu/client-actions-menu.component';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    ClientActionsMenuComponent
  ],
  template: `
    <mat-card class="client-card">
      <mat-card-header>
        <div mat-card-avatar class="client-avatar">
          <mat-icon>person</mat-icon>
        </div>
        <mat-card-title>{{ client.name }}</mat-card-title>
        <mat-card-subtitle>{{ client.email }}</mat-card-subtitle>
        
        <div class="card-actions">
          <app-client-actions-menu
            [client]="client"
            (view)="onView()"
            (edit)="onEdit()"
            (delete)="onDelete()"
            (manageSubscription)="onManageSubscription()"
            (viewPayments)="onViewPayments()"
            (sendNotification)="onSendNotification()">
          </app-client-actions-menu>
        </div>
      </mat-card-header>
      
      <mat-card-content>
        <div class="client-info">
          <div class="info-item" *ngIf="client.phone">
            <mat-icon>phone</mat-icon>
            <span>{{ client.phone }}</span>
          </div>
          
          <div class="info-item">
            <mat-icon>schedule</mat-icon>
            <span>{{ getDaysRemainingText() }}</span>
          </div>
        </div>
        
        <div class="status-chips">
          <mat-chip [class]="getStatusClass()">
            {{ client.isActive ? 'Ativo' : 'Inativo' }}
          </mat-chip>
          
          <mat-chip [class]="getDaysRemainingClass()">
            {{ getDaysRemainingText() }}
          </mat-chip>
        </div>
      </mat-card-content>
      
      <mat-card-actions>
        <button mat-button color="primary" (click)="onView()">
          <mat-icon>visibility</mat-icon>
          Ver Detalhes
        </button>
        
        <button mat-button color="accent" (click)="onEdit()">
          <mat-icon>edit</mat-icon>
          Editar
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .client-card {
      margin-bottom: 16px;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .client-card:hover {
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
    
    .client-avatar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .client-avatar mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .card-actions {
      margin-left: auto;
    }
    
    .client-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }
    
    .info-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .status-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    mat-chip.active {
      background-color: #4CAF50;
      color: white;
    }
    
    mat-chip.inactive {
      background-color: #f44336;
      color: white;
    }
    
    mat-chip.expired {
      background-color: #f44336;
      color: white;
    }
    
    mat-chip.warning {
      background-color: #FF9800;
      color: white;
    }
    
    mat-chip.ok {
      background-color: #4CAF50;
      color: white;
    }
    
    mat-card-actions {
      padding: 8px 16px;
      display: flex;
      gap: 8px;
    }
    
    mat-card-actions button {
      flex: 1;
    }
  `]
})
export class ClientCardComponent {
  @Input() client!: Client;
  @Output() view = new EventEmitter<Client>();
  @Output() edit = new EventEmitter<Client>();
  @Output() delete = new EventEmitter<Client>();
  @Output() manageSubscription = new EventEmitter<Client>();
  @Output() viewPayments = new EventEmitter<Client>();
  @Output() sendNotification = new EventEmitter<Client>();

  onView() { this.view.emit(this.client); }
  onEdit() { this.edit.emit(this.client); }
  onDelete() { this.delete.emit(this.client); }
  onManageSubscription() { this.manageSubscription.emit(this.client); }
  onViewPayments() { this.viewPayments.emit(this.client); }
  onSendNotification() { this.sendNotification.emit(this.client); }

  getStatusClass(): string {
    return this.client.isActive ? 'active' : 'inactive';
  }

  getDaysRemaining(): number {
    if (!this.client.subscriptionEndDate) return -1;
    
    const endDate = new Date(this.client.subscriptionEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  getDaysRemainingText(): string {
    const days = this.getDaysRemaining();
    
    if (days === -1) return 'Sem subscrição';
    if (days < 0) return 'Expirada';
    if (days === 0) return 'Expira hoje';
    if (days === 1) return '1 dia';
    return `${days} dias`;
  }

  getDaysRemainingClass(): string {
    const days = this.getDaysRemaining();
    
    if (days === -1 || days < 0) return 'expired';
    if (days <= 30) return 'warning';
    return 'ok';
  }
}