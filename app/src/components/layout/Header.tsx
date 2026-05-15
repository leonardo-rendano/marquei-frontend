'use client';

import { useAuth } from "../../hooks/useAth";


export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between">
      <div>
        <h2 className="font-semibold text-lg">
          Olá, {user?.name}
        </h2>

        <p className="text-sm text-zinc-500">
          {user?.role}
        </p>
      </div>

      <button
        onClick={logout}
        className="h-11 px-5 rounded-xl bg-black text-white"
      >
        Sair
      </button>
    </header>
  );
}