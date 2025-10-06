// c:/laragon/www/TimeAdministrator/frontend/src/app/features/client/subscription/cancel-subscription-dialog.component.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cancel-subscription-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-header">
      <div class="header-content">
        <div class="warning-icon">
          <mat-icon>warning</mat-icon>
        </div>
        <div class="title-section">
          <h2 mat-dialog-title>Confirmar Cancelamento</h2>
          <p class="subtitle">Esta ação é irreversível</p>
        </div>
      </div>
    </div>

    <mat-dialog-content>
      <div class="warning-content">
        <div class="warning-box">
          <mat-icon class="warning-box-icon">info</mat-icon>
          <div class="warning-text">
            <p class="question">Tem a certeza que deseja cancelar a sua subscrição?</p>
            <ul class="warning-list">
              <li>A sua subscrição permanecerá <strong>ativa até à data de término</strong></li>
              <li>Não será renovada automaticamente</li>
              <li>Perderá acesso aos benefícios após o término</li>
              <li>Esta ação <strong>não pode ser revertida</strong></li>
            </ul>
          </div>
        </div>

        <div class="info-box">
          <mat-icon>help_outline</mat-icon>
          <div class="info-text">
            <strong>Precisa de ajuda?</strong>
            <p>Se está a ter problemas, entre em contacto connosco antes de cancelar. Podemos ajudar!</p>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions class="dialog-actions">
      <button mat-stroked-button [mat-dialog-close]="false" class="cancel-btn">
        <mat-icon>arrow_back</mat-icon>
        Voltar
      </button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true" class="confirm-btn">
        <mat-icon>cancel</mat-icon>
        Sim, Cancelar Subscrição
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

    .title-section h2 {
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
      max-width: 550px;
      min-width: 450px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .warning-box {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      border: 1px solid #ffcc02;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      gap: 16px;
      border-left: 4px solid #ff9800;
    }

    .warning-box-icon {
      color: #ef6c00;
      font-size: 32px;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
    }

    .warning-text {
      flex: 1;
    }

    .question {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      line-height: 1.5;
    }

    .warning-list {
      margin: 0;
      padding-left: 20px;
      list-style: none;
    }

    .warning-list li {
      margin-bottom: 12px;
      color: #666;
      line-height: 1.6;
      position: relative;
      padding-left: 24px;
    }

    .warning-list li:before {
      content: '⚠';
      position: absolute;
      left: 0;
      color: #ff9800;
      font-size: 16px;
    }

    .warning-list li:last-child {
      margin-bottom: 0;
    }

    .info-box {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border: 1px solid #90caf9;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      border-left: 4px solid #2196F3;
    }

    .info-box mat-icon {
      color: #1976d2;
      font-size: 24px;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .info-text {
      flex: 1;
    }

    .info-text strong {
      display: block;
      margin-bottom: 4px;
      color: #1976d2;
      font-size: 14px;
    }

    .info-text p {
      margin: 0;
      color: #666;
      font-size: 13px;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      margin: 24px -24px -24px -24px;
    }

    .cancel-btn,
    .confirm-btn {
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

      .title-section h2 {
        font-size: 20px;
      }

      .warning-box,
      .info-box {
        flex-direction: column;
        text-align: center;
        align-items: center;
      }

      .warning-list {
        text-align: left;
      }

      .dialog-actions {
        flex-direction: column;
        gap: 8px;
        margin: 16px -16px -24px -16px;
      }

      .cancel-btn,
      .confirm-btn {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .question {
        font-size: 15px;
      }

      .warning-list li {
        font-size: 14px;
        margin-bottom: 10px;
      }
    }
  `],
})
export class CancelSubscriptionDialogComponent {
  constructor(public dialogRef: MatDialogRef<CancelSubscriptionDialogComponent>) {}
}
