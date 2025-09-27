import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../models/client.model';

@Component({
  selector: 'app-edit-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSlideToggleModule
  ],
  templateUrl: './edit-client-dialog.component.html',
  styleUrl: './edit-client-dialog.component.scss'
})
export class EditClientDialogComponent implements OnInit {
  clientForm: FormGroup;
  loading = false;
  client: Client;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialogRef: MatDialogRef<EditClientDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { client: Client }
  ) {
    this.client = data.client;
    this.clientForm = this.fb.group({
      name: [this.client.name, [Validators.required, Validators.minLength(2)]],
      email: [this.client.email, [Validators.required, Validators.email]],
      phone: [this.client.phone, [Validators.required, Validators.pattern(/^[\+]?[0-9\-\s\(\)]{8,}$/)]],
      notes: [this.client.notes || ''],
      isActive: [this.client.isActive]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.loading = true;
      const formData = this.clientForm.value;

      this.clientService.updateClient(this.client.id, formData).subscribe({
        next: (updatedClient) => {
          this.snackBar.open('Cliente atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.dialogRef.close(updatedClient);
        },
        error: (error) => {
          console.error('Erro ao atualizar cliente:', error);
          this.snackBar.open('Erro ao atualizar cliente. Verifique os dados.', 'Fechar', { duration: 5000 });
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
