import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule,
    MatChipsModule, MatProgressSpinnerModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],

})
export class UsersComponent {
  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'lastLogin', 'actions'];
  users: any[] = [
    {
      id: 1,
      name: 'Administrador',
      email: 'admin@timeadministrator.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date('2025-01-15T10:30:00')
    },
    {
      id: 2,
      name: 'João Silva',
      email: 'joao@exemplo.com',
      role: 'user',
      status: 'active',
      lastLogin: new Date('2025-01-14T15:45:00')
    },
    {
      id: 3,
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      role: 'moderator',
      status: 'inactive',
      lastLogin: new Date('2025-01-10T09:15:00')
    }
  ];
  
  loading = false;
  totalUsers = 3;
  pageSize = 10;

  getRoleText(role: string): string {
    const roles: { [key: string]: string } = {
      'admin': 'Administrador',
      'moderator': 'Moderador',
      'user': 'Utilizador'
    };
    return roles[role] || role;
  }

  getRoleColor(role: string): string {
    switch(role) {
      case 'admin': return 'warn';
      case 'moderator': return 'accent';
      case 'user': return 'primary';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    const statuses: { [key: string]: string } = {
      'active': 'Ativo',
      'inactive': 'Inativo'
    };
    return statuses[status] || status;
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'active': return 'primary';
      case 'inactive': return 'warn';
      default: return '';
    }
  }

  onSearchChange(value: string): void {
    // Implementar pesquisa
  }

  onPageChange(event: any): void {
    // Implementar paginação
  }

  addUser(): void {
    // Implementar adição de utilizador
  }

  editUser(user: any): void {
    // Implementar edição de utilizador
  }

  toggleUserStatus(user: any): void {
    user.status = user.status === 'active' ? 'inactive' : 'active';
  }

  deleteUser(user: any): void {
    if (confirm('Tem certeza que deseja eliminar este utilizador?')) {
      // Implementar eliminação
    }
  }
}