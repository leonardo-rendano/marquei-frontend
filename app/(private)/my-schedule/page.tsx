"use client";

import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/app/src/hooks/useAuth";

import {
  cancelAppointment,
  completeAppointment,
  getMyProfessionalSchedule,
  markAppointmentAsNoShow,
} from "@/app/src/services/appointments";

import { Appointment } from "@/app/src/types/appointments";
import { RoleGuard } from "@/app/src/components/RoleGuard";

export default function MySchedulePage() {
  const { user, loading: authLoading } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadSchedule() {
    if (!user) return;

    try {
      setLoading(true);

      const data = await getMyProfessionalSchedule();

      setAppointments(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar sua agenda.");
    } finally {
      setLoading(false);
    }
  }

  async function updateAppointment(
    id: string,
    action: "complete" | "cancel" | "no-show",
  ) {
    try {
      setUpdatingId(id);

      const updated =
        action === "complete"
          ? await completeAppointment(id)
          : action === "cancel"
            ? await cancelAppointment(id)
            : await markAppointmentAsNoShow(id);

      setAppointments((state) =>
        state.map((appointment) =>
          appointment.id === id ? updated : appointment,
        ),
      );

      toast.success("Agendamento atualizado.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar agendamento.");
    } finally {
      setUpdatingId(null);
    }
  }

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

  useEffect(() => {
    if (!authLoading && user) {
      startTransition(() => {
        loadSchedule();
      });
    }
  }, [authLoading, user]);

  return (
    <RoleGuard allowedRoles={["PROFISSIONAL"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Minha agenda</h1>

          <p className="text-zinc-500">
            Visualize e gerencie seus atendimentos
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6">Carregando...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-zinc-100 border-b">
                <tr>
                  <th className="text-left p-4">Cliente</th>
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
                          <button
                            type="button"
                            disabled={updatingId === appointment.id}
                            onClick={() =>
                              updateAppointment(appointment.id, "complete")
                            }
                            className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm disabled:opacity-50"
                          >
                            Concluir
                          </button>

                          <button
                            type="button"
                            disabled={updatingId === appointment.id}
                            onClick={() =>
                              updateAppointment(appointment.id, "no-show")
                            }
                            className="px-3 py-2 rounded-lg bg-orange-500 text-white text-sm disabled:opacity-50"
                          >
                            No-show
                          </button>

                          <button
                            type="button"
                            disabled={updatingId === appointment.id}
                            onClick={() =>
                              updateAppointment(appointment.id, "cancel")
                            }
                            className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50"
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
                    <td colSpan={5} className="p-6 text-center text-zinc-400">
                      Nenhum atendimento encontrado
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
