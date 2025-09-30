import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="page-container">
        <div class="header">
          <h1>Configurações</h1>
          <p>Configurações do sistema</p>
        </div>
        
        <mat-card>
          <mat-card-content>
            <div class="empty-state">
              <mat-icon>settings</mat-icon>
              <h2>Configurações do Sistema</h2>
              <p>SMTP, Stripe, Twilio e outras integrações</p>
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
export class SettingsComponent {}