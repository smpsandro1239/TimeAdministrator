import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { NotificationRequest } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  checkExpiringSubscriptions(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/check-expiring`, {});
  }

  sendCustomNotification(notification: NotificationRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/send-custom`, notification);
  }

  notifyAdmins(subject: string, message: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/notify-admins`, {
      subject,
      message
    });
  }
}