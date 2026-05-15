"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { useAuth } from "../hooks/useAuth";

export function Sidebar() {
  const pathname = usePathname();

  const { user, logout } = useAuth();

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },

    {
      href: "/services",
      label: "Serviços",
      roles: ["GESTOR"],
    },

    {
      href: "/professionals",
      label: "Profissionais",
      roles: ["GESTOR"],
    },

    {
      href: "/appointments",
      label: "Agendamentos",
    },
  ];

  return (
    <aside className="w-64 bg-zinc-950 text-white flex flex-col p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">Marquei</h1>

        <p className="text-zinc-400 text-sm">{user?.role}</p>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          if (link.roles && !link.roles.includes(user?.role || "")) {
            return null;
          }

          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`h-11 rounded-xl px-4 flex items-center transition ${
                active ? "bg-white text-black" : "hover:bg-zinc-800"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="h-11 rounded-xl bg-red-500 font-medium"
      >
        Sair
      </button>
    </aside>
  );
}
