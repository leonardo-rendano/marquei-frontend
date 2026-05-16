'use client';

import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';


export function Header() {
  const { user } = useAuth();

  function getRoleLabel(role?: string) {
    const labels: Record<string, string> = {
      GESTOR: 'Gestor',
      PROFISSIONAL: 'Profissional',
      CLIENTE: 'Cliente',
    };

    return labels[role || ''] ?? 'Usuário';
  }

  function getInitials(name?: string) {
    if (!name) return 'U';

    const parts = name.trim().split(' ');

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return (
    <header className="h-20 border-b border-zinc-200 bg-white px-8 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">
          Bem-vindo de volta
        </h2>

        <p className="text-sm text-zinc-500">
          Gerencie sua operação em tempo real
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="h-11 w-11 rounded-xl border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition"
        >
          <Search size={18} />
        </button>

        <button
          type="button"
          className="h-11 w-11 rounded-xl border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition relative"
        >
          <Bell size={18} />

          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-2">
          <div className="h-11 w-11 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-semibold">
            {getInitials(user?.name)}
          </div>

          <div className="leading-tight">
            <strong className="block text-sm text-zinc-900">
              {user?.name}
            </strong>

            <span className="text-xs text-zinc-500">
              {getRoleLabel(user?.role)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}