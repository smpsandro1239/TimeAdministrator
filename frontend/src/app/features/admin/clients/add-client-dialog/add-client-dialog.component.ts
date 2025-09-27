import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { ClientService } from '../../../../services/client.service';

@Component({
  selector: 'app-add-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './add-client-dialog.component.html',
  styleUrl: './add-client-dialog.component.scss'
})
export class AddClientDialogComponent {
  clientForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialogRef: MatDialogRef<AddClientDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\-\s\(\)]{8,}$/)]],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.loading = true;
      const formData = this.clientForm.value;

      this.clientService.createClient(formData).subscribe({
        next: (client) => {
          this.snackBar.open('Cliente criado com sucesso!', 'Fechar', { duration: 3000 });
          this.dialogRef.close(client);
        },
        error: (error) => {
          console.error('Erro ao criar cliente:', error);
          this.snackBar.open('Erro ao criar cliente. Verifique os dados.', 'Fechar', { duration: 5000 });
          this.loading = false;
        }
      });
    } else {
      this.snackBar.open('Por favor, corrija os erros no formulário.', 'Fechar', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    if (field?.hasError('minlength')) {
      return 'Mínimo 2 caracteres';
    }
    if (field?.hasError('pattern')) {
      return 'Telefone inválido';
    }
    return '';
  }
}
