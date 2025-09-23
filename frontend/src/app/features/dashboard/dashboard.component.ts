import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <app-layout>
      <div class="dashboard-container">
        <h1>Bem-vindo ao TimeAdministrator</h1>
        <p class="subtitle">Sistema de Gestão de Subscrições de Clientes</p>

        <div class="cards-container" *ngIf="!loading">
          <!-- Cards para Admin -->
          <ng-container *ngIf="isAdmin">
            <mat-card class="dashboard-card" (click)="navigate('/admin/clients')">
              <mat-card-header>
                <mat-icon mat-card-avatar>people</mat-icon>
                <mat-card-title>Clientes</mat-card-title>
                <mat-card-subtitle>Gerir clientes e subscrições</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-button color="primary">Ver Clientes</button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="dashboard-card" (click)="navigate('/admin/subscriptions')">
              <mat-card-header>
                <mat-icon mat-card-avatar>subscriptions</mat-icon>
                <mat-card-title>Subscrições</mat-card-title>
                <mat-card-subtitle>Gerir subscrições ativas</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-button color="primary">Ver Subscrições</button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="dashboard-card" (click)="navigate('/admin/payments')">
              <mat-card-header>
                <mat-icon mat-card-avatar>payment</mat-icon>
                <mat-card-title>Pagamentos</mat-card-title>
                <mat-card-subtitle>Aprovar e gerir pagamentos</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-button color="primary">Ver Pagamentos</button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="dashboard-card" (click)="navigate('/admin/notifications')">
              <mat-card-header>
                <mat-icon mat-card-avatar>notifications</mat-icon>
                <mat-card-title>Notificações</mat-card-title>
                <mat-card-subtitle>Enviar notificações</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-button color="primary">Ver Notificações</button>
              </mat-card-actions>
            </mat-card>
          </ng-container>

          <!-- Cards para Cliente -->
          <ng-container *ngIf="isClient">
            <mat-card class="dashboard-card" (click)="navigate('/client/profile')">
              <mat-card-header>
                <mat-icon mat-card-avatar>person</mat-icon>
                <mat-card-title>Meu Perfil</mat-card-title>
                <mat-card-subtitle>Ver e editar informações pessoais</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-button color="primary">Ver Perfil</button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="dashboard-card" (click)="navigate('/client/subscription')">
              <mat-card-header>
                <mat-icon mat-card-avatar>card_membership</mat-icon>
                <mat-card-title>Minha Subscrição</mat-card-title>
                <mat-card-subtitle>Estado da subscrição atual</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-button color="primary">Ver Subscrição</button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="dashboard-card" (click)="navigate('/client/payments')">
              <mat-card-header>
                <mat-icon mat-card-avatar>receipt</mat-icon>
                <mat-card-title>Meus Pagamentos</mat-card-title>
                <mat-card-subtitle>Histórico de pagamentos</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-button color="primary">Ver Pagamentos</button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="dashboard-card" (click)="navigate('/client/new-subscription')">
              <mat-card-header>
                <mat-icon mat-card-avatar>add_circle</mat-icon>
                <mat-card-title>Nova Subscrição</mat-card-title>
                <mat-card-subtitle>Adquirir nova subscrição</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-button color="accent">Subscrever</button>
              </mat-card-actions>
            </mat-card>
          </ng-container>
        </div>

        <div class="loading-container" *ngIf="loading">
          <mat-spinner></mat-spinner>
          <p>A carregar...</p>
        </div>
      </div>
    </app-layout>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 8px;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 40px;
      font-size: 16px;
    }

    .cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .dashboard-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      height: 180px;
    }

    .dashboard-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .dashboard-card mat-card-header {
      padding-bottom: 16px;
    }

    .dashboard-card mat-icon[mat-card-avatar] {
      font-size: 40px;
      width: 40px;
      height: 40px;
      background-color: #1976d2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
    }

    .loading-container p {
      margin-top: 16px;
      color: #666;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 10px;
      }
      
      .cards-container {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = true;
  isAdmin = false;
  isClient = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isAdmin = user.role === UserRole.ADMIN;
        this.isClient = user.role === UserRole.CLIENT;
        this.loading = false;
      }
    });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}