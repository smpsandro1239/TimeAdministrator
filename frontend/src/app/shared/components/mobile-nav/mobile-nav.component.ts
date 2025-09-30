import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../../services/auth.service';
import { User, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule
  ],
  template: `
    <nav *ngIf="isMobile$ | async" class="mobile-nav">
      <!-- Admin Navigation -->
      <div *ngIf="isAdmin" class="nav-items">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <mat-icon>dashboard</mat-icon>
          <span>Dashboard</span>
        </a>
        
        <a routerLink="/admin/clients" routerLinkActive="active" class="nav-item">
          <mat-icon>people</mat-icon>
          <span>Clientes</span>
        </a>
        
        <a routerLink="/admin/payments" routerLinkActive="active" class="nav-item">
          <mat-icon matBadge="3" matBadgeColor="warn" matBadgeSize="small">payment</mat-icon>
          <span>Pagamentos</span>
        </a>
        
        <a routerLink="/admin/subscriptions" routerLinkActive="active" class="nav-item">
          <mat-icon>subscriptions</mat-icon>
          <span>Subscrições</span>
        </a>
        
        <a routerLink="/admin/notifications" routerLinkActive="active" class="nav-item">
          <mat-icon>notifications</mat-icon>
          <span>Notificações</span>
        </a>
      </div>

      <!-- Client Navigation -->
      <div *ngIf="isClient" class="nav-items">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <mat-icon>dashboard</mat-icon>
          <span>Dashboard</span>
        </a>
        
        <a routerLink="/client/profile" routerLinkActive="active" class="nav-item">
          <mat-icon>person</mat-icon>
          <span>Perfil</span>
        </a>
        
        <a routerLink="/client/subscription" routerLinkActive="active" class="nav-item">
          <mat-icon>card_membership</mat-icon>
          <span>Subscrição</span>
        </a>
        
        <a routerLink="/client/payments" routerLinkActive="active" class="nav-item">
          <mat-icon>receipt</mat-icon>
          <span>Pagamentos</span>
        </a>
        
        <a routerLink="/client/new-subscription" routerLinkActive="active" class="nav-item">
          <mat-icon>add_circle</mat-icon>
          <span>Nova</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .mobile-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top: 1px solid #e0e0e0;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      padding: 8px 0;
    }
    
    .nav-items {
      display: flex;
      justify-content: space-around;
      align-items: center;
      max-width: 100%;
      overflow-x: auto;
    }
    
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      text-decoration: none;
      color: #666;
      border-radius: 8px;
      transition: all 0.2s ease;
      min-width: 60px;
      flex: 1;
      max-width: 80px;
    }
    
    .nav-item:hover {
      background: rgba(25, 118, 210, 0.1);
      color: #1976d2;
    }
    
    .nav-item.active {
      color: #1976d2;
      background: rgba(25, 118, 210, 0.1);
    }
    
    .nav-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-bottom: 4px;
    }
    
    .nav-item span {
      font-size: 10px;
      font-weight: 500;
      text-align: center;
      line-height: 1.2;
    }
  `]
})
export class MobileNavComponent implements OnInit {
  isMobile$: Observable<boolean>;
  currentUser: User | null = null;
  isAdmin = false;
  isClient = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(map(result => result.matches));
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === UserRole.ADMIN;
      this.isClient = user?.role === UserRole.CLIENT;
    });
  }
}