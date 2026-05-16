"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CalendarCheck,
  CalendarDays,
  Clock,
  LayoutDashboard,
  LogOut,
  Scissors,
  UserRoundCog,
  Users,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

type Role = "GESTOR" | "PROFISSIONAL" | "CLIENTE";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["GESTOR", "PROFISSIONAL", "CLIENTE"],
    },
    {
      href: "/services",
      label: "Serviços",
      icon: Scissors,
      roles: ["GESTOR"],
    },
    {
      href: "/professionals",
      label: "Profissionais",
      icon: UserRoundCog,
      roles: ["GESTOR"],
    },
    {
      href: "/availability",
      label: "Disponibilidade",
      icon: Clock,
      roles: ["GESTOR"],
    },
    {
      href: "/users",
      label: "Usuários",
      icon: Users,
      roles: ["GESTOR"],
    },
    {
      href: "/appointments",
      label: "Agendamentos",
      icon: CalendarDays,
      roles: ["GESTOR"],
    },
    {
      href: "/my-schedule",
      label: "Minha agenda",
      icon: CalendarCheck,
      roles: ["PROFISSIONAL"],
    },
    {
      href: "/my-appointments",
      label: "Meus agendamentos",
      icon: CalendarDays,
      roles: ["CLIENTE"],
    },
  ];

  const roleLabels: Record<Role, string> = {
    GESTOR: "Gestor",
    PROFISSIONAL: "Profissional",
    CLIENTE: "Cliente",
  };

  return (
    <aside className="w-72 bg-zinc-950 text-white flex flex-col p-6 border-r border-zinc-800">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">Marquei</h1>

        <p className="mt-1 text-sm text-zinc-400">
          {user?.role ? roleLabels[user.role] : "Usuário"}
        </p>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          if (!user?.role || !link.roles.includes(user.role)) {
            return null;
          }

          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`h-11 rounded-xl px-4 flex items-center gap-3 text-sm font-medium transition ${
                active
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="h-11 rounded-xl bg-zinc-900 hover:bg-red-600 transition flex items-center justify-center gap-2 text-sm font-medium"
      >
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}
