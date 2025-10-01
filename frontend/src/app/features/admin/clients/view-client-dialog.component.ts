import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-view-client-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>person</mat-icon>
      Detalhes do Cliente
    </h2>
    <mat-dialog-content>
      <div class="client-details">
        <mat-card>
          <mat-card-content>
            <div class="detail-row">
              <strong>Nome:</strong>
              <span>{{ data.client.name }}</span>
            </div>
            <div class="detail-row">
              <strong>Email:</strong>
              <span>{{ data.client.email }}</span>
            </div>
            <div class="detail-row">
              <strong>Telefone:</strong>
              <span>{{ data.client.phone || 'Não informado' }}</span>
            </div>
            <div class="detail-row">
              <strong>Estado:</strong>
              <span class="status" [ngClass]="data.client.status">{{ getStatusText(data.client.status) }}</span>
            </div>
            <div class="detail-row">
              <strong>ID:</strong>
              <span>#{{ data.client.id }}</span>
            </div>
          </mat-card-content>
        </mat-card>
        
        <div class="actions-section">
          <h3>Ações Disponíveis</h3>
          <button mat-stroked-button (click)="editClient()">
            <mat-icon>edit</mat-icon>
            Editar Cliente
          </button>
          <button mat-stroked-button (click)="manageSubscription()">
            <mat-icon>subscriptions</mat-icon>
            Gerir Subscrição
          </button>
          <button mat-stroked-button (click)="viewPayments()">
            <mat-icon>payment</mat-icon>
            Ver Pagamentos
          </button>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .client-details { min-width: 500px; }
    .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .status { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .status.active { background: #e8f5e8; color: #2e7d32; }
    .status.inactive { background: #ffebee; color: #c62828; }
    .status.pending { background: #fff3e0; color: #ef6c00; }
    .actions-section { margin-top: 24px; }
    .actions-section h3 { margin-bottom: 16px; color: #333; }
    .actions-section button { margin-right: 8px; margin-bottom: 8px; }
  `]
})
export class ViewClientDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ViewClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: any }
  ) {}

  getStatusText(status: string): string {
    switch(status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return status;
    }
  }

  editClient(): void {
    this.dialogRef.close({ action: 'edit', client: this.data.client });
  }

  manageSubscription(): void {
    this.dialogRef.close({ action: 'subscription', client: this.data.client });
  }

  viewPayments(): void {
    this.dialogRef.close({ action: 'payments', client: this.data.client });
  }

  close(): void {
    this.dialogRef.close();
  }
}