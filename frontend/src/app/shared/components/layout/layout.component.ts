import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from '../../../services/auth.service';
import { User, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          
          <!-- Menu Admin -->
          <ng-container *ngIf="isAdmin">
            <mat-divider></mat-divider>
            <h3 matSubheader>Administração</h3>
            <a mat-list-item routerLink="/admin/clients" routerLinkActive="active">
              <mat-icon>people</mat-icon>
              <span>Clientes</span>
            </a>
            <a mat-list-item routerLink="/admin/subscriptions" routerLinkActive="active">
              <mat-icon>subscriptions</mat-icon>
              <span>Subscrições</span>
            </a>
            <a mat-list-item routerLink="/admin/payments" routerLinkActive="active">
              <mat-icon>payment</mat-icon>
              <span>Pagamentos</span>
            </a>
            <a mat-list-item routerLink="/admin/notifications" routerLinkActive="active">
              <mat-icon>notifications</mat-icon>
              <span>Notificações</span>
            </a>
            <a mat-list-item routerLink="/admin/users" routerLinkActive="active">
              <mat-icon>admin_panel_settings</mat-icon>
              <span>Utilizadores</span>
            </a>
          </ng-container>

          <!-- Menu Cliente -->
          <ng-container *ngIf="isClient">
            <mat-divider></mat-divider>
            <h3 matSubheader>Cliente</h3>
            <a mat-list-item routerLink="/client/profile" routerLinkActive="active">
              <mat-icon>person</mat-icon>
              <span>Meu Perfil</span>
            </a>
            <a mat-list-item routerLink="/client/subscription" routerLinkActive="active">
              <mat-icon>card_membership</mat-icon>
              <span>Minha Subscrição</span>
            </a>
            <a mat-list-item routerLink="/client/payments" routerLinkActive="active">
              <mat-icon>receipt</mat-icon>
              <span>Meus Pagamentos</span>
            </a>
          </ng-container>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <span>TimeAdministrator</span>
          
          <span class="spacer"></span>
          
          <button mat-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
            <span>{{ currentUser?.name }}</span>
          </button>
          
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item routerLink="/dashboard">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Sair</span>
            </button>
          </mat-menu>
        </mat-toolbar>
        
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
    }

    .sidenav {
      width: 250px;
    }

    .sidenav .mat-toolbar {
      background: inherit;
    }

    .mat-toolbar.mat-primary {
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 20px;
      min-height: calc(100vh - 64px);
      background-color: #fafafa;
    }

    .active {
      background-color: rgba(0, 0, 0, 0.04);
    }

    @media (max-width: 768px) {
      .content {
        padding: 10px;
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  currentUser: User | null = null;
  isAdmin = false;
  isClient = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === UserRole.ADMIN;
      this.isClient = user?.role === UserRole.CLIENT;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}