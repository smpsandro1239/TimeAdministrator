import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule-report-modal',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatDatepickerModule, MatNativeDateModule, FormsModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>Agendar Relatório Automático</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content class="modal-content">
      <form class="schedule-form">
        <mat-form-field appearance="outline">
          <mat-label>Nome do Relatório</mat-label>
          <input matInput [(ngModel)]="reportName" name="reportName" placeholder="Ex: Relatório Mensal de Receitas">
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Frequência</mat-label>
          <mat-select [(value)]="frequency" name="frequency">
            <mat-option value="daily">Diário</mat-option>
            <mat-option value="weekly">Semanal</mat-option>
            <mat-option value="monthly">Mensal</mat-option>
            <mat-option value="quarterly">Trimestral</mat-option>
          </mat-select>
        </mat-form-field>
        
        <div class="form-row" *ngIf="frequency === 'weekly'">
          <mat-form-field appearance="outline">
            <mat-label>Dia da Semana</mat-label>
            <mat-select [(value)]="weekDay" name="weekDay">
              <mat-option value="1">Segunda-feira</mat-option>
              <mat-option value="2">Terça-feira</mat-option>
              <mat-option value="3">Quarta-feira</mat-option>
              <mat-option value="4">Quinta-feira</mat-option>
              <mat-option value="5">Sexta-feira</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        
        <div class="form-row" *ngIf="frequency === 'monthly'">
          <mat-form-field appearance="outline">
            <mat-label>Dia do Mês</mat-label>
            <mat-select [(value)]="monthDay" name="monthDay">
              <mat-option *ngFor="let day of monthDays" [value]="day">{{ day }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        
        <mat-form-field appearance="outline">
          <mat-label>Hora de Envio</mat-label>
          <input matInput type="time" [(ngModel)]="sendTime" name="sendTime">
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Formato do Relatório</mat-label>
          <mat-select [(value)]="format" name="format">
            <mat-option value="pdf">PDF</mat-option>
            <mat-option value="excel">Excel</mat-option>
            <mat-option value="both">Ambos (PDF + Excel)</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Emails para Envio</mat-label>
          <textarea matInput [(ngModel)]="emailList" name="emailList" 
                    placeholder="admin@empresa.com, gestor@empresa.com" rows="3"></textarea>
          <mat-hint>Separar emails com vírgula</mat-hint>
        </mat-form-field>
        
        <div class="checkbox-section">
          <h3>Conteúdo do Relatório</h3>
          <mat-checkbox [(ngModel)]="includeMetrics" name="includeMetrics">Métricas Principais</mat-checkbox>
          <mat-checkbox [(ngModel)]="includeCharts" name="includeCharts">Gráficos</mat-checkbox>
          <mat-checkbox [(ngModel)]="includeExpiringSubscriptions" name="includeExpiringSubscriptions">Subscrições a Expirar</mat-checkbox>
          <mat-checkbox [(ngModel)]="includeRevenueAnalysis" name="includeRevenueAnalysis">Análise de Receitas</mat-checkbox>
          <mat-checkbox [(ngModel)]="includeRecommendations" name="includeRecommendations">Recomendações</mat-checkbox>
        </div>
        
        <mat-form-field appearance="outline">
          <mat-label>Data de Início</mat-label>
          <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDate" name="startDate">
          <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
        </mat-form-field>
        
        <div class="active-section">
          <mat-checkbox [(ngModel)]="isActive" name="isActive">Activar Agendamento</mat-checkbox>
        </div>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions class="modal-actions">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="saveSchedule()" [disabled]="!isFormValid()">
        <mat-icon>schedule</mat-icon>
        Agendar Relatório
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .modal-content {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
    }
    
    .schedule-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
    }
    
    .checkbox-section {
      margin: 16px 0;
    }
    
    .checkbox-section h3 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 16px;
    }
    
    .checkbox-section mat-checkbox {
      display: block;
      margin-bottom: 8px;
    }
    
    .active-section {
      margin-top: 16px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    
    .modal-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }
  `]
})
export class ScheduleReportModalComponent {
  reportName = '';
  frequency = 'monthly';
  weekDay = '1';
  monthDay = '1';
  sendTime = '09:00';
  format = 'pdf';
  emailList = '';
  startDate: Date | null = new Date();
  isActive = true;
  
  // Conteúdo do relatório
  includeMetrics = true;
  includeCharts = true;
  includeExpiringSubscriptions = true;
  includeRevenueAnalysis = true;
  includeRecommendations = false;
  
  monthDays = Array.from({length: 28}, (_, i) => i + 1);
  
  constructor(
    public dialogRef: MatDialogRef<ScheduleReportModalComponent>
  ) {}
  
  isFormValid(): boolean {
    return !!(this.reportName && this.emailList && this.startDate);
  }
  
  saveSchedule() {
    if (!this.isFormValid()) return;
    
    const scheduleData = {
      name: this.reportName,
      frequency: this.frequency,
      weekDay: this.weekDay,
      monthDay: this.monthDay,
      sendTime: this.sendTime,
      format: this.format,
      emails: this.emailList.split(',').map(email => email.trim()),
      startDate: this.startDate,
      isActive: this.isActive,
      content: {
        includeMetrics: this.includeMetrics,
        includeCharts: this.includeCharts,
        includeExpiringSubscriptions: this.includeExpiringSubscriptions,
        includeRevenueAnalysis: this.includeRevenueAnalysis,
        includeRecommendations: this.includeRecommendations
      }
    };
    
    console.log('Agendamento criado:', scheduleData);
    this.dialogRef.close(scheduleData);
  }
}