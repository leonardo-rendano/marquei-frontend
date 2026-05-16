"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/app/src/hooks/useAuth";

import {
  cancelAppointment,
  completeAppointment,
  createAppointment,
  getAppointments,
  getAvailableSlots,
} from "@/app/src/services/appointments";

import { getProfessionals } from "@/app/src/services/professionals";

import { getServices } from "@/app/src/services/services";

import { Professional } from "@/app/src/types/professionals";

import { Appointment } from "@/app/src/types/appointments";
import { Service } from "@/app/src/types/service";

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [professionals, setProfessionals] = useState<Professional[]>([]);

  const [services, setServices] = useState<Service[]>([]);

  const [slots, setSlots] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [clientId, setClientId] = useState("");

  const [professionalId, setProfessionalId] = useState("");

  const [serviceId, setServiceId] = useState("");

  const [date, setDate] = useState("");

  const [selectedSlot, setSelectedSlot] = useState("");

  async function loadData() {
    if (!user) return;

    try {
      const [appointmentsData, professionalsData, servicesData] =
        await Promise.all([
          getAppointments(),
          getProfessionals(),
          getServices(),
        ]);

      setAppointments(appointmentsData);
      setProfessionals(professionalsData);
      setServices(servicesData);
    } finally {
      setLoading(false);
    }
  }

  async function loadSlots() {
    if (!professionalId || !serviceId || !date) {
      return;
    }

    const data = await getAvailableSlots(professionalId, date, serviceId);

    setSlots(data);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    const appointment = await createAppointment({
      clientId,
      professionalId,
      serviceId,
      startAt: `${date}T${selectedSlot}:00`,
    });

    setAppointments((state) => [appointment, ...state]);

    setSelectedSlot("");
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

        <p className="text-zinc-500">Gerencie os agendamentos</p>
      </div>

      <form className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Client ID"
            className="h-12 border rounded-xl px-4"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />

          <select
            className="h-12 border rounded-xl px-4"
            value={professionalId}
            onChange={(e) => setProfessionalId(e.target.value)}
          >
            <option value="">Profissional</option>

            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.user.name}
              </option>
            ))}
          </select>

          <select
            className="h-12 border rounded-xl px-4"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">Serviço</option>

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
            onChange={(e) => setDate(e.target.value)}
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
          {slots.map((slot) => (
            <button
              type="button"
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`px-4 py-2 rounded-xl border ${
                selectedSlot === slot ? "bg-black text-white" : "bg-white"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        <button
          type="submit"
          onClick={handleCreate}
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
                  <td className="p-4">{appointment.client?.name}</td>

                  <td className="p-4">
                    {appointment.professional?.user?.name}
                  </td>

                  <td className="p-4">{appointment.service?.name}</td>

                  <td className="p-4">
                    {new Date(appointment.startAt).toLocaleString("pt-BR")}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-sm">
                      {appointment.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleComplete(appointment.id)}
                        className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm"
                      >
                        Concluir
                      </button>

                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
