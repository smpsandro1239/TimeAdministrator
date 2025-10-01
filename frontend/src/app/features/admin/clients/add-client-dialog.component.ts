import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-client-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatCardModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Adicionar Novo Cliente</h2>
    <mat-dialog-content>
      <div class="form-container">
        <mat-form-field appearance="outline">
          <mat-label>Nome completo</mat-label>
          <input matInput [(ngModel)]="client.name" placeholder="Ex: João Silva" required>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="client.email" placeholder="Ex: joao@email.com" required>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Telefone</mat-label>
          <input matInput [(ngModel)]="client.phone" placeholder="Ex: 912345678">
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Estado inicial</mat-label>
          <mat-select [(value)]="client.status">
            <mat-option value="active">Ativo</mat-option>
            <mat-option value="pending">Pendente</mat-option>
            <mat-option value="inactive">Inativo</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-card class="notification-preferences">
          <mat-card-header>
            <mat-card-title>Preferências de Notificação</mat-card-title>
            <mat-card-subtitle>Como o cliente quer receber notificações</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="checkbox-group">
              <mat-checkbox [(ngModel)]="client.notificationPreferences.email">
                Email
              </mat-checkbox>
              <mat-checkbox [(ngModel)]="client.notificationPreferences.whatsapp">
                WhatsApp
              </mat-checkbox>
              <mat-checkbox [(ngModel)]="client.notificationPreferences.telegram">
                Telegram
              </mat-checkbox>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!isValid()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 16px; min-width: 400px; }
    mat-form-field { width: 100%; }
    .notification-preferences { margin-top: 8px; }
    .checkbox-group { display: flex; flex-direction: column; gap: 8px; }
  `]
})
export class AddClientDialogComponent {
  client = {
    name: '',
    email: '',
    phone: '',
    status: 'active',
    notificationPreferences: {
      email: true,
      whatsapp: false,
      telegram: false
    }
  };

  constructor(private dialogRef: MatDialogRef<AddClientDialogComponent>) {}

  isValid(): boolean {
    return !!(this.client.name && this.client.email);
  }

  save(): void {
    if (this.isValid()) {
      this.dialogRef.close(this.client);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}