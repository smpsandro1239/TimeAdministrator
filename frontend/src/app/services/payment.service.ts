import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { 
  Payment, 
  CreatePaymentRequest, 
  CreateStripePaymentRequest,
  StripePaymentResponse 
} from '../models/payment.model';
import { PaginatedResponse, PaginationParams } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly API_URL = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getPayments(params?: PaginationParams): Observable<PaginatedResponse<Payment>> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    }

    return this.http.get<PaginatedResponse<Payment>>(this.API_URL, { params: httpParams });
  }

  getPayment(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.API_URL}/${id}`);
  }

  getMyPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.API_URL}/my-payments`);
  }

  getClientPayments(clientId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.API_URL}/client/${clientId}`);
  }

  getPendingPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.API_URL}/pending`);
  }

  createPayment(payment: CreatePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(this.API_URL, payment);
  }

  createStripePaymentIntent(payment: CreateStripePaymentRequest): Observable<StripePaymentResponse> {
    return this.http.post<StripePaymentResponse>(`${this.API_URL}/stripe/create-intent`, payment);
  }

  approvePayment(id: string): Observable<Payment> {
    return this.http.patch<Payment>(`${this.API_URL}/${id}/approve`, {});
  }

  rejectPayment(id: string, reason?: string): Observable<Payment> {
    return this.http.patch<Payment>(`${this.API_URL}/${id}/reject`, { reason });
  }

  deletePayment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}