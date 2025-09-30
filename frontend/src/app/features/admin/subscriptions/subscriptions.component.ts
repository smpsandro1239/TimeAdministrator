import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="page-container">
        <div class="header">
          <h1>Subscrições</h1>
          <p>Gerir todas as subscrições de clientes</p>
        </div>
        
        <mat-card>
          <mat-card-content>
            <div class="empty-state">
              <mat-icon>subscriptions</mat-icon>
              <h2>Gestão de Subscrições</h2>
              <p>Funcionalidade em desenvolvimento</p>
            </div>
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
    .empty-state { text-align: center; padding: 48px; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; color: #666; margin-bottom: 16px; }
    .empty-state h2 { margin: 0 0 8px 0; color: #333; }
    .empty-state p { margin: 0; color: #666; }
  `]
})
export class SubscriptionsComponent {}