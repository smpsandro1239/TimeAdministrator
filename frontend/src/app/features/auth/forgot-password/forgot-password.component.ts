import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
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
    MatProgressSpinnerModule
  ],
  template: `
    <div class="forgot-container">
      <mat-card class="forgot-card">
        <mat-card-header>
          <div class="header-content">
            <button mat-icon-button routerLink="/auth/login" class="back-button">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div class="title-section">
              <mat-card-title>Esqueceu a Password</mat-card-title>
              <mat-card-subtitle>Recupere o acesso à sua conta</mat-card-subtitle>
            </div>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div class="instructions">
            <mat-icon class="instruction-icon">email</mat-icon>
            <div class="instruction-text">
              <h3>Digite seu email</h3>
              <p>Enviaremos um link para redefinir sua password</p>
            </div>
          </div>

          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="forgot-form">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Email</mat-label>
              <input matInput
                     type="email"
                     formControlName="email"
                     placeholder="seu@email.com"
                     autocomplete="email"
                     required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="forgotForm.get('email')?.hasError('required') && forgotForm.get('email')?.touched">
                Email é obrigatório
              </mat-error>
              <mat-error *ngIf="forgotForm.get('email')?.hasError('email') && forgotForm.get('email')?.touched">
                Digite um email válido
              </mat-error>
            </mat-form-field>

            <button mat-raised-button
                    color="primary"
                    type="submit"
                    [disabled]="forgotForm.invalid || loading"
                    class="submit-button">
              <mat-spinner diameter="20" *ngIf="loading" class="button-spinner"></mat-spinner>
              <mat-icon *ngIf="!loading">send</mat-icon>
              <span>Enviar Link de Recuperação</span>
            </button>
          </form>

          <div class="help-text">
            <p>Lembrou da password? <a routerLink="/auth/login">Voltar ao login</a></p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .forgot-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .forgot-card {
      width: 100%;
      max-width: 420px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 24px 16px 24px;
    }

    .back-button {
      color: #666;
    }

    .back-button:hover {
      color: #1976d2;
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

    .instructions {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: #f8f9fa;
      margin: 0 0 24px 0;
      border-radius: 0 0 16px 16px;
    }

    .instruction-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #1976d2;
      background: rgba(25, 118, 210, 0.1);
      border-radius: 50%;
      padding: 12px;
    }

    .instruction-text h3 {
      margin: 0 0 4px 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }

    .instruction-text p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .forgot-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 0 24px;
    }

    .form-field {
      width: 100%;
    }

    .submit-button {
      height: 48px;
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

    .help-text {
      text-align: center;
      margin-top: 24px;
      padding: 0 24px 24px 24px;
      color: #666;
      font-size: 14px;
    }

    .help-text a {
      color: #1976d2;
      text-decoration: none;
      font-weight: 600;
    }

    .help-text a:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .forgot-container {
        padding: 16px;
      }

      .header-content {
        padding: 20px 20px 12px 20px;
      }

      .instructions {
        padding: 20px;
      }

      .instruction-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        padding: 8px;
      }

      .forgot-form {
        padding: 0 20px;
      }

      .help-text {
        padding: 0 20px 20px 20px;
      }
    }
  `]
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.valid) {
      this.loading = true;

      const { email } = this.forgotForm.value;

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.loading = false;

          this.snackBar.open(
            'Link de recuperação enviado! Verifique seu email.',
            'Fechar',
            {
              duration: 5000,
              panelClass: ['success-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'top'
            }
          );

          // Redirecionar para login após alguns segundos
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        },
        error: (error) => {
          this.loading = false;

          let errorMessage = 'Erro ao enviar email de recuperação.';

          if (error.status === 404) {
            errorMessage = 'Email não encontrado no sistema.';
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
      // Marcar campo como touched para mostrar erros
      this.forgotForm.get('email')?.markAsTouched();
    }
  }
}
