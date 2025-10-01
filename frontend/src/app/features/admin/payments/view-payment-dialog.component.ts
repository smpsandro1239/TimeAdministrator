import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-view-payment-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Detalhes do Pagamento</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content>
      <div class="payment-info">
        <div class="info-section">
          <h3>Cliente</h3>
          <p><strong>Nome:</strong> {{ data.clientName }}</p>
          <p><strong>Email:</strong> {{ getClientEmail() }}</p>
        </div>
        
        <mat-divider></mat-divider>
        
        <div class="info-section">
          <h3>Pagamento</h3>
          <p><strong>Referência:</strong> {{ data.reference }}</p>
          <p><strong>Valor:</strong> {{ data.amount }}€</p>
          <p><strong>Método:</strong> {{ getMethodText(data.method) }}</p>
          <p><strong>Data:</strong> {{ formatDate(data.date) }}</p>
          <p><strong>Estado:</strong> 
            <mat-chip [ngClass]="data.status">{{ getStatusText(data.status) }}</mat-chip>
          </p>
        </div>
        
        <mat-divider *ngIf="data.notes"></mat-divider>
        
        <div class="info-section" *ngIf="data.notes">
          <h3>Observações</h3>
          <p>{{ data.notes }}</p>
        </div>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions>
      <button mat-button *ngIf="data.status === 'pending'" (click)="approve()" color="primary">
        <mat-icon>check</mat-icon>
        Aprovar
      </button>
      <button mat-button *ngIf="data.status === 'pending'" (click)="reject()" color="warn">
        <mat-icon>close</mat-icon>
        Rejeitar
      </button>
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .payment-info { max-height: 400px; overflow-y: auto; }
    .info-section { margin: 16px 0; }
    .info-section h3 { margin: 0 0 12px 0; color: #333; font-size: 16px; }
    .info-section p { margin: 8px 0; }
    mat-chip.pending { background: #fff3e0; color: #ef6c00; }
    mat-chip.approved { background: #e8f5e8; color: #2e7d32; }
    mat-chip.rejected { background: #ffebee; color: #c62828; }
  `]
})
export class ViewPaymentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getClientEmail(): string {
    return `${this.data.clientName.toLowerCase().replace(' ', '.')}@email.com`;
  }

  getMethodText(method: string): string {
    const methods: { [key: string]: string } = {
      'stripe': 'Cartão (Stripe)',
      'transfer': 'Transferência Bancária',
      'cash': 'Dinheiro'
    };
    return methods[method] || method;
  }

  getStatusText(status: string): string {
    const statuses: { [key: string]: string } = {
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'rejected': 'Rejeitado'
    };
    return statuses[status] || status;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-PT');
  }

  approve(): void {
    this.dialogRef.close({ action: 'approve', payment: this.data });
  }

  reject(): void {
    this.dialogRef.close({ action: 'reject', payment: this.data });
  }
}