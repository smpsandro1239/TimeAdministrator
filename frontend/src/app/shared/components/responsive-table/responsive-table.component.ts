import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'status' | 'actions';
  mobileHide?: boolean;
}

export interface TableAction {
  icon: string;
  label: string;
  action: string;
  color?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-responsive-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <!-- Desktop Table -->
    <div *ngIf="!(isMobile$ | async)" class="desktop-table">
      <mat-table [dataSource]="data" class="responsive-table">
        <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
          <mat-header-cell *matHeaderCellDef>{{ column.label }}</mat-header-cell>
          <mat-cell *matCellDef="let element">
            <ng-container [ngSwitch]="column.type">
              <span *ngSwitchCase="'status'" [class]="'status-badge status-' + element[column.key]?.toLowerCase()">
                {{ element[column.key] }}
              </span>
              <span *ngSwitchCase="'date'">
                {{ element[column.key] | date:'dd/MM/yyyy' }}
              </span>
              <div *ngSwitchCase="'actions'" class="actions-cell">
                <button *ngFor="let action of actions" 
                        mat-icon-button 
                        [color]="action.color || 'primary'"
                        (click)="onAction(action.action, element)"
                        [title]="action.label">
                  <mat-icon>{{ action.icon }}</mat-icon>
                </button>
              </div>
              <span *ngSwitchDefault>{{ element[column.key] }}</span>
            </ng-container>
          </mat-cell>
        </ng-container>
        
        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;" 
                 class="table-row"
                 (click)="onRowClick(row)"></mat-row>
      </mat-table>
    </div>

    <!-- Mobile Cards -->
    <div *ngIf="isMobile$ | async" class="mobile-cards">
      <mat-card *ngFor="let item of data" class="mobile-card" (click)="onRowClick(item)">
        <mat-card-content>
          <div class="card-header">
            <h3>{{ item[primaryColumn] }}</h3>
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button *ngFor="let action of actions" 
                      mat-menu-item 
                      (click)="onAction(action.action, item)">
                <mat-icon>{{ action.icon }}</mat-icon>
                <span>{{ action.label }}</span>
              </button>
            </mat-menu>
          </div>
          
          <div class="card-details">
            <div *ngFor="let column of mobileColumns" class="detail-row">
              <span class="label">{{ column.label }}:</span>
              <span class="value" [ngSwitch]="column.type">
                <span *ngSwitchCase="'status'" [class]="'status-badge status-' + item[column.key]?.toLowerCase()">
                  {{ item[column.key] }}
                </span>
                <span *ngSwitchCase="'date'">
                  {{ item[column.key] | date:'dd/MM/yyyy' }}
                </span>
                <span *ngSwitchDefault>{{ item[column.key] }}</span>
              </span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .responsive-table {
      width: 100%;
    }
    
    .table-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .table-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
    
    .actions-cell {
      display: flex;
      gap: 4px;
    }
    
    .mobile-cards {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .mobile-card {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .mobile-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .card-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
    
    .card-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .detail-row .label {
      font-weight: 500;
      color: #666;
      font-size: 14px;
    }
    
    .detail-row .value {
      font-size: 14px;
      color: #333;
    }
  `]
})
export class ResponsiveTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() primaryColumn = 'name';
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{action: string, item: any}>();
  
  displayedColumns: string[] = [];
  mobileColumns: TableColumn[] = [];
  isMobile$: Observable<boolean>;
  
  constructor(private breakpointObserver: BreakpointObserver) {
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(map(result => result.matches));
  }
  
  ngOnInit(): void {
    this.displayedColumns = this.columns.map(col => col.key);
    this.mobileColumns = this.columns.filter(col => !col.mobileHide && col.type !== 'actions');
  }
  
  onRowClick(item: any): void {
    this.rowClick.emit(item);
  }
  
  onAction(action: string, item: any): void {
    this.actionClick.emit({ action, item });
  }
}