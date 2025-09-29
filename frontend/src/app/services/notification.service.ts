import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

interface NotificationStatus {
  email: {
    configured: boolean;
    host: string;
    user: string;
  };
  whatsapp: {
    configured: boolean;
    from: string;
  };
  cronJobs: {
    enabled: boolean;
    schedule: string;
  };
}

interface NotificationResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getNotificationStatus(): Observable<NotificationStatus> {
    return this.http.get<NotificationStatus>(`${this.API_URL}/notifications/status`);
  }

  checkExpiringSubscriptions(): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(`${this.API_URL}/notifications/check-expiring`, {});
  }

  sendCustomNotification(data: {
    clientId: string;
    subject: string;
    message: string;
    sendEmail?: boolean;
    sendWhatsApp?: boolean;
  }): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(`${this.API_URL}/notifications/send-custom`, data);
  }

  sendTestEmail(data: {
    email: string;
    subject: string;
    message: string;
  }): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(`${this.API_URL}/notifications/test-email`, data);
  }

  notifyAdmins(data: {
    subject: string;
    message: string;
  }): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(`${this.API_URL}/notifications/notify-admins`, data);
  }
}