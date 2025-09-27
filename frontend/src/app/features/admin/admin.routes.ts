import { Routes } from '@angular/router';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'clients',
        loadComponent: () => import('./clients/clients.component').then(m => m.ClientsComponent)
      },
      {
        path: 'subscriptions',
        loadComponent: () => import('./subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./payments/payments.component').then(m => m.PaymentsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
      }
    ]
  }
];