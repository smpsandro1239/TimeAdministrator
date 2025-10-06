import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../services/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Não interceptar erros de autenticação (já tratados pelo auth interceptor)
        if (error.status === 401) {
          return throwError(() => error);
        }

        // Criar contexto para o erro
        let context = 'Erro na requisição';
        if (request.method && request.url) {
          context = `${request.method} ${request.url}`;
        }

        // Tratar o erro através do serviço de erro
        this.errorService.handleHttpError(error, context);

        // Re-throw do erro para que componentes possam tratá-lo também
        return throwError(() => error);
      })
    );
  }
}
