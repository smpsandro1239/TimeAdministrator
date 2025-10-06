import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingMap: Map<string, boolean> = new Map();

  public isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {}

  /**
   * Define o estado de loading global
   */
  setLoading(loading: boolean, url?: string): void {
    if (url) {
      if (loading) {
        this.loadingMap.set(url, loading);
      } else {
        this.loadingMap.delete(url);
      }
    }

    // O loading global é true se houver qualquer requisição ativa
    const globalLoading = this.loadingMap.size > 0;
    this.loadingSubject.next(globalLoading);
  }

  /**
   * Verifica se uma URL específica está carregando
   */
  isLoading(url?: string): boolean {
    if (url) {
      return this.loadingMap.has(url);
    }
    return this.loadingSubject.value;
  }

  /**
   * Obtém o estado de loading atual
   */
  getLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Limpa todos os estados de loading
   */
  clearLoading(): void {
    this.loadingMap.clear();
    this.loadingSubject.next(false);
  }
}
