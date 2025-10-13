import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

@Component({
  selector: 'app-dashboard-simple',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="container">
        <h1>Dashboard - TimeAdministrator</h1>
        <p>Sistema de Gestão de Subscrições</p>

        <div class="cards">
          <mat-card>
            <mat-card-content>
              <h2>Bem-vindo!</h2>
              <p>Sistema funcionando corretamente</p>
            </mat-card-content>
          </mat-card>

          <mat-card>
            <mat-card-content>
              <h2>Clientes</h2>
              <p>{{ totalClients }} clientes registados</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </app-layout>
  `,
  styles: [`
    .container { padding: 24px; }
    h1 { color: #2196F3; margin-bottom: 8px; }
    p { color: #666; margin-bottom: 24px; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    mat-card { padding: 16px; }
  `]
})
export class DashboardSimpleComponent {
  totalClients = 8;
}
