import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';

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
    MatSelectModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>TimeAdministrator</mat-card-title>
          <mat-card-subtitle>Criar Conta</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="form-field">
              <mat-label>Nome</mat-label>
              <input matInput type="text" formControlName="name" required>
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
                Nome é obrigatório
              </mat-error>
            </mat-form-field>

            <mat-form-field class="form-field">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email é obrigatório
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Email deve ter um formato válido
              </mat-error>
            </mat-form-field>

            <mat-form-field class="form-field">
              <mat-label>Telefone</mat-label>
              <input matInput type="tel" formControlName="phone">
              <mat-icon matSuffix>phone</mat-icon>
            </mat-form-field>

            <mat-form-field class="form-field">
              <mat-label>Tipo de Conta</mat-label>
              <mat-select formControlName="role">
                <mat-option value="client">Cliente</mat-option>
                <mat-option value="admin">Administrador</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field class="form-field">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Password é obrigatória
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Password deve ter pelo menos 6 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field class="form-field">
              <mat-label>Confirmar Password</mat-label>
              <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword" required>
              <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button">
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Confirmação de password é obrigatória
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch')">
                As passwords não coincidem
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="registerForm.invalid || loading" class="submit-button">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Registar</span>
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions align="center">
          <p>Já tem conta? <a routerLink="/auth/login">Iniciar Sessão</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .submit-button {
      width: 100%;
      height: 48px;
      margin-top: 16px;
    }

    mat-card-header {
      text-align: center;
      margin-bottom: 20px;
    }

    mat-card-actions {
      margin-top: 20px;
    }

    a {
      color: #1976d2;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: [UserRole.CLIENT, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      
      const { confirmPassword, ...registerData } = this.registerForm.value;
      
      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Conta criada com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(
            error.error?.message || 'Erro ao criar conta. Tente novamente.',
            'Fechar',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }
}