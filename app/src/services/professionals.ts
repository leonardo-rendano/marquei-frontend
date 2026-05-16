import { api } from './api';

export async function getProfessionals() {
  const response =
    await api.get('/professionals');

  return response.data;
}

export async function createProfessional(
  data: {
    userId: string;
    specialty: string;
    serviceIds: string[];
  },
) {
  const response =
    await api.post(
      '/professionals',
      data,
    );

  return response.data;
}