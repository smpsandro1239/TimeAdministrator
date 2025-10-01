import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBottomSheetModule, MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-actions-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatDividerModule
  ],
  template: `
    <!-- Desktop Menu -->
    <div *ngIf="!(isMobile$ | async)" class="desktop-actions">
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="onView()">
          <mat-icon>visibility</mat-icon>
          <span>Ver Detalhes</span>
        </button>
        <button mat-menu-item (click)="onEdit()">
          <mat-icon>edit</mat-icon>
          <span>Editar</span>
        </button>
        <button mat-menu-item (click)="onManageSubscription()">
          <mat-icon>subscriptions</mat-icon>
          <span>Gerir Subscrição</span>
        </button>
        <button mat-menu-item (click)="onViewPayments()">
          <mat-icon>payment</mat-icon>
          <span>Ver Pagamentos</span>
        </button>
        <button mat-menu-item (click)="onSendNotification()">
          <mat-icon>notifications</mat-icon>
          <span>Enviar Notificação</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="onDelete()" class="delete-action">
          <mat-icon>delete</mat-icon>
          <span>Eliminar</span>
        </button>
      </mat-menu>
    </div>

    <!-- Mobile FAB -->
    <button *ngIf="isMobile$ | async" mat-fab color="primary" (click)="openMobileActions()" class="mobile-fab">
      <mat-icon>more_horiz</mat-icon>
    </button>
  `,
  styles: [`
    .desktop-actions {
      display: inline-block;
    }
    
    .mobile-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .delete-action {
      color: #f44336;
    }
  `]
})
export class ClientActionsMenuComponent {
  @Input() client!: Client;
  @Output() view = new EventEmitter<Client>();
  @Output() edit = new EventEmitter<Client>();
  @Output() delete = new EventEmitter<Client>();
  @Output() manageSubscription = new EventEmitter<Client>();
  @Output() viewPayments = new EventEmitter<Client>();
  @Output() sendNotification = new EventEmitter<Client>();

  isMobile$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private bottomSheet: MatBottomSheet
  ) {
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(map(result => result.matches));
  }

  onView() { this.view.emit(this.client); }
  onEdit() { this.edit.emit(this.client); }
  onDelete() { this.delete.emit(this.client); }
  onManageSubscription() { this.manageSubscription.emit(this.client); }
  onViewPayments() { this.viewPayments.emit(this.client); }
  onSendNotification() { this.sendNotification.emit(this.client); }

  openMobileActions() {
    this.bottomSheet.open(ClientMobileActionsComponent, {
      data: { client: this.client, actions: this }
    });
  }
}

@Component({
  selector: 'app-client-mobile-actions',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="mobile-actions-sheet">
      <div class="client-info">
        <mat-icon>person</mat-icon>
        <div>
          <h3>{{ data.client.name }}</h3>
          <p>{{ data.client.email }}</p>
        </div>
      </div>
      
      <div class="actions-list">
        <button mat-stroked-button (click)="action('view')" class="action-btn">
          <mat-icon>visibility</mat-icon>
          Ver Detalhes
        </button>
        
        <button mat-stroked-button (click)="action('edit')" class="action-btn">
          <mat-icon>edit</mat-icon>
          Editar Cliente
        </button>
        
        <button mat-stroked-button (click)="action('subscription')" class="action-btn">
          <mat-icon>subscriptions</mat-icon>
          Gerir Subscrição
        </button>
        
        <button mat-stroked-button (click)="action('payments')" class="action-btn">
          <mat-icon>payment</mat-icon>
          Ver Pagamentos
        </button>
        
        <button mat-stroked-button (click)="action('notification')" class="action-btn">
          <mat-icon>notifications</mat-icon>
          Enviar Notificação
        </button>
        
        <button mat-stroked-button (click)="action('delete')" class="action-btn delete">
          <mat-icon>delete</mat-icon>
          Eliminar Cliente
        </button>
      </div>
    </div>
  `,
  styles: [`
    .mobile-actions-sheet {
      padding: 20px;
      min-height: 300px;
    }
    
    .client-info {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #eee;
    }
    
    .client-info mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #1976d2;
    }
    
    .client-info h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
    }
    
    .client-info p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    
    .actions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .action-btn {
      justify-content: flex-start;
      padding: 16px;
      height: auto;
      text-align: left;
    }
    
    .action-btn mat-icon {
      margin-right: 16px;
    }
    
    .action-btn.delete {
      color: #f44336;
      border-color: #f44336;
    }
  `]
})
export class ClientMobileActionsComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<ClientMobileActionsComponent>
  ) {}

  action(type: string) {
    const actions = this.data.actions;
    switch(type) {
      case 'view': actions.onView(); break;
      case 'edit': actions.onEdit(); break;
      case 'subscription': actions.onManageSubscription(); break;
      case 'payments': actions.onViewPayments(); break;
      case 'notification': actions.onSendNotification(); break;
      case 'delete': actions.onDelete(); break;
    }
    this.bottomSheetRef.dismiss();
  }
}