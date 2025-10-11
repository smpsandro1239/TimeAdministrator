import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('AdminGuard - isAuthenticated:', this.authService.isAuthenticated());
    console.log('AdminGuard - isAdmin:', this.authService.isAdmin());

    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }

    console.log('AdminGuard - Acesso negado ou usuário não é admin');
    this.router.navigate(['/auth/login']);
    return false;
  }
}
