import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-users-simple',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="container">
        <div class="header">
          <div>
            <h1>Gestão de Utilizadores</h1>
            <p>Controlo de acessos e permissões do sistema</p>
          </div>
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            Novo Utilizador
          </button>
        </div>

        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-header">
                <mat-icon>people</mat-icon>
                <span>Total de Utilizadores</span>
              </div>
              <div class="stat-value">8</div>
              <div class="stat-details">3 administradores, 5 clientes</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-header">
                <mat-icon>login</mat-icon>
                <span>Activos Hoje</span>
              </div>
              <div class="stat-value">6</div>
              <div class="stat-details">75% dos utilizadores</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-header">
                <mat-icon>security</mat-icon>
                <span>Administradores</span>
              </div>
              <div class="stat-value">3</div>
              <div class="stat-details">Acesso total ao sistema</div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card class="users-table">
          <mat-card-header>
            <mat-card-title>Lista de Utilizadores</mat-card-title>
            <div class="table-actions">
              <mat-form-field appearance="outline">
                <mat-label>Filtrar por tipo</mat-label>
                <mat-select>
                  <mat-option value="all">Todos</mat-option>
                  <mat-option value="admin">Administradores</mat-option>
                  <mat-option value="client">Clientes</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Pesquisar</mat-label>
                <input matInput placeholder="Nome ou email">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </div>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="users" class="users-data-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nome</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-info">
                    <div class="user-avatar">
                      <mat-icon>person</mat-icon>
                    </div>
                    <div>
                      <div class="user-name">{{ user.name }}</div>
                      <div class="user-email">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Função</th>
                <td mat-cell *matCellDef="let user">
                  <span class="role-badge" [ngClass]="user.role">
                    {{ getRoleText(user.role) }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let user">
                  <span class="status-badge" [ngClass]="user.status">
                    {{ getStatusText(user.status) }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="lastLogin">
                <th mat-header-cell *matHeaderCellDef>Último Acesso</th>
                <td mat-cell *matCellDef="let user">{{ user.lastLogin | date:'dd/MM/yyyy HH:mm' }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acções</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button><mat-icon>security</mat-icon></button>
                  <button mat-icon-button color="warn"><mat-icon>delete</mat-icon></button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <div class="permissions-section">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Permissões do Sistema</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="permissions-grid">
                <div class="permission-item">
                  <mat-icon>dashboard</mat-icon>
                  <div class="permission-info">
                    <div class="permission-name">Dashboard</div>
                    <div class="permission-desc">Acesso ao painel principal</div>
                  </div>
                  <span class="permission-roles">Admin, Cliente</span>
                </div>

                <div class="permission-item">
                  <mat-icon>people</mat-icon>
                  <div class="permission-info">
                    <div class="permission-name">Gestão de Clientes</div>
                    <div class="permission-desc">CRUD completo de clientes</div>
                  </div>
                  <span class="permission-roles">Admin</span>
                </div>

                <div class="permission-item">
                  <mat-icon>payment</mat-icon>
                  <div class="permission-info">
                    <div class="permission-name">Gestão de Pagamentos</div>
                    <div class="permission-desc">Aprovar e gerir pagamentos</div>
                  </div>
                  <span class="permission-roles">Admin</span>
                </div>

                <div class="permission-item">
                  <mat-icon>assessment</mat-icon>
                  <div class="permission-info">
                    <div class="permission-name">Relatórios</div>
                    <div class="permission-desc">Acesso a relatórios avançados</div>
                  </div>
                  <span class="permission-roles">Admin</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </app-layout>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header h1 { margin: 0; color: #1976d2; font-size: 28px; }
    .header p { margin: 4px 0 0 0; color: #666; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-2px); }
    .stat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .stat-header mat-icon { font-size: 24px; color: #1976d2; }
    .stat-value { font-size: 32px; font-weight: 600; color: #1976d2; margin-bottom: 8px; }
    .stat-details { color: #666; font-size: 14px; }
    
    .users-table { margin-bottom: 24px; }
    .table-actions { display: flex; gap: 16px; align-items: center; }
    .users-data-table { width: 100%; }
    .user-info { display: flex; align-items: center; gap: 12px; }
    .user-avatar { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: #e3f2fd; }
    .user-avatar mat-icon { color: #1976d2; }
    .user-name { font-weight: 500; }
    .user-email { color: #666; font-size: 14px; }
    
    .role-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .role-badge.admin { background: #e8f5e8; color: #2e7d32; }
    .role-badge.client { background: #e3f2fd; color: #1976d2; }
    
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-badge.active { background: #e8f5e8; color: #2e7d32; }
    .status-badge.inactive { background: #ffebee; color: #c62828; }
    
    .permissions-section { }
    .permissions-grid { display: flex; flex-direction: column; gap: 16px; }
    .permission-item { display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 8px; background: #f8f9fa; }
    .permission-item mat-icon { color: #1976d2; font-size: 24px; }
    .permission-info { flex: 1; }
    .permission-name { font-weight: 500; margin-bottom: 4px; }
    .permission-desc { color: #666; font-size: 14px; }
    .permission-roles { background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    
    @media (max-width: 768px) {
      .container { padding: 16px; }
      .header { flex-direction: column; align-items: flex-start; gap: 16px; }
      .stats-grid { grid-template-columns: 1fr; }
      .table-actions { flex-direction: column; align-items: stretch; }
    }
  `]
})
export class UsersSimpleComponent implements OnInit {
  displayedColumns = ['name', 'role', 'status', 'lastLogin', 'actions'];
  
  users = [
    { name: 'Admin Principal', email: 'admin@timeadministrator.com', role: 'admin', status: 'active', lastLogin: new Date('2024-01-15T09:30:00') },
    { name: 'João Silva', email: 'joao.silva@email.com', role: 'client', status: 'active', lastLogin: new Date('2024-01-15T08:15:00') },
    { name: 'Maria Santos', email: 'maria.santos@email.com', role: 'client', status: 'active', lastLogin: new Date('2024-01-14T16:45:00') },
    { name: 'Pedro Costa', email: 'pedro.costa@email.com', role: 'client', status: 'inactive', lastLogin: new Date('2024-01-10T14:20:00') },
    { name: 'Ana Ferreira', email: 'ana.ferreira@email.com', role: 'client', status: 'active', lastLogin: new Date('2024-01-15T07:30:00') },
    { name: 'Carlos Oliveira', email: 'carlos.oliveira@email.com', role: 'admin', status: 'active', lastLogin: new Date('2024-01-15T10:00:00') },
    { name: 'Sofia Rodrigues', email: 'sofia.rodrigues@email.com', role: 'client', status: 'active', lastLogin: new Date('2024-01-14T19:15:00') },
    { name: 'Miguel Pereira', email: 'miguel.pereira@email.com', role: 'admin', status: 'active', lastLogin: new Date('2024-01-15T11:45:00') }
  ];

  constructor() {}

  ngOnInit() {
    console.log('UsersSimpleComponent loaded');
  }

  getRoleText(role: string): string {
    return role === 'admin' ? 'Administrador' : 'Cliente';
  }

  getStatusText(status: string): string {
    return status === 'active' ? 'Activo' : 'Inactivo';
  }
}