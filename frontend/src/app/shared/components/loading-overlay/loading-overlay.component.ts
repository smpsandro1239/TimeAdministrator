import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loading-overlay" *ngIf="isLoading" [@fadeInOut]>
      <div class="loading-container">
        <mat-spinner diameter="50" class="loading-spinner"></mat-spinner>
        <div class="loading-text">
          <h3>A carregar...</h3>
          <p>Por favor aguarde</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(4px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease-in-out;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 40px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .loading-spinner {
      --mdc-circular-progress-active-indicator-color: #1976d2;
    }

    .loading-text {
      text-align: center;
    }

    .loading-text h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }

    .loading-text p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* Responsividade */
    @media (max-width: 480px) {
      .loading-container {
        padding: 30px 20px;
        margin: 20px;
        gap: 16px;
      }

      .loading-text h3 {
        font-size: 16px;
      }

      .loading-text p {
        font-size: 13px;
      }
    }
  `],
  animations: [
    // Adicionar animações do Angular se necessário
  ]
})
export class LoadingOverlayComponent implements OnInit, OnDestroy {
  isLoading = false;
  private subscription: Subscription = new Subscription();

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.subscription = this.loadingService.isLoading$.subscribe(
      loading => {
        this.isLoading = loading;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
