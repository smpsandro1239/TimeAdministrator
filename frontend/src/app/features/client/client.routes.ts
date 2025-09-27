import { Routes } from '@angular/router';

export const clientRoutes: Routes = [
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
];