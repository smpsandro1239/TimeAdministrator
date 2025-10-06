import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Não mostrar loading para algumas URLs específicas
    const skipLoadingUrls = [
      '/assets/',
      '/favicon.ico',
      '/manifest.json'
    ];

    const shouldSkipLoading = skipLoadingUrls.some(url => request.url.includes(url));

    if (!shouldSkipLoading) {
      this.totalRequests++;
      this.loadingService.setLoading(true, request.url);
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (!shouldSkipLoading) {
          this.totalRequests--;
          if (this.totalRequests === 0) {
            this.loadingService.setLoading(false, request.url);
          }
        }
      })
    );
  }
}
