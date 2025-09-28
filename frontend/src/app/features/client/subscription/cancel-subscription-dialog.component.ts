// c:/laragon/www/TimeAdministrator/frontend/src/app/features/client/subscription/cancel-subscription-dialog.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cancel-subscription-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon color="warn">warning</mat-icon>
      Confirmar Cancelamento
    </h2>
    <mat-dialog-content>
      <p>Tem a certeza que deseja cancelar a sua subscrição?</p>
      <p>
        Esta ação é <strong>irreversível</strong>. A sua subscrição permanecerá
        ativa até à data de término, mas não será renovada.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Voltar</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        Sim, Cancelar Subscrição
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 { display: flex; align-items: center; gap: 8px; }
    p { line-height: 1.5; }
  `],
})
export class CancelSubscriptionDialogComponent {
  constructor(public dialogRef: MatDialogRef<CancelSubscriptionDialogComponent>) {}
}