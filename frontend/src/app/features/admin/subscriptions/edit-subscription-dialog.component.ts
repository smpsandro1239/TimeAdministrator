import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-subscription-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="dialog-header">
      <div class="header-content">
        <mat-icon class="title-icon">edit</mat-icon>
        <div class="title-section">
          <h2 mat-dialog-title>{{ data.clientName }}</h2>
          <p class="subtitle">Editar Subscrição</p>
        </div>
      </div>
      <button mat-icon-button mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content>
      <div class="current-info">
        <div class="info-header">
          <mat-icon>info</mat-icon>
          <span>Subscrição Atual</span>
        </div>
        <div class="info-content">
          <div class="info-item">
            <span class="label">Plano:</span>
            <span class="value">{{ getPlanText(data.plan) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Valor:</span>
            <span class="value price">{{ data.price }}€</span>
          </div>
          <div class="info-item">
            <span class="label">Expira em:</span>
            <span class="value">{{ formatDate(data.endDate) }}</span>
          </div>
        </div>
      </div>
      
      <form [formGroup]="subscriptionForm" class="form">
        <!-- Plano e Preço -->
        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>card_membership</mat-icon>
            Plano e Preço
          </h3>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Plano</mat-label>
              <mat-select formControlName="plan" (selectionChange)="updatePrice()">
                <mat-option value="monthly">1 Mês - €10.00</mat-option>
                <mat-option value="quarterly">3 Meses - €30.00</mat-option>
                <mat-option value="biannual">6 Meses - €60.00</mat-option>
                <mat-option value="annual">12 Meses - €100.00</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Preço (€)</mat-label>
              <input matInput type="number" formControlName="price" step="0.01" (input)="onPriceChange()">
              <mat-hint>Padrão: {{ getDefaultPrice() }}€</mat-hint>
            </mat-form-field>
          </div>
        </div>
        
        <!-- Extensão Rápida -->
        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>add_circle</mat-icon>
            Extensão Rápida
          </h3>
          <div class="extend-buttons">
            <button type="button" mat-stroked-button (click)="extendSubscription(1)">
              <mat-icon>add</mat-icon>
              1 Mês
            </button>
            <button type="button" mat-stroked-button (click)="extendSubscription(3)">
              <mat-icon>add</mat-icon>
              3 Meses
            </button>
            <button type="button" mat-stroked-button (click)="extendSubscription(6)">
              <mat-icon>add</mat-icon>
              6 Meses
            </button>
            <button type="button" mat-stroked-button (click)="extendSubscription(12)">
              <mat-icon>add</mat-icon>
              1 Ano
            </button>
          </div>
        </div>

        <!-- Datas -->
        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>date_range</mat-icon>
            Período
          </h3>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Data de início</mat-label>
              <input matInput [matDatepicker]="startPicker" formControlName="startDate" (dateChange)="updateEndDate()">
              <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Data de fim</mat-label>
              <input matInput [matDatepicker]="endPicker" formControlName="endDate">
              <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
              <mat-hint>Calculada automaticamente</mat-hint>
            </mat-form-field>
          </div>
        </div>

        <!-- Estado e Pagamento -->
        <div class="form-section">
          <h3 class="section-title">
            <mat-icon>payment</mat-icon>
            Estado e Pagamento
          </h3>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Estado da Subscrição</mat-label>
              <mat-select formControlName="status">
                <mat-option value="active">Ativa</mat-option>
                <mat-option value="inactive">Inativa</mat-option>
                <mat-option value="expired">Expirada</mat-option>
                <mat-option value="cancelled">Cancelada</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado do Pagamento</mat-label>
              <mat-select formControlName="paymentStatus">
                <mat-option value="paid">Pago</mat-option>
                <mat-option value="pending">Pendente</mat-option>
                <mat-option value="failed">Falhado</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          
          <mat-form-field appearance="outline">
            <mat-label>Método de Pagamento</mat-label>
            <mat-select formControlName="paymentMethod">
              <mat-option value="stripe">Cartão de Crédito (Stripe)</mat-option>
              <mat-option value="transfer">Transferência Bancária</mat-option>
              <mat-option value="mbway">MBWay</mat-option>
              <mat-option value="cash">Dinheiro</mat-option>
              <mat-option value="other">Outro</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions class="dialog-actions">
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="subscriptionForm.invalid">
        <mat-icon>save</mat-icon>
        Guardar Alterações
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
      color: white;
      margin: -24px -24px 24px -24px;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .title-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    
    .title-section h2 {
      margin: 0;
      font-size: 24px;
    }
    
    .subtitle {
      margin: 4px 0 0 0;
      opacity: 0.9;
      font-size: 14px;
    }
    
    .close-button {
      color: white;
    }
    
    .current-info {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      border-left: 4px solid #2196F3;
    }
    
    .info-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-weight: 600;
      color: #1976D2;
    }
    
    .info-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      font-weight: 500;
    }
    
    .value {
      font-weight: 600;
      color: #333;
    }
    
    .price {
      color: #4CAF50;
      font-size: 16px;
    }
    
    .form {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 600px;
      min-width: 500px;
    }
    
    .form-section {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
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
      color: #4CAF50;
      font-size: 20px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    .extend-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
    }
    
    .extend-buttons button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 8px;
      transition: all 0.2s;
    }
    
    .extend-buttons button:hover {
      background: #f5f5f5;
      transform: translateY(-1px);
    }
    
    mat-form-field {
      width: 100%;
    }
    
    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      margin: 24px -24px -24px -24px;
    }
    
    @media (max-width: 768px) {
      .form {
        min-width: 0;
        max-width: 100%;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .info-content {
        grid-template-columns: 1fr;
      }
      
      .extend-buttons {
        grid-template-columns: 1fr 1fr;
      }
      
      .dialog-header {
        margin: -24px -16px 16px -16px;
        padding: 16px;
      }
      
      .header-content {
        gap: 12px;
      }
      
      .title-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      
      .title-section h2 {
        font-size: 20px;
      }
      
      .dialog-actions {
        flex-direction: column;
        margin: 16px -16px -24px -16px;
      }
      
      .dialog-actions button {
        width: 100%;
      }
    }
    
    @media (max-width: 480px) {
      .extend-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EditSubscriptionDialogComponent {
  subscriptionForm: FormGroup;
  originalEndDate: Date;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.originalEndDate = new Date(data.endDate);
    this.subscriptionForm = this.fb.group({
      plan: [data.plan, Validators.required],
      price: [data.price, [Validators.required, Validators.min(0)]],
      status: [data.status, Validators.required],
      startDate: [new Date(data.startDate), Validators.required],
      endDate: [new Date(data.endDate), Validators.required],
      paymentStatus: [data.paymentStatus, Validators.required],
      paymentMethod: [data.paymentMethod]
    });
  }

  getPlanText(plan: string): string {
    const plans: { [key: string]: string } = {
      'monthly': '1 Mês',
      'quarterly': '3 Meses',
      'biannual': '6 Meses',
      'annual': '12 Meses'
    };
    return plans[plan] || plan;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-PT');
  }

  getDefaultPrice(): number {
    const plan = this.subscriptionForm.get('plan')?.value;
    const prices: { [key: string]: number } = {
      'monthly': 10.00,
      'quarterly': 30.00,
      'biannual': 60.00,
      'annual': 100.00
    };
    return prices[plan] || 0;
  }

  updatePrice(): void {
    const defaultPrice = this.getDefaultPrice();
    this.subscriptionForm.patchValue({ price: defaultPrice });
    this.updateEndDate();
  }

  onPriceChange(): void {
    // Permite preço personalizado sem alterar a data
  }

  updateEndDate(): void {
    const startDate = this.subscriptionForm.get('startDate')?.value;
    const plan = this.subscriptionForm.get('plan')?.value;
    
    if (startDate && plan) {
      const endDate = new Date(startDate);
      const durations: { [key: string]: number } = {
        'monthly': 30,
        'quarterly': 90,
        'biannual': 180,
        'annual': 365
      };
      
      endDate.setDate(endDate.getDate() + durations[plan]);
      this.subscriptionForm.patchValue({ endDate });
    }
  }

  extendSubscription(months: number): void {
    const currentEndDate = new Date(this.originalEndDate);
    const newEndDate = new Date(currentEndDate);
    
    // Adicionar meses à data atual de expiração
    if (months === 1) {
      newEndDate.setDate(newEndDate.getDate() + 30);
      this.subscriptionForm.patchValue({ 
        price: this.subscriptionForm.get('price')?.value + 10.00,
        endDate: newEndDate 
      });
    } else if (months === 3) {
      newEndDate.setDate(newEndDate.getDate() + 90);
      this.subscriptionForm.patchValue({ 
        price: this.subscriptionForm.get('price')?.value + 30.00,
        endDate: newEndDate 
      });
    } else if (months === 6) {
      newEndDate.setDate(newEndDate.getDate() + 180);
      this.subscriptionForm.patchValue({ 
        price: this.subscriptionForm.get('price')?.value + 60.00,
        endDate: newEndDate 
      });
    } else if (months === 12) {
      newEndDate.setDate(newEndDate.getDate() + 365);
      this.subscriptionForm.patchValue({ 
        price: this.subscriptionForm.get('price')?.value + 100.00,
        endDate: newEndDate 
      });
    }
  }

  save(): void {
    if (this.subscriptionForm.valid) {
      this.dialogRef.close(this.subscriptionForm.value);
    }
  }
}