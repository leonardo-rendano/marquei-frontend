import { api } from './api';

export async function getDashboardMetrics(params: {
  startDate: string;
  endDate: string;
}) {
  const response = await api.get('/dashboard/metrics', {
    params,
  });

  return response.data;
}