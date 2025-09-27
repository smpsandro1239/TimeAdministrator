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
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'subscription',
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'new-subscription',
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
    ]
  }
];