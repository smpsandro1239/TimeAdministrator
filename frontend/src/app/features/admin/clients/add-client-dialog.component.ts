import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-client-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatCardModule, MatIconModule, FormsModule],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>
        <mat-icon class="title-icon">person_add</mat-icon>
        <span>Adicionar Novo Cliente</span>
      </h2>
    </div>

    <mat-dialog-content>
      <div class="form-container">
        <div class="form-section">
          <h3><mat-icon>contact_mail</mat-icon> Informações Pessoais</h3>

          <mat-form-field appearance="outline">
            <mat-label>Nome completo</mat-label>
            <input matInput [(ngModel)]="client.name" placeholder="Ex: João Silva" required>
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" [(ngModel)]="client.email" placeholder="Ex: joao@email.com" required>
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Telefone</mat-label>
            <input matInput [(ngModel)]="client.phone" placeholder="Ex: 912345678">
            <mat-icon matSuffix>phone</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Estado inicial</mat-label>
            <mat-select [(value)]="client.status">
              <mat-option value="active">Ativo</mat-option>
              <mat-option value="pending">Pendente</mat-option>
              <mat-option value="inactive">Inativo</mat-option>
            </mat-select>
            <mat-icon matSuffix>toggle_on</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Duração da Subscrição</mat-label>
            <mat-select [(ngModel)]="subscriptionDuration" required>
              <mat-option [value]="1">1 mês</mat-option>
              <mat-option [value]="3">3 meses</mat-option>
              <mat-option [value]="6">6 meses</mat-option>
              <mat-option [value]="12">12 meses</mat-option>
            </mat-select>
            <mat-icon matSuffix>calendar_month</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Notas (opcional)</mat-label>
            <textarea matInput [(ngModel)]="client.notes" placeholder="Informações adicionais sobre o cliente..." rows="3"></textarea>
            <mat-icon matSuffix>notes</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-section">
          <h3><mat-icon>notifications</mat-icon> Preferências de Notificação</h3>
          <p class="section-description">Escolha como o cliente quer receber notificações</p>

          <div class="checkbox-group">
            <mat-checkbox [(ngModel)]="client.notificationPreferences.email" class="notification-checkbox">
              <mat-icon>email</mat-icon>
              <span>Email</span>
            </mat-checkbox>
            <mat-checkbox [(ngModel)]="client.notificationPreferences.whatsapp" class="notification-checkbox">
              <mat-icon>chat</mat-icon>
              <span>WhatsApp</span>
            </mat-checkbox>
            <mat-checkbox [(ngModel)]="client.notificationPreferences.telegram" class="notification-checkbox">
              <mat-icon>send</mat-icon>
              <span>Telegram</span>
            </mat-checkbox>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!isValid()">
        <mat-icon>save</mat-icon>
        Guardar Cliente
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header { background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: white; margin: -24px -24px 24px -24px; padding: 24px; }
    .dialog-header h2 { display: flex; align-items: center; gap: 12px; margin: 0; }
    .title-icon { font-size: 28px; }

    .form-container { display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 500px; min-width: 0; }
    .form-section { background: #f8f9fa; padding: 20px; border-radius: 8px; }
    .form-section h3 { display: flex; align-items: center; gap: 8px; margin: 0 0 16px 0; color: #1976d2; font-size: 16px; }
    .section-description { margin: 0 0 16px 0; color: #666; font-size: 14px; }

    mat-form-field { width: 100%; margin-bottom: 8px; }

    .checkbox-group { display: flex; flex-direction: column; gap: 12px; }
    .notification-checkbox { display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 6px; transition: background 0.2s; }
    .notification-checkbox:hover { background: rgba(25, 118, 210, 0.1); }
    .notification-checkbox mat-icon { font-size: 18px; color: #1976d2; }

    .dialog-actions { padding: 16px 24px; }

    @media (max-width: 768px) {
      .form-container { max-width: 100%; }
      .dialog-header { margin: -24px -16px 16px -16px; padding: 16px; }
      .dialog-actions { padding: 16px; flex-direction: column; gap: 8px; }
      .dialog-actions button { width: 100%; }
      .form-section { padding: 16px; }
      .checkbox-group { gap: 8px; }
      .notification-checkbox { padding: 12px 8px; }
    }
  `]
})
export class AddClientDialogComponent {
  client: {
    name: string;
    email: string;
    phone: string;
    status: string;
    notes?: string;
    notificationPreferences: {
      email: boolean;
      whatsapp: boolean;
      telegram: boolean;
    };
    subscriptionEnd: Date | null;
  } = {
    name: '',
    email: '',
    phone: '',
    status: 'active',
    notes: '',
    notificationPreferences: {
      email: true,
      whatsapp: false,
      telegram: false
    },
    subscriptionEnd: null
  };

  subscriptionDuration: number | null = null;

  constructor(private dialogRef: MatDialogRef<AddClientDialogComponent>) {}

  isValid(): boolean {
    return !!(this.client.name && this.client.email && this.subscriptionDuration);
  }

  save(): void {
    if (this.isValid()) {
      // Calcular a data de expiração da subscrição
      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + this.subscriptionDuration!);
      this.client.subscriptionEnd = endDate;
      this.dialogRef.close(this.client);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
