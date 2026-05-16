'use client';

import { startTransition, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/app/src/hooks/useAuth';
import { getDashboardMetrics } from '@/app/src/services/dashboard';
import { DashboardMetrics } from '@/app/src/types/dashboard';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('2026-05-31');

  async function loadMetrics() {
    if (!user) return;

    if (!startDate || !endDate) {
      toast.error('Selecione data inicial e data final.');
      return;
    }

    if (startDate > endDate) {
      toast.error('A data inicial não pode ser maior que a data final.');
      return;
    }

    try {
      setLoading(true);
      setFiltering(true);

      const data = await getDashboardMetrics({
        startDate,
        endDate,
      });

      setMetrics(data);
      toast.success('Indicadores carregados com sucesso.');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar indicadores.');
    } finally {
      setLoading(false);
      setFiltering(false);
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      startTransition(() => {
        loadMetrics();
      });
    }
  }, [authLoading, user]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <p className="text-zinc-500">
            Indicadores gerais do negócio
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="date"
            className="h-11 rounded-xl border px-4"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="h-11 rounded-xl border px-4"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button
            type="button"
            onClick={loadMetrics}
            disabled={filtering}
            className="h-11 rounded-xl bg-black px-5 text-white disabled:opacity-50"
          >
            {filtering ? 'Filtrando...' : 'Filtrar'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          Carregando...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-zinc-500">Agendamentos</p>
              <strong className="text-3xl">
                {metrics?.totalAppointments ?? 0}
              </strong>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-zinc-500">Concluídos</p>
              <strong className="text-3xl">
                {metrics?.completedAppointments ?? 0}
              </strong>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-zinc-500">No-show</p>
              <strong className="text-3xl">
                {metrics?.noShowRate ?? 0}%
              </strong>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-zinc-500">
                Faturamento estimado
              </p>
              <strong className="text-3xl">
                R$ {Number(metrics?.estimatedRevenue ?? 0).toFixed(2)}
              </strong>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              Serviços mais procurados
            </h2>

            {metrics?.mostRequestedServices?.length ? (
              <div className="space-y-3">
                {metrics.mostRequestedServices.map((item) => (
                  <div
                    key={item.serviceId}
                    className="flex items-center justify-between border-b pb-3 last:border-b-0"
                  >
                    <span className="font-medium text-zinc-700">
                      {item.serviceName}
                    </span>

                    <strong>
                      {item.count} agendamento
                      {item.count === 1 ? '' : 's'}
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-center">
                <p className="text-sm text-zinc-400">
                  Nenhum dado encontrado no período.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}