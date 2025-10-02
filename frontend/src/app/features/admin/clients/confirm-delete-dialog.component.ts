import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-header">
      <div class="header-content">
        <div class="warning-icon">
          <mat-icon>warning</mat-icon>
        </div>
        <div class="header-text">
          <h2 mat-dialog-title>Eliminar Cliente</h2>
          <p class="subtitle">Esta ação é irreversível</p>
        </div>
      </div>
    </div>
    
    <mat-dialog-content>
      <div class="warning-content">
        <p class="question">Tem a certeza que deseja eliminar este cliente?</p>
        
        <div class="client-card">
          <div class="client-avatar">
            <mat-icon>person</mat-icon>
          </div>
          <div class="client-details">
            <h3>{{ data.client.name }}</h3>
            <p>{{ data.client.email }}</p>
            <div class="client-meta">
              <span class="status" [ngClass]="data.client.status">{{ getStatusText(data.client.status) }}</span>
              <span class="phone" *ngIf="data.client.phone">
                <mat-icon>phone</mat-icon>
                {{ data.client.phone }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="warning-box">
          <mat-icon class="warning-icon">info</mat-icon>
          <div class="warning-text">
            <strong>Atenção:</strong> Todos os dados associados a este cliente serão permanentemente eliminados, incluindo:
            <ul>
              <li>Informações pessoais</li>
              <li>Histórico de subscrições</li>
              <li>Registos de pagamentos</li>
              <li>Preferências de notificação</li>
            </ul>
          </div>
        </div>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions class="dialog-actions">
      <button mat-stroked-button (click)="cancel()" class="cancel-btn">
        <mat-icon>close</mat-icon>
        Cancelar
      </button>
      <button mat-raised-button color="warn" (click)="confirm()" class="delete-btn">
        <mat-icon>delete_forever</mat-icon>
        Eliminar Definitivamente
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
      color: white;
      margin: -24px -24px 24px -24px;
      padding: 24px;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .warning-icon {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .warning-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    
    .header-text h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    
    .subtitle {
      margin: 4px 0 0 0;
      opacity: 0.9;
      font-size: 14px;
    }
    
    .warning-content {
      min-width: 400px;
      max-width: 500px;
    }
    
    .question {
      font-size: 16px;
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .client-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
      border: 2px solid #e9ecef;
    }
    
    .client-avatar {
      background: #1976d2;
      color: white;
      border-radius: 50%;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .client-avatar mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .client-details h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .client-details p {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 14px;
    }
    
    .client-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .status {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .status.active { background: #e8f5e8; color: #2e7d32; }
    .status.inactive { background: #ffebee; color: #c62828; }
    .status.pending { background: #fff3e0; color: #ef6c00; }
    
    .phone {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #666;
    }
    
    .phone mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    
    .warning-box {
      background: #fff3e0;
      border: 1px solid #ffcc02;
      border-radius: 8px;
      padding: 16px;
      margin-top: 20px;
      display: flex;
      gap: 12px;
    }
    
    .warning-box .warning-icon {
      color: #ef6c00;
      flex-shrink: 0;
      background: none;
      padding: 0;
    }
    
    .warning-box .warning-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .warning-text {
      font-size: 14px;
      color: #333;
      line-height: 1.4;
    }
    
    .warning-text ul {
      margin: 8px 0 0 0;
      padding-left: 16px;
    }
    
    .warning-text li {
      margin-bottom: 4px;
      color: #666;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 24px;
    }
    
    .cancel-btn {
      flex: 1;
    }
    
    .delete-btn {
      flex: 1;
    }
    
    @media (max-width: 768px) {
      .warning-content {
        min-width: 0;
        max-width: 100%;
      }
      
      .dialog-header {
        margin: -24px -16px 16px -16px;
        padding: 16px;
      }
      
      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }
      
      .warning-icon {
        padding: 8px;
      }
      
      .warning-icon mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      
      .header-text h2 {
        font-size: 20px;
      }
      
      .client-card {
        flex-direction: column;
        text-align: center;
        padding: 16px;
      }
      
      .client-meta {
        justify-content: center;
        flex-wrap: wrap;
      }
      
      .warning-box {
        flex-direction: column;
        text-align: center;
      }
      
      .dialog-actions {
        flex-direction: column;
        gap: 8px;
      }
      
      .cancel-btn,
      .delete-btn {
        width: 100%;
      }
    }
    
    @media (max-width: 480px) {
      .client-card {
        padding: 12px;
      }
      
      .client-details h3 {
        font-size: 16px;
      }
      
      .question {
        font-size: 15px;
      }
      
      .warning-text {
        font-size: 13px;
      }
    }
  `]
})
export class ConfirmDeleteDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
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

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}