import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="spinner-container">
      <mat-spinner [diameter]="size" [color]="color"></mat-spinner>
      <p *ngIf="message" class="spinner-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      gap: 12px;
    }

    .spinner-message {
      margin: 0;
      font-size: 14px;
      color: #666;
      text-align: center;
    }

    .spinner-container mat-spinner {
      margin: 0 auto;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size: number = 40;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() message?: string;
}
