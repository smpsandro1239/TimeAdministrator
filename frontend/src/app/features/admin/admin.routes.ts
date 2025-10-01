import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'clients',
    loadComponent: () => import('./clients/clients.component').then(m => m.ClientsComponent)
  },
  {
    path: 'payments',
    loadComponent: () => import('./payments/payments.component').then(m => m.PaymentsComponent)
  },
  {
    path: 'subscriptions',
    loadComponent: () => import('./subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications.component').then(m => m.NotificationsComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports-simple.component').then(m => m.ReportsSimpleComponent)
  }
];