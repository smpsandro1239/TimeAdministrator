import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorService } from './services/error.service';
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingOverlayComponent],
  template: `
    <router-outlet></router-outlet>
    <app-loading-overlay></app-loading-overlay>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'TimeAdministrator';
  private errorHandler: ((error: ErrorEvent) => void) | null = null;
  private unhandledRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    // Configurar handler global de erros JavaScript
    this.setupGlobalErrorHandling();
  }

  ngOnDestroy(): void {
    // Remover handlers de erro
    this.removeGlobalErrorHandling();
  }

  private setupGlobalErrorHandling(): void {
    // Handler para erros JavaScript não capturados
    this.errorHandler = (error: ErrorEvent) => {
      this.errorService.handleJavaScriptError(error.error, 'Erro JavaScript global');
    };

    // Handler para promises rejeitadas não tratadas
    this.unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      this.errorService.handleJavaScriptError(error, 'Promise rejeitada não tratada');
    };

    // Registrar os handlers
    window.addEventListener('error', this.errorHandler);
    window.addEventListener('unhandledrejection', this.unhandledRejectionHandler);
  }

  private removeGlobalErrorHandling(): void {
    if (this.errorHandler) {
      window.removeEventListener('error', this.errorHandler);
      this.errorHandler = null;
    }

    if (this.unhandledRejectionHandler) {
      window.removeEventListener('unhandledrejection', this.unhandledRejectionHandler);
      this.unhandledRejectionHandler = null;
    }
  }
}
