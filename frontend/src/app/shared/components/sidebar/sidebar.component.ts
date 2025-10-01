import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

import { AuthService } from '../../../services/auth.service';
import { User, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatBadgeModule
  ],
  template: `
    <aside class="modern-sidebar">
      <div class="brand">
        <div class="brand-icon">
          <mat-icon>schedule</mat-icon>
        </div>
        <div class="brand-text">
          <h1>TimeAdmin</h1>
          <span>{{ currentUser?.name }}</span>
        </div>
      </div>

      <nav class="nav-menu">
        <!-- Admin Menu -->
        <div>
          <div class="menu-section">
            <span class="section-title">PRINCIPAL</span>
            <a routerLink="/dashboard" routerLinkActive="active" class="menu-item">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </a>
            <a routerLink="/admin/clients" routerLinkActive="active" class="menu-item">
              <mat-icon>people</mat-icon>
              <span>Clientes</span>
            </a>
            <a routerLink="/admin/subscriptions" routerLinkActive="active" class="menu-item">
              <mat-icon>subscriptions</mat-icon>
              <span>Subscrições</span>
            </a>
          </div>

          <div class="menu-section">
            <span class="section-title">FINANCEIRO</span>
            <a routerLink="/admin/payments" routerLinkActive="active" class="menu-item">
              <mat-icon matBadge="3" matBadgeColor="warn" matBadgeSize="small">payment</mat-icon>
              <span>Pagamentos</span>
            </a>
            <a routerLink="/admin/reports" routerLinkActive="active" class="menu-item">
              <mat-icon>assessment</mat-icon>
              <span>Relatórios</span>
            </a>
          </div>

          <div class="menu-section">
            <span class="section-title">SISTEMA</span>
            <a routerLink="/admin/notifications" routerLinkActive="active" class="menu-item">
              <mat-icon>notifications</mat-icon>
              <span>Notificações</span>
            </a>
            <a routerLink="/admin/users" routerLinkActive="active" class="menu-item">
              <mat-icon>admin_panel_settings</mat-icon>
              <span>Utilizadores</span>
            </a>
            <a routerLink="/admin/settings" routerLinkActive="active" class="menu-item">
              <mat-icon>settings</mat-icon>
              <span>Configurações</span>
            </a>
          </div>
        </div>

        <!-- Client Menu -->
        <div *ngIf="isClient">
          <div class="menu-section">
            <span class="section-title">MINHA CONTA</span>
            <a routerLink="/dashboard" routerLinkActive="active" class="menu-item">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </a>
            <a routerLink="/client/profile" routerLinkActive="active" class="menu-item">
              <mat-icon>person</mat-icon>
              <span>Meu Perfil</span>
            </a>
          </div>

          <div class="menu-section">
            <span class="section-title">SUBSCRIÇÃO</span>
            <a routerLink="/client/subscription" routerLinkActive="active" class="menu-item">
              <mat-icon>card_membership</mat-icon>
              <span>Minha Subscrição</span>
            </a>
            <a routerLink="/client/payments" routerLinkActive="active" class="menu-item">
              <mat-icon>receipt</mat-icon>
              <span>Pagamentos</span>
            </a>
            <a routerLink="/client/new-subscription" routerLinkActive="active" class="menu-item">
              <mat-icon>add_circle</mat-icon>
              <span>Nova Subscrição</span>
            </a>
          </div>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button mat-flat-button color="warn" (click)="logout()" class="logout-btn">
          <mat-icon>logout</mat-icon>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .modern-sidebar {
      width: 280px;
      height: 100vh;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      box-shadow: 4px 0 20px rgba(0,0,0,0.15);
      position: relative;
      overflow: hidden;
    }

    .modern-sidebar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
    }

    .brand {
      display: flex;
      align-items: center;
      padding: 32px 24px;
      position: relative;
      z-index: 1;
    }

    .brand-icon {
      width: 48px;
      height: 48px;
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
    }

    .brand-icon mat-icon {
      color: white;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .brand-text h1 {
      margin: 0;
      color: white;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .brand-text span {
      color: rgba(255,255,255,0.8);
      font-size: 13px;
      font-weight: 500;
    }

    .nav-menu {
      flex: 1;
      padding: 0 16px;
      position: relative;
      z-index: 1;
    }

    .menu-section {
      margin-bottom: 32px;
    }

    .section-title {
      display: block;
      color: rgba(255,255,255,0.6);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 12px;
      padding: 0 8px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 14px 16px;
      margin-bottom: 4px;
      text-decoration: none;
      color: rgba(255,255,255,0.8);
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .menu-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.1);
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    .menu-item:hover::before {
      transform: translateX(0);
    }

    .menu-item:hover {
      color: white;
      transform: translateX(4px);
    }

    .menu-item.active {
      background: rgba(255,255,255,0.15);
      color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .menu-item mat-icon {
      margin-right: 16px;
      width: 20px;
      height: 20px;
      font-size: 20px;
      position: relative;
      z-index: 1;
    }

    .menu-item span {
      font-size: 14px;
      font-weight: 500;
      position: relative;
      z-index: 1;
    }

    .sidebar-footer {
      padding: 24px;
      position: relative;
      z-index: 1;
    }

    .logout-btn {
      width: 100%;
      height: 48px;
      border-radius: 12px;
      background: rgba(244, 67, 54, 0.1) !important;
      color: #ff5252 !important;
      border: 1px solid rgba(244, 67, 54, 0.3);
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: rgba(244, 67, 54, 0.2) !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    }

    .logout-btn mat-icon {
      margin-right: 8px;
    }
  `]
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  isAdmin = false;
  isClient = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      console.log('Sidebar - User recebido:', user);
      this.currentUser = user;
      this.isAdmin = user?.role === UserRole.ADMIN;
      this.isClient = user?.role === UserRole.CLIENT;
      console.log('Sidebar - isAdmin:', this.isAdmin, 'isClient:', this.isClient);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}