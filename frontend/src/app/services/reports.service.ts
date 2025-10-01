import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReportMetrics {
  totalRevenue: number;
  activeSubscriptions: number;
  expiringSubscriptions: number;
  conversionRate: number;
  revenueGrowth: number;
  subscriptionGrowth: number;
}

export interface RevenueByPlan {
  plan: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface ExpiringSubscription {
  clientName: string;
  plan: string;
  daysLeft: number;
  value: number;
  clientId: string;
  subscriptionId: string;
}

export interface RecentPayment {
  date: Date;
  clientName: string;
  amount: number;
  method: string;
  status: string;
  paymentId: string;
}

export interface ReportData {
  totalRevenue: number;
  activeSubscriptions: number;
  expiringSubscriptions: number;
  conversionRate: number;
  expiringData: ExpiringSubscription[];
  revenueByPlan: RevenueByPlan[];
  recentPayments: RecentPayment[];
  monthlyRevenue: { month: string; revenue: number; }[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getReportData(params: { period: string; startDate?: Date | null; endDate?: Date | null; }): Observable<ReportData> {
    const httpParams: any = { period: params.period };
    if (params.startDate) httpParams.startDate = params.startDate.toISOString();
    if (params.endDate) httpParams.endDate = params.endDate.toISOString();
    
    return this.http.get<ReportData>(`${this.apiUrl}/dashboard`, { params: httpParams });
  }

  getMetrics(period: string): Observable<ReportMetrics> {
    return this.http.get<ReportMetrics>(`${this.apiUrl}/metrics`, { params: { period } });
  }

  getRevenueByPlan(period: string): Observable<RevenueByPlan[]> {
    return this.http.get<RevenueByPlan[]>(`${this.apiUrl}/revenue-by-plan`, { params: { period } });
  }

  getExpiringSubscriptions(days: number = 30): Observable<ExpiringSubscription[]> {
    return this.http.get<ExpiringSubscription[]>(`${this.apiUrl}/expiring-subscriptions`, { params: { days: days.toString() } });
  }

  getRecentPayments(limit: number = 10): Observable<RecentPayment[]> {
    return this.http.get<RecentPayment[]>(`${this.apiUrl}/recent-payments`, { params: { limit: limit.toString() } });
  }

  getMonthlyRevenue(year?: number): Observable<{ labels: string[], data: number[] }> {
    const params: any = {};
    if (year) params.year = year.toString();
    return this.http.get<{ labels: string[], data: number[] }>(`${this.apiUrl}/monthly-revenue`, { params });
  }

  exportReport(params: { period: string; startDate?: Date | null; endDate?: Date | null; }): Observable<Blob> {
    const httpParams: any = { period: params.period };
    if (params.startDate) httpParams.startDate = params.startDate.toISOString();
    if (params.endDate) httpParams.endDate = params.endDate.toISOString();
    
    return this.http.get(`${this.apiUrl}/export`, {
      params: httpParams,
      responseType: 'blob'
    });
  }

  exportMetricDetails(metric: string, period: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-metric`, {
      params: { metric, period },
      responseType: 'blob'
    });
  }
}