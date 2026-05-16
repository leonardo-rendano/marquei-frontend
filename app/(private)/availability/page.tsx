"use client";

import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/app/src/hooks/useAuth";

import {
  createAvailability,
  getAvailability,
} from "@/app/src/services/availability";

import { getProfessionals } from "@/app/src/services/professionals";

import { Availability } from "@/app/src/types/availability";
import { Professional } from "@/app/src/types/professionals";
import { RoleGuard } from "@/app/src/components/RoleGuard";

const weekDays = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export default function AvailabilityPage() {
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<Availability[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [professionalId, setProfessionalId] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  function getProfessionalName(professionalId: string) {
    const professional = professionals.find(
      (item) => item.id === professionalId,
    );

    return professional?.user?.name ?? "Profissional não encontrado";
  }

  async function loadData() {
    if (!user) return;

    try {
      setLoading(true);

      const [availabilityData, professionalsData] = await Promise.all([
        getAvailability(),
        getProfessionals(),
      ]);

      setItems(availabilityData);
      setProfessionals(professionalsData);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar disponibilidades.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!professionalId || !weekDay || !startTime || !endTime) {
      toast.error("Preencha profissional, dia e horários.");
      return;
    }

    if (startTime >= endTime) {
      toast.error("O horário inicial deve ser menor que o horário final.");
      return;
    }

    try {
      setCreating(true);

      const availability = await createAvailability({
        professionalId,
        weekDay: Number(weekDay),
        startTime,
        endTime,
      });

      setItems((state) => [availability, ...state]);

      setProfessionalId("");
      setWeekDay("");
      setStartTime("");
      setEndTime("");

      toast.success("Disponibilidade criada com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar disponibilidade.");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      startTransition(() => {
        loadData();
      });
    }
  }, [authLoading, user]);

  return (
    <RoleGuard allowedRoles={["GESTOR"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Disponibilidade</h1>

          <p className="text-zinc-500">
            Configure a jornada semanal dos profissionais
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-5 gap-4"
        >
          <select
            className="h-12 border rounded-xl px-4"
            value={professionalId}
            onChange={(e) => setProfessionalId(e.target.value)}
          >
            <option value="">Profissional</option>

            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.user?.name ?? "Profissional sem nome"}
              </option>
            ))}
          </select>

          <select
            className="h-12 border rounded-xl px-4"
            value={weekDay}
            onChange={(e) => setWeekDay(e.target.value)}
          >
            <option value="">Dia</option>

            {weekDays.map((day, index) => (
              <option key={day} value={index}>
                {day}
              </option>
            ))}
          </select>

          <input
            type="time"
            className="h-12 border rounded-xl px-4"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <input
            type="time"
            className="h-12 border rounded-xl px-4"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <button
            type="submit"
            disabled={creating}
            className="h-12 rounded-xl bg-black text-white font-medium disabled:opacity-50"
          >
            {creating ? "Criando..." : "Criar"}
          </button>
        </form>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6">Carregando...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-zinc-100 border-b">
                <tr>
                  <th className="text-left p-4">Profissional</th>
                  <th className="text-left p-4">Dia</th>
                  <th className="text-left p-4">Início</th>
                  <th className="text-left p-4">Fim</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-4">
                      {item.professional?.user?.name ??
                        getProfessionalName(item.professionalId)}
                    </td>

                    <td className="p-4">{weekDays[item.weekDay] ?? "-"}</td>

                    <td className="p-4">{item.startTime}</td>

                    <td className="p-4">{item.endTime}</td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-zinc-400">
                      Nenhuma disponibilidade cadastrada
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
