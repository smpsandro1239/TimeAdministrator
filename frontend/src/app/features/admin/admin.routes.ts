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
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'subscriptions',
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
    ]
  }
];