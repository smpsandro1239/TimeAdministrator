// c:/laragon/www/TimeAdministrator/frontend/src/app/services/dashboard.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AdminMetrics } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getAdminMetrics(period: string): Observable<AdminMetrics> {
    const params = new HttpParams().set('period', period);
    return this.http.get<AdminMetrics>(`${this.API_URL}/admin-metrics`, { params });
  }

  getClientGrowth(period: string): Observable<{ name: string; value: number }[]> {
    const params = new HttpParams().set('period', period);
    return this.http.get<{ name: string; value: number }[]>(`${this.API_URL}/client-growth`, { params });
  }

  getPlanDistribution(period: string): Observable<{ name: string; value: number }[]> {
    const params = new HttpParams().set('period', period);
    return this.http.get<{ name: string; value: number }[]>(`${this.API_URL}/plan-distribution`, { params });
  }
}