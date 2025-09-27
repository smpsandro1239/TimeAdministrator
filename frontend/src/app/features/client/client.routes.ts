import { Routes } from '@angular/router';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

export const clientRoutes: Routes = [
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
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'subscription',
        loadComponent: () => import('./subscription/subscription.component').then(m => m.SubscriptionComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./payments/payments.component').then(m => m.PaymentsComponent)
      },
      {
        path: 'new-subscription',
        loadComponent: () => import('./new-subscription/new-subscription.component').then(m => m.NewSubscriptionComponent)
      }
    ]
  }
];