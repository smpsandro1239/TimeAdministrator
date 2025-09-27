import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ClientGuard } from './guards/client.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    component: LayoutComponent,
    children: [
      {
        path: 'clients',
        loadComponent: () => import('./features/admin/clients/clients.component').then(m => m.ClientsComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/admin/payments/payments.component').then(m => m.PaymentsComponent)
      },
      {
        path: 'subscriptions',
        loadComponent: () => import('./features/admin/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/admin/notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users/users.component').then(m => m.UsersComponent)
      }
    ]
  },
  {
    path: 'client',
    canActivate: [AuthGuard, ClientGuard],
    component: LayoutComponent,
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./features/client/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'subscription',
        loadComponent: () => import('./features/client/subscription/subscription.component').then(m => m.SubscriptionComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/client/payments/payments.component').then(m => m.PaymentsComponent)
      },
      {
        path: 'new-subscription',
        loadComponent: () => import('./features/client/new-subscription/new-subscription.component').then(m => m.NewSubscriptionComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];