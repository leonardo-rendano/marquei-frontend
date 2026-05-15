"use client";

import Link from "next/link";

import {
  Calendar,
  LayoutDashboard,
  Scissors,
  Users,
  UserSquare2,
} from "lucide-react";
import { useAuth } from "../hooks/useAth";

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-72 bg-white border-r border-zinc-200 p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">Marquei</h1>

        <p className="text-sm text-zinc-500">Sistema de Agendamentos</p>
      </div>

      <nav className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 h-12 px-4 rounded-xl hover:bg-zinc-100"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          href="/dashboard/appointments"
          className="flex items-center gap-3 h-12 px-4 rounded-xl hover:bg-zinc-100"
        >
          <Calendar size={18} />
          Agendamentos
        </Link>

        {user?.role === "GESTOR" && (
          <>
            <Link
              href="/dashboard/services"
              className="flex items-center gap-3 h-12 px-4 rounded-xl hover:bg-zinc-100"
            >
              <Scissors size={18} />
              Serviços
            </Link>

            <Link
              href="/dashboard/professionals"
              className="flex items-center gap-3 h-12 px-4 rounded-xl hover:bg-zinc-100"
            >
              <Users size={18} />
              Profissionais
            </Link>

            <Link
              href="/dashboard/clients"
              className="flex items-center gap-3 h-12 px-4 rounded-xl hover:bg-zinc-100"
            >
              <UserSquare2 size={18} />
              Clientes
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
