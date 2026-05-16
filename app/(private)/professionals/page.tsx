'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/app/src/hooks/useAuth';

import {
  createProfessional,
  getProfessionals,
} from '@/app/src/services/professionals';

import { getServices } from '@/app/src/services/services';
import { getUsers } from '@/app/src/services/users';

import { Service } from '@/app/src/types/service';
import { Professional } from '@/app/src/types/professionals';

type UserRole = 'GESTOR' | 'PROFISSIONAL' | 'CLIENTE';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export default function ProfessionalsPage() {
  const { user, loading: authLoading } = useAuth();

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  async function loadData() {
    if (!user) return;

    try {
      const [professionalsData, servicesData, usersData] = await Promise.all([
        getProfessionals(),
        getServices(),
        getUsers(),
      ]);

      setProfessionals(professionalsData);
      setServices(servicesData);

      setUsers(
        usersData.filter((user: User) => user.role === 'PROFISSIONAL'),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!userId || !specialty) {
      alert('Selecione um usuário e informe a especialidade.');
      return;
    }

    const professional = await createProfessional({
      userId,
      specialty,
      serviceIds: selectedServices,
    });

    setProfessionals((state) => [professional, ...state]);

    setUserId('');
    setSpecialty('');
    setSelectedServices([]);
  }

  function toggleService(serviceId: string) {
    setSelectedServices((state) =>
      state.includes(serviceId)
        ? state.filter((id) => id !== serviceId)
        : [...state, serviceId],
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
        <h1 className="text-3xl font-bold">Profissionais</h1>

        <p className="text-zinc-500">Gerencie os profissionais</p>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <select
            className="h-12 border rounded-xl px-4"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Selecione o profissional</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} — {user.email}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Especialidade"
            className="h-12 border rounded-xl px-4"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <button
              type="button"
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={`px-4 py-2 rounded-xl border ${
                selectedServices.includes(service.id)
                  ? 'bg-black text-white'
                  : 'bg-white'
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="h-12 px-6 rounded-xl bg-black text-white font-medium"
        >
          Criar profissional
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div>Carregando...</div>
        ) : (
          professionals.map((professional) => (
            <div
              key={professional.id}
              className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  {professional.user?.name ?? 'Profissional sem nome'}
                </h2>

                <p className="text-zinc-500">
                  {professional.specialty || 'Sem especialidade'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {professional.services?.length ? (
                  professional.services.map((item) => (
                    <span
                      key={item.service.id}
                      className="px-3 py-1 rounded-full bg-zinc-100 text-sm"
                    >
                      {item.service.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-zinc-400">
                    Nenhum serviço vinculado
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}