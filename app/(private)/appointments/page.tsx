'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/app/src/hooks/useAuth';

import {
  cancelAppointment,
  completeAppointment,
  createAppointment,
  getAppointments,
  getAvailableSlots,
} from '@/app/src/services/appointments';

import { getProfessionals } from '@/app/src/services/professionals';
import { getServices } from '@/app/src/services/services';
import { getUsers } from '@/app/src/services/users';

import { Appointment } from '@/app/src/types/appointments';
import { Professional } from '@/app/src/types/professionals';
import { Service } from '@/app/src/types/service';
import { User } from '@/app/src/types/user';

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [slots, setSlots] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  async function loadData() {
    if (!user) return;

    try {
      const [appointmentsData, professionalsData, servicesData, usersData] =
        await Promise.all([
          getAppointments(),
          getProfessionals(),
          getServices(),
          getUsers(),
        ]);

      setAppointments(appointmentsData);
      setProfessionals(professionalsData);
      setServices(servicesData);
      setClients(usersData.filter((item: User) => item.role === 'CLIENTE'));
    } finally {
      setLoading(false);
    }
  }

  async function loadSlots() {
    if (!professionalId || !serviceId || !date) {
      alert('Selecione profissional, serviço e data.');
      return;
    }

    try {
      const data = await getAvailableSlots(professionalId, date, serviceId);

      setSlots(data);
      setSelectedSlot('');
    } catch (error) {
      console.error(error);
      alert('Erro ao buscar horários disponíveis.');
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!clientId || !professionalId || !serviceId || !date || !selectedSlot) {
      alert('Preencha todos os campos e selecione um horário.');
      return;
    }

    const appointment = await createAppointment({
      clientId,
      professionalId,
      serviceId,
      startAt: `${date}T${selectedSlot}:00`,
    });

    setAppointments((state) => [appointment, ...state]);

    setClientId('');
    setProfessionalId('');
    setServiceId('');
    setDate('');
    setSelectedSlot('');
    setSlots([]);
  }

  async function handleCancel(id: string) {
    const updated = await cancelAppointment(id);

    setAppointments((state) =>
      state.map((appointment) =>
        appointment.id === id ? updated : appointment,
      ),
    );
  }

  async function handleComplete(id: string) {
    const updated = await completeAppointment(id);

    setAppointments((state) =>
      state.map((appointment) =>
        appointment.id === id ? updated : appointment,
      ),
    );
  }

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    }
  }, [authLoading, user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Agendamentos</h1>

        <p className="text-zinc-500">Gerencie os agendamentos da plataforma</p>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <select
            className="h-12 border rounded-xl px-4"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">Selecione o cliente</option>

            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} — {client.email}
              </option>
            ))}
          </select>

          <select
            className="h-12 border rounded-xl px-4"
            value={professionalId}
            onChange={(e) => {
              setProfessionalId(e.target.value);
              setSlots([]);
              setSelectedSlot('');
            }}
          >
            <option value="">Selecione o profissional</option>

            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.user?.name ?? 'Profissional sem nome'}
              </option>
            ))}
          </select>

          <select
            className="h-12 border rounded-xl px-4"
            value={serviceId}
            onChange={(e) => {
              setServiceId(e.target.value);
              setSlots([]);
              setSelectedSlot('');
            }}
          >
            <option value="">Selecione o serviço</option>

            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="h-12 border rounded-xl px-4"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSlots([]);
              setSelectedSlot('');
            }}
          />
        </div>

        <button
          type="button"
          onClick={loadSlots}
          className="h-12 px-6 rounded-xl border border-zinc-300"
        >
          Buscar horários disponíveis
        </button>

        <div className="flex flex-wrap gap-2">
          {slots.length > 0 ? (
            slots.map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-4 py-2 rounded-xl border ${
                  selectedSlot === slot ? 'bg-black text-white' : 'bg-white'
                }`}
              >
                {slot}
              </button>
            ))
          ) : (
            <span className="text-sm text-zinc-400">
              Nenhum horário carregado
            </span>
          )}
        </div>

        <button
          type="submit"
          className="h-12 px-6 rounded-xl bg-black text-white"
        >
          Agendar
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">Carregando...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-zinc-100 border-b">
              <tr>
                <th className="text-left p-4">Cliente</th>
                <th className="text-left p-4">Profissional</th>
                <th className="text-left p-4">Serviço</th>
                <th className="text-left p-4">Data</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Ações</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b">
                  <td className="p-4">{appointment.client?.name ?? '-'}</td>

                  <td className="p-4">
                    {appointment.professional?.user?.name ?? '-'}
                  </td>

                  <td className="p-4">{appointment.service?.name ?? '-'}</td>

                  <td className="p-4">
                    {new Date(appointment.startAt).toLocaleString('pt-BR')}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-sm">
                      {appointment.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {appointment.status === 'CONFIRMED' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleComplete(appointment.id)}
                          className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm"
                        >
                          Concluir
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancel(appointment.id)}
                          className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <span className="block text-right text-sm text-zinc-400">
                        Sem ações
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {appointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-zinc-400">
                    Nenhum agendamento encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}