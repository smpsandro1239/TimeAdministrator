import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Client, CreateClientRequest, UpdateClientRequest } from '../models/client.model';
import { PaginatedResponse, PaginationParams } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  getClients(params?: PaginationParams): Observable<PaginatedResponse<Client>> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    }

    return this.http.get<PaginatedResponse<Client>>(this.API_URL, { params: httpParams });
  }

  getClient(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/${id}`);
  }

  getMyProfile(): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/my-profile`);
  }

  createClient(client: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(this.API_URL, client);
  }

  updateClient(id: string, client: UpdateClientRequest): Observable<Client> {
    return this.http.patch<Client>(`${this.API_URL}/${id}`, client);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getExpiringClients(days: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.API_URL}/expiring/${days}`);
  }

  getExpiredClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.API_URL}/expired`);
  }

  updateSubscription(id: string, dates: {
    startDate: string;
    endDate: string;
    renewalDate: string;
  }): Observable<Client> {
    return this.http.patch<Client>(`${this.API_URL}/${id}/subscription`, dates);
  }
}