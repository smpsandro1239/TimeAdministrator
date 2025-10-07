import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'support';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  permissions: string[];
  avatar?: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

@Component({
  selector: 'app-user-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.user ? 'Editar Utilizador' : 'Novo Utilizador' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm" class="user-form">
        <mat-form-field>
          <mat-label>Nome</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Função</mat-label>
          <mat-select formControlName="role" required>
            <mat-option value="admin">Administrador</mat-option>
            <mat-option value="manager">Gestor</mat-option>
            <mat-option value="support">Suporte</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Estado</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="active">Ativo</mat-option>
            <mat-option value="inactive">Inativo</mat-option>
            <mat-option value="suspended">Suspenso</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field *ngIf="!data.user">
          <mat-label>Palavra-passe</mat-label>
          <input matInput type="password" formControlName="password" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!userForm.valid">
        {{ data.user ? 'Guardar' : 'Criar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-form { display: flex; flex-direction: column; gap: 16px; min-width: 400px; }
  `],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
})
export class UserDialogComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) {
    this.userForm = this.fb.group({
      name: [data.user?.name || '', Validators.required],
      email: [data.user?.email || '', [Validators.required, Validators.email]],
      role: [data.user?.role || 'support', Validators.required],
      status: [data.user?.status || 'active', Validators.required],
      password: [data.user ? '' : '', data.user ? [] : Validators.required]
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}

@Component({
  selector: 'app-users-advanced',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDialogModule, MatSnackBarModule, MatSlideToggleModule,
    MatChipsModule, MatTabsModule, MatMenuModule, MatDividerModule, LayoutComponent
  ],
  template: `
    <app-layout>
      <div class="container">
        <div class="header">
          <div class="header-info">
            <h1>Gestão de Utilizadores</h1>
            <p>Controlo de acessos e permissões do sistema</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="createUser()">
              <mat-icon>person_add</mat-icon>
              Novo Utilizador
            </button>
          </div>
        </div>

        <mat-tab-group [(selectedIndex)]="selectedTab">
          <!-- Users Tab -->
          <mat-tab label="Utilizadores">
            <div class="tab-content">
              <!-- Stats Cards -->
              <div class="stats-grid">
                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon class="total-icon">people</mat-icon>
                      <span>Total</span>
                    </div>
                    <div class="stat-value">{{ stats.total }}</div>
                    <div class="stat-details">
                      <span class="active">{{ stats.active }} ativos</span>
                      <span class="inactive">{{ stats.inactive }} inativos</span>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon class="admin-icon">admin_panel_settings</mat-icon>
                      <span>Administradores</span>
                    </div>
                    <div class="stat-value">{{ stats.admins }}</div>
                    <div class="stat-details">
                      <span>Acesso total ao sistema</span>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon class="manager-icon">manage_accounts</mat-icon>
                      <span>Gestores</span>
                    </div>
                    <div class="stat-value">{{ stats.managers }}</div>
                    <div class="stat-details">
                      <span>Gestão de clientes</span>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-header">
                      <mat-icon class="support-icon">support_agent</mat-icon>
                      <span>Suporte</span>
                    </div>
                    <div class="stat-value">{{ stats.support }}</div>
                    <div class="stat-details">
                      <span>Apoio ao cliente</span>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>

              <!-- Filters -->
              <mat-card class="filters-card">
                <mat-card-content>
                  <div class="filters-row">
                    <mat-form-field>
                      <mat-label>Pesquisar</mat-label>
                      <input matInput [(ngModel)]="searchTerm" (input)="filterUsers()" placeholder="Nome ou email">
                      <mat-icon matSuffix>search</mat-icon>
                    </mat-form-field>

                    <mat-form-field>
                      <mat-label>Função</mat-label>
                      <mat-select [(value)]="roleFilter" (selectionChange)="filterUsers()">
                        <mat-option value="">Todas</mat-option>
                        <mat-option value="admin">Administrador</mat-option>
                        <mat-option value="manager">Gestor</mat-option>
                        <mat-option value="support">Suporte</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field>
                      <mat-label>Estado</mat-label>
                      <mat-select [(value)]="statusFilter" (selectionChange)="filterUsers()">
                        <mat-option value="">Todos</mat-option>
                        <mat-option value="active">Ativo</mat-option>
                        <mat-option value="inactive">Inativo</mat-option>
                        <mat-option value="suspended">Suspenso</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Users Table -->
              <mat-card class="table-card">
                <mat-card-content>
                  <table mat-table [dataSource]="filteredUsers" matSort class="users-table">
                    <ng-container matColumnDef="avatar">
                      <th mat-header-cell *matHeaderCellDef></th>
                      <td mat-cell *matCellDef="let user">
                        <div class="user-avatar">
                          <mat-icon *ngIf="!user.avatar">account_circle</mat-icon>
                          <img *ngIf="user.avatar" [src]="user.avatar" [alt]="user.name">
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="name">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>Nome</th>
                      <td mat-cell *matCellDef="let user">
                        <div class="user-info">
                          <div class="user-name">{{ user.name }}</div>
                          <div class="user-email">{{ user.email }}</div>
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="role">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>Função</th>
                      <td mat-cell *matCellDef="let user">
                        <span class="role-badge" [ngClass]="user.role">
                          {{ getRoleText(user.role) }}
                        </span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
                      <td mat-cell *matCellDef="let user">
                        <span class="status-badge" [ngClass]="user.status">
                          {{ getStatusText(user.status) }}
                        </span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="lastLogin">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>Último Acesso</th>
                      <td mat-cell *matCellDef="let user">
                        {{ user.lastLogin ? (user.lastLogin | date:'dd/MM/yyyy HH:mm') : 'Nunca' }}
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="createdAt">
                      <th mat-header-cell *matHeaderCellDef mat-sort-header>Criado</th>
                      <td mat-cell *matCellDef="let user">
                        {{ user.createdAt | date:'dd/MM/yyyy' }}
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Acções</th>
                      <td mat-cell *matCellDef="let user">
                        <button mat-icon-button [matMenuTriggerFor]="userMenu">
                          <mat-icon>more_vert</mat-icon>
                        </button>
                        <mat-menu #userMenu="matMenu">
                          <button mat-menu-item (click)="editUser(user)">
                            <mat-icon>edit</mat-icon>
                            Editar
                          </button>
                          <button mat-menu-item (click)="viewPermissions(user)">
                            <mat-icon>security</mat-icon>
                            Permissões
                          </button>
                          <button mat-menu-item (click)="resetPassword(user)">
                            <mat-icon>lock_reset</mat-icon>
                            Reset Password
                          </button>
                          <mat-divider></mat-divider>
                          <button mat-menu-item (click)="toggleUserStatus(user)"
                                  [ngClass]="user.status === 'active' ? 'warn' : 'primary'">
                            <mat-icon>{{ user.status === 'active' ? 'block' : 'check_circle' }}</mat-icon>
                            {{ user.status === 'active' ? 'Suspender' : 'Ativar' }}
                          </button>
                          <button mat-menu-item (click)="deleteUser(user)" class="warn">
                            <mat-icon>delete</mat-icon>
                            Eliminar
                          </button>
                        </mat-menu>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: userColumns;"></tr>
                  </table>

                  <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Roles Tab -->
          <mat-tab label="Funções">
            <div class="tab-content">
              <div class="roles-header">
                <h2>Gestão de Funções</h2>
                <button mat-raised-button color="primary" (click)="createRole()">
                  <mat-icon>add</mat-icon>
                  Nova Função
                </button>
              </div>

              <div class="roles-grid">
                <mat-card class="role-card" *ngFor="let role of roles">
                  <mat-card-header>
                    <mat-card-title>{{ role.name }}</mat-card-title>
                    <mat-card-subtitle>{{ role.userCount }} utilizadores</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>{{ role.description }}</p>
                    <div class="permissions-count">
                      <mat-icon>security</mat-icon>
                      {{ role.permissions.length }} permissões
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button (click)="editRole(role)">
                      <mat-icon>edit</mat-icon>
                      Editar
                    </button>
                    <button mat-button (click)="viewRolePermissions(role)">
                      <mat-icon>visibility</mat-icon>
                      Ver Permissões
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Permissions Tab -->
          <mat-tab label="Permissões">
            <div class="tab-content">
              <div class="permissions-header">
                <h2>Sistema de Permissões</h2>
                <button mat-raised-button color="primary" (click)="createPermission()">
                  <mat-icon>add</mat-icon>
                  Nova Permissão
                </button>
              </div>

              <div class="permissions-categories">
                <mat-card class="category-card" *ngFor="let category of permissionCategories">
                  <mat-card-header>
                    <mat-card-title>{{ category.name }}</mat-card-title>
                    <mat-card-subtitle>{{ category.permissions.length }} permissões</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="permission-list">
                      <div class="permission-item" *ngFor="let permission of category.permissions">
                        <div class="permission-info">
                          <div class="permission-name">{{ permission.name }}</div>
                          <div class="permission-description">{{ permission.description }}</div>
                        </div>
                        <div class="permission-actions">
                          <button mat-icon-button (click)="editPermission(permission)">
                            <mat-icon>edit</mat-icon>
                          </button>
                        </div>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Activity Tab -->
          <mat-tab label="Atividade">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Atividade Recente</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="activity-list">
                    <div class="activity-item" *ngFor="let activity of recentActivity">
                      <div class="activity-icon">
                        <mat-icon [ngClass]="activity.type">{{ getActivityIcon(activity.type) }}</mat-icon>
                      </div>
                      <div class="activity-content">
                        <div class="activity-title">{{ activity.title }}</div>
                        <div class="activity-description">{{ activity.description }}</div>
                        <div class="activity-time">{{ activity.timestamp | date:'dd/MM/yyyy HH:mm' }}</div>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </app-layout>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .header h1 { margin: 0; color: #1976d2; font-size: 28px; }
    .header p { margin: 4px 0 0 0; color: #666; }
    .tab-content { padding: 24px 0; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-2px); }
    .stat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .stat-header mat-icon { font-size: 24px; }
    .total-icon { color: #1976d2; }
    .admin-icon { color: #d32f2f; }
    .manager-icon { color: #388e3c; }
    .support-icon { color: #f57c00; }
    .stat-value { font-size: 32px; font-weight: 600; color: #1976d2; margin-bottom: 8px; }
    .stat-details { display: flex; flex-direction: column; gap: 4px; }
    .active { color: #2e7d32; }
    .inactive { color: #666; }

    .filters-card { margin-bottom: 16px; }
    .filters-row { display: flex; gap: 16px; align-items: center; }
    .filters-row mat-form-field { min-width: 200px; }

    .table-card { margin-bottom: 24px; }
    .users-table { width: 100%; }
    .user-avatar { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
    .user-avatar mat-icon { font-size: 32px; color: #666; }
    .user-avatar img { width: 32px; height: 32px; border-radius: 50%; }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-weight: 500; }
    .user-email { font-size: 12px; color: #666; }

    .role-badge, .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .role-badge.admin { background: #ffebee; color: #d32f2f; }
    .role-badge.manager { background: #e8f5e8; color: #388e3c; }
    .role-badge.support { background: #fff3e0; color: #f57c00; }
    .status-badge.active { background: #e8f5e8; color: #2e7d32; }
    .status-badge.inactive { background: #f5f5f5; color: #666; }
    .status-badge.suspended { background: #ffebee; color: #c62828; }

    .roles-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .roles-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    .role-card { transition: transform 0.2s; }
    .role-card:hover { transform: translateY(-2px); }
    .permissions-count { display: flex; align-items: center; gap: 8px; margin-top: 12px; color: #666; }

    .permissions-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .permissions-categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 16px; }
    .category-card { height: fit-content; }
    .permission-list { display: flex; flex-direction: column; gap: 12px; }
    .permission-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; border-radius: 4px; background: #f5f5f5; }
    .permission-info { flex: 1; }
    .permission-name { font-weight: 500; margin-bottom: 4px; }
    .permission-description { font-size: 14px; color: #666; }

    .activity-list { display: flex; flex-direction: column; gap: 16px; }
    .activity-item { display: flex; gap: 12px; padding: 12px; border-radius: 8px; background: #f9f9f9; }
    .activity-icon mat-icon { font-size: 24px; }
    .activity-icon .login { color: #2e7d32; }
    .activity-icon .create { color: #1976d2; }
    .activity-icon .update { color: #f57c00; }
    .activity-icon .delete { color: #d32f2f; }
    .activity-content { flex: 1; }
    .activity-title { font-weight: 500; margin-bottom: 4px; }
    .activity-description { color: #666; margin-bottom: 4px; }
    .activity-time { font-size: 12px; color: #999; }

    @media (max-width: 768px) {
      .container { padding: 16px; }
      .header { flex-direction: column; gap: 16px; }
      .stats-grid { grid-template-columns: 1fr; }
      .filters-row { flex-direction: column; align-items: stretch; }
      .roles-grid { grid-template-columns: 1fr; }
      .permissions-categories { grid-template-columns: 1fr; }
    }
  `]
})
export class UsersAdvancedComponent implements OnInit {
  selectedTab = 0;

  stats = {
    total: 12,
    active: 10,
    inactive: 2,
    admins: 2,
    managers: 4,
    support: 6
  };

  searchTerm = '';
  roleFilter = '';
  statusFilter = '';

  userColumns = ['avatar', 'name', 'role', 'status', 'lastLogin', 'createdAt', 'actions'];

  users: User[] = [];
  filteredUsers: User[] = [];
  roles: Role[] = [];
  permissions: Permission[] = [];
  permissionCategories: any[] = [];
  recentActivity: any[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loadMockData();
  }

  ngOnInit() {
    this.filterUsers();
  }

  loadMockData() {
    // Mock users
    this.users = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@timeadmin.com',
        role: 'admin',
        status: 'active',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date('2024-01-15'),
        permissions: ['users.create', 'users.read', 'users.update', 'users.delete']
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria.santos@timeadmin.com',
        role: 'manager',
        status: 'active',
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
        createdAt: new Date('2024-02-01'),
        permissions: ['clients.read', 'clients.update', 'subscriptions.read']
      },
      {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro.costa@timeadmin.com',
        role: 'support',
        status: 'active',
        lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
        createdAt: new Date('2024-02-15'),
        permissions: ['clients.read', 'support.create']
      }
    ];

    // Mock roles
    this.roles = [
      {
        id: '1',
        name: 'Administrador',
        description: 'Acesso total ao sistema',
        permissions: ['*'],
        userCount: 2
      },
      {
        id: '2',
        name: 'Gestor',
        description: 'Gestão de clientes e subscrições',
        permissions: ['clients.*', 'subscriptions.read', 'payments.read'],
        userCount: 4
      },
      {
        id: '3',
        name: 'Suporte',
        description: 'Apoio ao cliente',
        permissions: ['clients.read', 'support.*'],
        userCount: 6
      }
    ];

    // Mock permissions
    this.permissionCategories = [
      {
        name: 'Utilizadores',
        permissions: [
          { id: '1', name: 'users.create', description: 'Criar utilizadores' },
          { id: '2', name: 'users.read', description: 'Ver utilizadores' },
          { id: '3', name: 'users.update', description: 'Editar utilizadores' },
          { id: '4', name: 'users.delete', description: 'Eliminar utilizadores' }
        ]
      },
      {
        name: 'Clientes',
        permissions: [
          { id: '5', name: 'clients.create', description: 'Criar clientes' },
          { id: '6', name: 'clients.read', description: 'Ver clientes' },
          { id: '7', name: 'clients.update', description: 'Editar clientes' },
          { id: '8', name: 'clients.delete', description: 'Eliminar clientes' }
        ]
      }
    ];

    // Mock activity
    this.recentActivity = [
      {
        type: 'login',
        title: 'Login realizado',
        description: 'Pedro Costa fez login no sistema',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        type: 'create',
        title: 'Utilizador criado',
        description: 'Novo utilizador Ana Ferreira foi criado',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        type: 'update',
        title: 'Permissões alteradas',
        description: 'Permissões do utilizador Maria Santos foram atualizadas',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
      }
    ];
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm ||
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      const matchesStatus = !this.statusFilter || user.status === this.statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  getRoleText(role: string): string {
    const roleMap: { [key: string]: string } = {
      admin: 'Administrador',
      manager: 'Gestor',
      support: 'Suporte'
    };
    return roleMap[role] || role;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      active: 'Ativo',
      inactive: 'Inativo',
      suspended: 'Suspenso'
    };
    return statusMap[status] || status;
  }

  getActivityIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      login: 'login',
      create: 'person_add',
      update: 'edit',
      delete: 'delete'
    };
    return iconMap[type] || 'info';
  }

  createUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '95vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      panelClass: 'responsive-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newUser: User = {
          id: Date.now().toString(),
          ...result,
          createdAt: new Date(),
          permissions: []
        };
        this.users.push(newUser);
        this.filterUsers();
        this.snackBar.open('Utilizador criado com sucesso', 'Fechar', { duration: 3000 });
      }
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '95vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      panelClass: 'responsive-dialog',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(user, result);
        this.snackBar.open('Utilizador atualizado com sucesso', 'Fechar', { duration: 3000 });
      }
    });
  }

  viewPermissions(user: User) {
    console.log('View permissions for:', user);
  }

  resetPassword(user: User) {
    if (confirm(`Reset da palavra-passe para ${user.name}?`)) {
      this.snackBar.open('Email de reset enviado', 'Fechar', { duration: 3000 });
    }
  }

  toggleUserStatus(user: User) {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const action = newStatus === 'active' ? 'ativado' : 'suspenso';

    if (confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} utilizador ${user.name}?`)) {
      user.status = newStatus;
      this.snackBar.open(`Utilizador ${action}`, 'Fechar', { duration: 3000 });
    }
  }

  deleteUser(user: User) {
    if (confirm(`Eliminar utilizador ${user.name}? Esta ação não pode ser desfeita.`)) {
      this.users = this.users.filter(u => u.id !== user.id);
      this.filterUsers();
      this.snackBar.open('Utilizador eliminado', 'Fechar', { duration: 3000 });
    }
  }

  createRole() {
    console.log('Create new role');
  }

  editRole(role: Role) {
    console.log('Edit role:', role);
  }

  viewRolePermissions(role: Role) {
    console.log('View role permissions:', role);
  }

  createPermission() {
    console.log('Create new permission');
  }

  editPermission(permission: Permission) {
    console.log('Edit permission:', permission);
  }
}
