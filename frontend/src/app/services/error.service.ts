import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface ErrorDetails {
  message: string;
  status?: number;
  url?: string;
  timestamp: Date;
  userAgent?: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorHistory: ErrorDetails[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Trata erros HTTP automaticamente
   */
  handleHttpError(error: any, context?: string): void {
    const errorDetails = this.parseError(error, context);

    // Log do erro
    console.error('HTTP Error:', errorDetails);

    // Armazenar no histórico
    this.errorHistory.push(errorDetails);

    // Limitar histórico a 50 erros
    if (this.errorHistory.length > 50) {
      this.errorHistory = this.errorHistory.slice(-50);
    }

    // Mostrar notificação baseada no tipo de erro
    this.showErrorNotification(errorDetails);

    // Ações específicas baseadas no código de status
    this.handleStatusSpecificActions(errorDetails);
  }

  /**
   * Trata erros de JavaScript
   */
  handleJavaScriptError(error: Error, context?: string): void {
    const errorDetails: ErrorDetails = {
      message: error.message,
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Adicionar contexto se fornecido
    if (context) {
      errorDetails.message = `${context}: ${errorDetails.message}`;
    }

    // Log do erro
    console.error('JavaScript Error:', errorDetails);

    // Armazenar no histórico
    this.errorHistory.push(errorDetails);

    // Mostrar notificação
    this.snackBar.open(
      'Ocorreu um erro inesperado. Tente novamente.',
      'Fechar',
      {
        duration: 5000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    );
  }

  /**
   * Trata erros de validação de formulários
   */
  handleValidationError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  /**
   * Obtém o histórico de erros
   */
  getErrorHistory(): ErrorDetails[] {
    return [...this.errorHistory];
  }

  /**
   * Limpa o histórico de erros
   */
  clearErrorHistory(): void {
    this.errorHistory = [];
  }

  /**
   * Reporta erro para serviço externo (se implementado)
   */
  reportError(errorDetails: ErrorDetails): void {
    // Aqui poderia ser implementado o envio para serviços como Sentry, LogRocket, etc.
    console.log('Reporting error to external service:', errorDetails);
  }

  private parseError(error: any, context?: string): ErrorDetails {
    const errorDetails: ErrorDetails = {
      message: 'Erro desconhecido',
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Adicionar ID do usuário se autenticado
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      errorDetails.userId = currentUser.id;
    }

    // Parse do erro HTTP
    if (error && typeof error === 'object') {
      if (error.status) {
        errorDetails.status = error.status;
      }

      if (error.url) {
        errorDetails.url = error.url;
      }

      // Extrair mensagem do erro
      if (error.error?.message) {
        errorDetails.message = error.error.message;
      } else if (error.message) {
        errorDetails.message = error.message;
      } else if (error.statusText) {
        errorDetails.message = error.statusText;
      } else if (typeof error === 'string') {
        errorDetails.message = error;
      }
    } else if (typeof error === 'string') {
      errorDetails.message = error;
    }

    // Adicionar contexto se fornecido
    if (context) {
      errorDetails.message = `${context}: ${errorDetails.message}`;
    }

    return errorDetails;
  }

  private showErrorNotification(errorDetails: ErrorDetails): void {
    let message = errorDetails.message;
    let duration = 5000;
    let panelClass = ['error-snackbar'];

    // Personalizar mensagem baseada no status
    if (errorDetails.status) {
      switch (errorDetails.status) {
        case 400:
          message = 'Dados inválidos. Verifique os campos e tente novamente.';
          panelClass = ['warning-snackbar'];
          break;
        case 401:
          message = 'Sessão expirada. Faça login novamente.';
          duration = 3000;
          break;
        case 403:
          message = 'Acesso negado. Você não tem permissão para esta ação.';
          break;
        case 404:
          message = 'Recurso não encontrado.';
          panelClass = ['warning-snackbar'];
          break;
        case 409:
          message = 'Conflito de dados. Verifique se o item já existe.';
          panelClass = ['warning-snackbar'];
          break;
        case 422:
          message = 'Dados inválidos. Verifique os campos obrigatórios.';
          panelClass = ['warning-snackbar'];
          break;
        case 429:
          message = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
          duration = 7000;
          break;
        case 500:
          message = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        case 503:
          message = 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.';
          duration = 10000;
          break;
        default:
          if (errorDetails.status >= 500) {
            message = 'Erro do servidor. Nossa equipe foi notificada.';
          }
          break;
      }
    }

    this.snackBar.open(message, 'Fechar', {
      duration,
      panelClass,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  private handleStatusSpecificActions(errorDetails: ErrorDetails): void {
    if (!errorDetails.status) return;

    switch (errorDetails.status) {
      case 401:
        // Redirecionar para login após um pequeno delay
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }, 3000);
        break;

      case 403:
        // Poderia redirecionar para página de acesso negado
        console.warn('Access denied - could redirect to forbidden page');
        break;

      case 503:
      case 502:
      case 504:
        // Poderia mostrar página de manutenção
        console.warn('Server error - could show maintenance page');
        break;
    }
  }
}
