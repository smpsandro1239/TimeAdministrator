import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Client } from '../../../../models/client.model';

@Component({
  selector: 'app-view-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './view-client-dialog.component.html',
  styleUrl: './view-client-dialog.component.scss'
})
export class ViewClientDialogComponent implements OnInit {
  client: Client;
  daysRemaining: number = 0;
  daysRemainingText: string = '';

  constructor(
    private dialogRef: MatDialogRef<ViewClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: Client }
  ) {
    this.client = data.client;
  }

  ngOnInit(): void {
    this.calculateDaysRemaining();
  }

  calculateDaysRemaining(): void {
    if (!this.client.subscriptionEndDate) {
      this.daysRemaining = -1;
      this.daysRemainingText = 'Sem subscrição';
      return;
    }

    const endDate = new Date(this.client.subscriptionEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    this.daysRemaining = diffDays;

    if (diffDays < 0) {
      this.daysRemainingText = 'Expirada';
    } else if (diffDays === 0) {
      this.daysRemainingText = 'Expira hoje';
    } else if (diffDays === 1) {
      this.daysRemainingText = '1 dia restante';
    } else {
      this.daysRemainingText = `${diffDays} dias restantes`;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getStatusColor(): string {
    if (!this.client.isActive) return 'warn';
    if (this.daysRemaining < 0) return 'warn';
    if (this.daysRemaining <= 7) return 'accent';
    return 'primary';
  }

  getStatusText(): string {
    if (!this.client.isActive) return 'Inativo';
    if (this.daysRemaining < 0) return 'Subscrição Expirada';
    return 'Ativo';
  }
}
