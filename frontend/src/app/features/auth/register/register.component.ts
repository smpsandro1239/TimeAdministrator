import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

import { UserRole } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
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
    MatSelectModule,
    MatCheckboxModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <div class="logo-section">
            <mat-icon class="app-logo">person_add</mat-icon>
            <div class="title-section">
              <mat-card-title>Criar Conta</mat-card-title>
              <mat-card-subtitle>Junte-se ao TimeAdministrator</mat-card-subtitle>
            </div>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div class="welcome-message">
            <h3>Comece sua jornada!</h3>
            <p>Crie sua conta e tenha acesso completo à gestão de subscrições</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <!-- Informações Pessoais -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>person</mat-icon>
                Informações Pessoais
              </h3>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Nome completo</mat-label>
                <input matInput
                       formControlName="name"
                       placeholder="João Silva"
                       autocomplete="name"
                       required>
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="registerForm.get('name')?.hasError('required') && registerForm.get('name')?.touched">
                  Nome é obrigatório
                </mat-error>
                <mat-error *ngIf="registerForm.get('name')?.hasError('minlength') && registerForm.get('name')?.touched">
                  Nome deve ter pelo menos 2 caracteres
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Email</mat-label>
                <input matInput
                       type="email"
                       formControlName="email"
                       placeholder="seu@email.com"
                       autocomplete="email"
                       required>
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched">
                  Email é obrigatório
                </mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched">
                  Digite um email válido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Telefone (opcional)</mat-label>
                <input matInput
                       formControlName="phone"
                       placeholder="912345678"
                       autocomplete="tel">
                <mat-icon matSuffix>phone</mat-icon>
                <mat-hint>Para notificações por WhatsApp</mat-hint>
              </mat-form-field>
            </div>

            <!-- Tipo de Conta -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>account_circle</mat-icon>
                Tipo de Conta
              </h3>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Tipo de conta</mat-label>
                <mat-select formControlName="role" required>
                  <mat-option [value]="userRole.CLIENT">
                    <div class="option-content">
                      <mat-icon>person</mat-icon>
                      <div>
                        <div class="option-title">Cliente</div>
                        <div class="option-description">Gerencie suas próprias subscrições</div>
                      </div>
                    </div>
                  </mat-option>
                  <mat-option [value]="userRole.ADMIN">
                    <div class="option-content">
                      <mat-icon>admin_panel_settings</mat-icon>
                      <div>
                        <div class="option-title">Administrador</div>
                        <div class="option-description">Gerencie clientes e subscrições</div>
                      </div>
                    </div>
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>expand_more</mat-icon>
              </mat-form-field>
            </div>

            <!-- Segurança -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>security</mat-icon>
                Segurança
              </h3>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Password</mat-label>
                <input matInput
                       [type]="hidePassword ? 'password' : 'text'"
                       formControlName="password"
                       placeholder="Mínimo 8 caracteres"
                       autocomplete="new-password"
                       required>
                <button mat-icon-button
                        matSuffix
                        (click)="togglePasswordVisibility('password')"
                        type="button"
                        tabindex="-1">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched">
                  Password é obrigatória
                </mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched">
                  Password deve ter pelo menos 8 caracteres
                </mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('pattern') && registerForm.get('password')?.touched">
                  Password deve conter letras maiúsculas, minúsculas, números e símbolos
                </mat-error>
                <mat-hint>Deve conter maiúsculas, minúsculas, números e símbolos</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Confirmar password</mat-label>
                <input matInput
                       [type]="hideConfirmPassword ? 'password' : 'text'"
                       formControlName="confirmPassword"
                       placeholder="Digite a password novamente"
                       autocomplete="new-password"
                       required>
                <button mat-icon-button
                        matSuffix
                        (click)="togglePasswordVisibility('confirm')"
                        type="button"
                        tabindex="-1">
                  <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched">
                  Confirmação de password é obrigatória
                </mat-error>
                <mat-error *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
                  As passwords não coincidem
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Termos e Condições -->
            <div class="form-section">
              <mat-checkbox formControlName="acceptTerms" class="terms-checkbox" required>
                <span class="terms-text">
                  Li e aceito os
                  <a href="#" class="terms-link">Termos de Uso</a> e
                  <a href="#" class="terms-link">Política de Privacidade</a>
                </span>
              </mat-checkbox>
              <mat-error *ngIf="registerForm.get('acceptTerms')?.hasError('required') && registerForm.get('acceptTerms')?.touched" class="terms-error">
                Você deve aceitar os termos para continuar
              </mat-error>
            </div>

            <button mat-raised-button
                    color="primary"
                    type="submit"
                    [disabled]="registerForm.invalid || loading"
                    class="register-button">
              <mat-spinner diameter="20" *ngIf="loading" class="button-spinner"></mat-spinner>
              <mat-icon *ngIf="!loading">person_add</mat-icon>
              <span>Criar Conta</span>
            </button>
          </form>

          <div class="divider">
            <span>ou</span>
          </div>

          <div class="login-link">
            <p>Já tem uma conta? <a routerLink="/auth/login">Faça login</a></p>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="footer-info">
        <p>&copy; 2024 TimeAdministrator. Todos os direitos reservados.</p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      position: relative;
    }

    .register-card {
      width: 100%;
      max-width: 480px;
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

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 0 24px;
    }

    .form-section {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      background: #fafafa;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      padding-bottom: 8px;
      border-bottom: 1px solid #e0e0e0;
    }

    .section-title mat-icon {
      color: #1976d2;
      font-size: 20px;
    }

    .form-field {
      width: 100%;
    }

    .option-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .option-content mat-icon {
      color: #1976d2;
      font-size: 24px;
    }

    .option-title {
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .option-description {
      color: #666;
      font-size: 12px;
    }

    .terms-checkbox {
      width: 100%;
      margin: 8px 0;
    }

    .terms-text {
      font-size: 14px;
      line-height: 1.4;
    }

    .terms-link {
      color: #1976d2;
      text-decoration: none;
      font-weight: 600;
    }

    .terms-link:hover {
      text-decoration: underline;
    }

    .terms-error {
      font-size: 12px;
      margin-top: 4px;
      margin-left: 14px;
    }

    .register-button {
      height: 48px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      margin-top: 8px;
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

    .login-link {
      text-align: center;
      margin-top: 16px;
      padding: 0 24px 24px 24px;
    }

    .login-link p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .login-link a {
      color: #1976d2;
      text-decoration: none;
      font-weight: 600;
    }

    .login-link a:hover {
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
      .register-container {
        padding: 16px;
      }

      .register-card {
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

      .register-form {
        padding: 0 20px;
      }

      .form-section {
        padding: 16px;
      }

      .login-link {
        padding: 0 20px 20px 20px;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  userRole = UserRole;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: [UserRole.CLIENT, [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;

      const { confirmPassword, acceptTerms, ...registerData } = this.registerForm.value;

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.loading = false;

          this.snackBar.open(
            'Conta criada com sucesso! Verifique seu email para confirmar a conta.',
            'Fechar',
            {
              duration: 5000,
              panelClass: ['success-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'top'
            }
          );

          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;

          let errorMessage = 'Erro ao criar conta. Tente novamente.';

          if (error.status === 409) {
            errorMessage = 'Este email já está registado.';
          } else if (error.status === 400) {
            errorMessage = 'Dados inválidos. Verifique os campos.';
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
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}
