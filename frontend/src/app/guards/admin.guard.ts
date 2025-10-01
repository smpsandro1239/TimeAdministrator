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
    
    if (this.authService.isAuthenticated()) {
      return true; // Temporariamente permitir acesso
    }
    
    console.log('AdminGuard - Redirecionando para dashboard');
    this.router.navigate(['/dashboard']);
    return false;
  }
}