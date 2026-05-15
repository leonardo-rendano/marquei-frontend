import { api } from './api';

export async function getServices() {
  const response =
    await api.get('/services');

  return response.data;
}

export async function createService(
  data: {
    name: string;
    duration: number;
    price: number;
  },
) {
  const response =
    await api.post(
      '/services',
      data,
    );

  return response.data;
}