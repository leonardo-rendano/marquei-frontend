export interface DashboardMetrics {
  totalAppointments: number;
  completedAppointments: number;
  noShowAppointments: number;
  noShowRate: number;
  completionRate: number;
  estimatedRevenue: number;
  mostRequestedServices: {
    serviceId: string;
    serviceName: string;
    count: number;
  }[];
}
