import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

import { UserRole } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="logo-section">
            <mat-icon class="app-logo">schedule</mat-icon>
            <div class="title-section">
              <mat-card-title>TimeAdministrator</mat-card-title>
              <mat-card-subtitle>Gestão Inteligente de Subscrições</mat-card-subtitle>
            </div>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div class="welcome-message">
            <h3>Bem-vindo de volta!</h3>
            <p>Entre na sua conta para continuar</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Email</mat-label>
              <input matInput
                     type="email"
                     formControlName="email"
                     placeholder="seu@email.com"
                     autocomplete="email"
                     required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched">
                Email é obrigatório
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched">
                Digite um email válido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Password</mat-label>
              <input matInput
                     [type]="hidePassword ? 'password' : 'text'"
                     formControlName="password"
                     placeholder="Digite sua password"
                     autocomplete="current-password"
                     required>
              <button mat-icon-button
                      matSuffix
                      (click)="togglePasswordVisibility()"
                      type="button"
                      tabindex="-1">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched">
                Password é obrigatória
              </mat-error>
              <mat-error *ngIf="loginForm.get('password')?.hasError('minlength') && loginForm.get('password')?.touched">
                Password deve ter pelo menos 6 caracteres
              </mat-error>
            </mat-form-field>

            <div class="form-options">
              <mat-checkbox formControlName="rememberMe" class="remember-checkbox">
                Lembrar-me
              </mat-checkbox>
              <a routerLink="/auth/forgot-password" class="forgot-link">Esqueceu a password?</a>
            </div>

            <button mat-raised-button
                    color="primary"
                    type="submit"
                    [disabled]="loginForm.invalid || loading"
                    class="login-button">
              <mat-spinner diameter="20" *ngIf="loading" class="button-spinner"></mat-spinner>
              <mat-icon *ngIf="!loading">login</mat-icon>
              <span>Entrar</span>
            </button>
          </form>

          <div class="divider">
            <span>ou</span>
          </div>

          <div class="demo-accounts" *ngIf="!isProduction">
            <p class="demo-title">Contas de demonstração:</p>
            <div class="demo-account" (click)="loginWithDemo('admin')">
              <mat-icon>admin_panel_settings</mat-icon>
              <div class="account-info">
                <span class="account-name">Administrador</span>
                <span class="account-email">admin&#64;demo.com</span>
              </div>
            </div>
            <div class="demo-account" (click)="loginWithDemo('client')">
              <mat-icon>person</mat-icon>
              <div class="account-info">
                <span class="account-name">Cliente</span>
                <span class="account-email">cliente&#64;demo.com</span>
              </div>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions class="card-actions">
          <p class="register-link">
            Novo por aqui?
            <a routerLink="/auth/register">Criar conta</a>
          </p>
        </mat-card-actions>
      </mat-card>

      <div class="footer-info">
        <p>&copy; 2025 TimeAdministrator. Todos os direitos reservados.</p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      position: relative;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      margin-bottom: 20px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 24px 16px 24px;
    }

    .app-logo {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #1976d2;
      background: rgba(25, 118, 210, 0.1);
      border-radius: 12px;
      padding: 8px;
    }

    .title-section mat-card-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .title-section mat-card-subtitle {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .welcome-message {
      text-align: center;
      margin-bottom: 32px;
      padding: 0 24px;
    }

    .welcome-message h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 20px;
      font-weight: 600;
    }

    .welcome-message p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 0 24px;
    }

    .form-field {
      width: 100%;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 8px 0;
    }

    .remember-checkbox {
      font-size: 14px;
    }

    .forgot-link {
      color: #1976d2;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .login-button {
      height: 48px;
      margin-top: 8px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
    }

    .button-spinner {
      margin-right: 8px;
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 24px 24px 16px 24px;
      text-align: center;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e0e0e0;
    }

    .divider span {
      padding: 0 16px;
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .demo-accounts {
      padding: 0 24px 24px 24px;
    }

    .demo-title {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: #666;
      font-weight: 500;
      text-align: center;
    }

    .demo-account {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;
    }

    .demo-account:hover {
      background: #f5f5f5;
      border-color: #1976d2;
      transform: translateY(-1px);
    }

    .demo-account mat-icon {
      color: #1976d2;
      font-size: 20px;
    }

    .account-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .account-name {
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .account-email {
      color: #666;
      font-size: 12px;
    }

    .card-actions {
      padding: 16px 24px 24px 24px;
      text-align: center;
      border-top: 1px solid #f0f0f0;
    }

    .register-link {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .register-link a {
      color: #1976d2;
      text-decoration: none;
      font-weight: 600;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    .footer-info {
      text-align: center;
      color: rgba(255, 255, 255, 0.8);
      font-size: 12px;
      margin-top: 20px;
    }

    .footer-info p {
      margin: 0;
    }

    /* Responsividade */
    @media (max-width: 480px) {
      .login-container {
        padding: 16px;
      }

      .login-card {
        margin-bottom: 16px;
      }

      .logo-section {
        padding: 20px 20px 12px 20px;
      }

      .app-logo {
        font-size: 40px;
        width: 40px;
        height: 40px;
      }

      .title-section mat-card-title {
        font-size: 20px;
      }

      .welcome-message {
        padding: 0 20px;
        margin-bottom: 24px;
      }

      .login-form {
        padding: 0 20px;
      }

      .demo-accounts {
        padding: 0 20px 20px 20px;
      }

      .card-actions {
        padding: 12px 20px 20px 20px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  isProduction = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Verificar se está em produção
    this.isProduction = window.location.hostname !== 'localhost' &&
                       !window.location.hostname.includes('127.0.0.1') &&
                       !window.location.hostname.includes('vercel.app');

    // Verificar se há credenciais salvas
    this.loadSavedCredentials();
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  loadSavedCredentials(): void {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRemember = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail && savedRemember) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;

      const { email, password, rememberMe } = this.loginForm.value;

      // Salvar ou remover credenciais baseado na opção "lembrar-me"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberMe');
      }

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          this.loading = false;

          // Mostrar mensagem de sucesso
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          // Redirecionar baseado no role
          setTimeout(() => {
            if (response.user.role === UserRole.ADMIN) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }, 500);
        },
        error: (error) => {
          this.loading = false;

          let errorMessage = 'Erro ao fazer login. Verifique as suas credenciais.';

          if (error.status === 401) {
            errorMessage = 'Email ou password incorretos.';
          } else if (error.status === 429) {
            errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
          } else if (error.status === 0) {
            errorMessage = 'Erro de conexão. Verifique sua internet.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  loginWithDemo(type: 'admin' | 'client'): void {
    const demoCredentials = {
      admin: { email: 'admin@demo.com', password: 'admin123' },
      client: { email: 'cliente@demo.com', password: 'cliente123' }
    };

    this.loginForm.patchValue(demoCredentials[type]);
    this.onSubmit();
  }
}
