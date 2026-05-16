"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { RoleGuard } from "@/app/src/components/RoleGuard";
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
import { getUsers } from "@/app/src/services/users";

import { Appointment } from "@/app/src/types/appointments";
import { Professional } from "@/app/src/types/professionals";
import { Service } from "@/app/src/types/service";
import { User } from "@/app/src/types/user";

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [slots, setSlots] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [creating, setCreating] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState<
    string | null
  >(null);

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

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
      setClients(usersData.filter((item: User) => item.role === "CLIENTE"));
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados de agendamentos.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  async function loadSlots() {
    if (!professionalId || !serviceId || !date) {
      toast.error("Selecione profissional, serviço e data.");
      return;
    }

    try {
      setLoadingSlots(true);

      const data = await getAvailableSlots(professionalId, date, serviceId);

      setSlots(data);
      setSelectedSlot("");

      if (data.length === 0) {
        toast.info("Nenhum horário disponível para os filtros selecionados.");
      } else {
        toast.success("Horários carregados com sucesso.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar horários disponíveis.");
    } finally {
      setLoadingSlots(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!clientId || !professionalId || !serviceId || !date || !selectedSlot) {
      toast.error("Preencha todos os campos e selecione um horário.");
      return;
    }

    try {
      setCreating(true);

      const appointment = await createAppointment({
        clientId,
        professionalId,
        serviceId,
        startAt: `${date}T${selectedSlot}:00`,
      });

      setAppointments((state) => [appointment, ...state]);

      setClientId("");
      setProfessionalId("");
      setServiceId("");
      setDate("");
      setSelectedSlot("");
      setSlots([]);

      toast.success("Agendamento criado com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar agendamento.");
    } finally {
      setCreating(false);
    }
  }

  async function handleCancel(id: string) {
    try {
      setUpdatingAppointmentId(id);

      const updated = await cancelAppointment(id);

      setAppointments((state) =>
        state.map((appointment) =>
          appointment.id === id ? updated : appointment,
        ),
      );

      toast.success("Agendamento cancelado.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cancelar agendamento.");
    } finally {
      setUpdatingAppointmentId(null);
    }
  }

  async function handleComplete(id: string) {
    try {
      setUpdatingAppointmentId(id);

      const updated = await completeAppointment(id);

      setAppointments((state) =>
        state.map((appointment) =>
          appointment.id === id ? updated : appointment,
        ),
      );

      toast.success("Atendimento concluído.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao concluir atendimento.");
    } finally {
      setUpdatingAppointmentId(null);
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      startTransition(() => {
        loadData();
      });
    }
  }, [authLoading, user, loadData]);

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      CONFIRMED: "bg-blue-100 text-blue-700",
      COMPLETED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
      NO_SHOW: "bg-orange-100 text-orange-700",
    };

    const labels: Record<string, string> = {
      CONFIRMED: "Confirmado",
      COMPLETED: "Concluído",
      CANCELLED: "Cancelado",
      NO_SHOW: "No-show",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[status] ?? "bg-zinc-100 text-zinc-700"
        }`}
      >
        {labels[status] ?? status}
      </span>
    );
  }

  return (
    <RoleGuard allowedRoles={["GESTOR", "PROFISSIONAL"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Agendamentos</h1>
          <p className="text-zinc-500">
            Gerencie os agendamentos da plataforma
          </p>
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
                setSelectedSlot("");
              }}
            >
              <option value="">Selecione o profissional</option>

              {professionals.map((professional) => (
                <option key={professional.id} value={professional.id}>
                  {professional.user?.name ?? "Profissional sem nome"}
                </option>
              ))}
            </select>

            <select
              className="h-12 border rounded-xl px-4"
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                setSlots([]);
                setSelectedSlot("");
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
                setSelectedSlot("");
              }}
            />
          </div>

          <button
            type="button"
            onClick={loadSlots}
            disabled={loadingSlots}
            className="h-12 px-6 rounded-xl border border-zinc-300 disabled:opacity-50"
          >
            {loadingSlots ? "Buscando..." : "Buscar horários disponíveis"}
          </button>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700">
              Horários disponíveis
            </h3>

            {slots.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {slots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`h-11 rounded-xl border text-sm font-medium transition-all ${
                      selectedSlot === slot
                        ? "bg-black text-white border-black"
                        : "bg-white hover:bg-zinc-100 border-zinc-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-center">
                <p className="text-sm text-zinc-400">
                  Nenhum horário carregado
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={creating}
            className="h-12 px-6 rounded-xl bg-black text-white disabled:opacity-50"
          >
            {creating ? "Agendando..." : "Agendar"}
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
                    <td className="p-4">{appointment.client?.name ?? "-"}</td>

                    <td className="p-4">
                      {appointment.professional?.user?.name ?? "-"}
                    </td>

                    <td className="p-4">{appointment.service?.name ?? "-"}</td>

                    <td className="p-4">
                      {new Date(appointment.startAt).toLocaleString("pt-BR")}
                    </td>

                    <td className="p-4">
                      {getStatusBadge(appointment.status)}
                    </td>

                    <td className="p-4">
                      {appointment.status === "CONFIRMED" ? (
                        <div className="flex justify-end gap-2">
                          {user?.role === "PROFISSIONAL" && (
                            <button
                              type="button"
                              disabled={
                                updatingAppointmentId === appointment.id
                              }
                              onClick={() => handleComplete(appointment.id)}
                              className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm disabled:opacity-50"
                            >
                              {updatingAppointmentId === appointment.id
                                ? "Atualizando..."
                                : "Concluir"}
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={updatingAppointmentId === appointment.id}
                            onClick={() => handleCancel(appointment.id)}
                            className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50"
                          >
                            {updatingAppointmentId === appointment.id
                              ? "Atualizando..."
                              : "Cancelar"}
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
    </RoleGuard>
  );
}
