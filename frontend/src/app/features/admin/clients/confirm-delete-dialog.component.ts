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
    <h2 mat-dialog-title>
      <mat-icon color="warn">warning</mat-icon>
      Confirmar Eliminação
    </h2>
    <mat-dialog-content>
      <div class="warning-content">
        <p>Tem a certeza que deseja eliminar o cliente:</p>
        <div class="client-info">
          <strong>{{ data.client.name }}</strong><br>
          <span>{{ data.client.email }}</span>
        </div>
        <p class="warning-text">
          <mat-icon>info</mat-icon>
          Esta ação não pode ser desfeita.
        </p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="warn" (click)="confirm()">
        <mat-icon>delete</mat-icon>
        Eliminar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .warning-content { min-width: 350px; }
    .client-info { 
      background: #f5f5f5; 
      padding: 16px; 
      border-radius: 8px; 
      margin: 16px 0; 
      border-left: 4px solid #ff9800;
    }
    .warning-text { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      color: #666; 
      font-size: 14px; 
      margin-top: 16px;
    }
    .warning-text mat-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class ConfirmDeleteDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: any }
  ) {}

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}