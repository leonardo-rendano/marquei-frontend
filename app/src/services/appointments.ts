import { api } from './api';

export async function getAppointments() {
  const response = await api.get('/appointments');
  return response.data;
}

export async function createAppointment(data: {
  clientId: string;
  professionalId: string;
  serviceId: string;
  startAt: string;
}) {
  const response = await api.post('/appointments', data);
  return response.data;
}

export async function getAvailableSlots(
  professionalId: string,
  date: string,
  serviceId: string,
) {
  const response = await api.get(`/appointments/slots/${professionalId}`, {
    params: {
      date,
      serviceId,
    },
  });

  return response.data;
}

export async function cancelAppointment(id: string) {
  const response = await api.patch(`/appointments/${id}/cancel`);
  return response.data;
}

export async function completeAppointment(id: string) {
  const response = await api.patch(`/appointments/${id}/complete`);
  return response.data;
}