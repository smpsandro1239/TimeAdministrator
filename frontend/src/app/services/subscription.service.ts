import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { 
  Subscription, 
  CreateSubscriptionRequest, 
  UpdateSubscriptionRequest,
  SubscriptionPeriod 
} from '../models/subscription.model';
import { PaginatedResponse, PaginationParams } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly API_URL = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  getSubscriptions(params?: PaginationParams): Observable<PaginatedResponse<Subscription>> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    }

    return this.http.get<PaginatedResponse<Subscription>>(this.API_URL, { params: httpParams });
  }

  getSubscription(id: string): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.API_URL}/${id}`);
  }

  getClientSubscriptions(clientId: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.API_URL}/client/${clientId}`);
  }

  createSubscription(subscription: CreateSubscriptionRequest): Observable<Subscription> {
    return this.http.post<Subscription>(this.API_URL, subscription);
  }

  updateSubscription(id: string, subscription: UpdateSubscriptionRequest): Observable<Subscription> {
    return this.http.patch<Subscription>(`${this.API_URL}/${id}`, subscription);
  }

  deleteSubscription(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getExpiringSubscriptions(days: number): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.API_URL}/expiring/${days}`);
  }

  getExpiredSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.API_URL}/expired`);
  }

  calculateDates(period: SubscriptionPeriod, startDate?: string): Observable<{
    startDate: Date;
    endDate: Date;
    renewalDate: Date;
  }> {
    let httpParams = new HttpParams();
    if (startDate) {
      httpParams = httpParams.set('startDate', startDate);
    }

    return this.http.get<{
      startDate: Date;
      endDate: Date;
      renewalDate: Date;
    }>(`${this.API_URL}/calculate-dates/${period}`, { params: httpParams });
  }

  activateSubscription(id: string): Observable<Subscription> {
    return this.http.patch<Subscription>(`${this.API_URL}/${id}/activate`, {});
  }

  expireSubscription(id: string): Observable<Subscription> {
    return this.http.patch<Subscription>(`${this.API_URL}/${id}/expire`, {});
  }
}