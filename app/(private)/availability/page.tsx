'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/app/src/hooks/useAuth';
import {
  createAvailability,
  getAvailability,
} from '@/app/src/services/availability';
import { getProfessionals } from '@/app/src/services/professionals';

import { Availability } from '@/app/src/types/availability';
import { Professional } from '@/app/src/types/professionals';

const weekDays = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

export default function AvailabilityPage() {
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<Availability[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  const [professionalId, setProfessionalId] = useState('');
  const [weekDay, setWeekDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  async function loadData() {
    if (!user) return;

    try {
      const [availabilityData, professionalsData] = await Promise.all([
        getAvailability(),
        getProfessionals(),
      ]);

      setItems(availabilityData);
      setProfessionals(professionalsData);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    const availability = await createAvailability({
      professionalId,
      weekDay: Number(weekDay),
      startTime,
      endTime,
    });

    setItems((state) => [availability, ...state]);

    setProfessionalId('');
    setWeekDay('');
    setStartTime('');
    setEndTime('');
  }

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    }
  }, [authLoading, user]);

  return (
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
              {professional.user?.name}
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
          className="h-12 rounded-xl bg-black text-white font-medium"
        >
          Criar
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
                    {item.professional?.user?.name ?? item.professional?.user?.name}
                  </td>

                  <td className="p-4">{weekDays[item.weekDay]}</td>

                  <td className="p-4">{item.startTime}</td>

                  <td className="p-4">{item.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}