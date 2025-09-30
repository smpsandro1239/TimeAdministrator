export interface AdminMetrics {
  totalClients: number;
  activeSubscriptions: number;
  expiringSoon: number;
  pendingPayments: number;
}

export interface DashboardMetrics {
  totalClients: number;
  activeSubscriptions: number;
  expiringSoon: number;
  pendingPayments: number;
  totalRevenue: number;
  monthlyRevenue: number;
}