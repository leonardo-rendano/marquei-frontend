"use client";

import { ReactNode } from "react";
import { useAuth } from "../src/hooks/useAth";
import { Sidebar } from "../src/components/Sidebar";
import { Header } from "../src/components/layout/Header";


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
