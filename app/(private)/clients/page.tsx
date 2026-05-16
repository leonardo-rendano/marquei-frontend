"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { RoleGuard } from "@/app/src/components/RoleGuard";
import { useAuth } from "@/app/src/hooks/useAuth";

import { createUser, getUsers } from "@/app/src/services/users";

import { User } from "@/app/src/types/user";

export default function ClientsPage() {
  const { user, loading: authLoading } = useAuth();

  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loadClients = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const data = await getUsers();

      setClients(data.filter((item: User) => item.role === "CLIENTE"));
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar clientes.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Preencha nome, e-mail e senha.");
      return;
    }

    try {
      setCreating(true);

      const client = await createUser({
        name,
        email,
        password,
        role: "CLIENTE",
      });

      setClients((state) => [client, ...state]);

      setName("");
      setEmail("");
      setPassword("");

      toast.success("Cliente criado com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar cliente.");
    } finally {
      setCreating(false);
    }
  }

  function getClientBadge() {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
        Cliente
      </span>
    );
  }

  useEffect(() => {
    if (!authLoading && user) {
      startTransition(() => {
        loadClients();
      });
    }
  }, [authLoading, user, loadClients]);

  return (
    <RoleGuard allowedRoles={["GESTOR"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>

          <p className="text-zinc-500">
            Cadastre e gerencie os clientes da plataforma
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="grid grid-cols-3 gap-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          <input
            type="text"
            placeholder="Nome"
            className="h-12 rounded-xl border px-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="E-mail"
            className="h-12 rounded-xl border px-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="h-12 rounded-xl border px-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={creating}
            className="col-span-3 h-12 rounded-xl bg-black font-medium text-white disabled:opacity-50"
          >
            {creating ? "Criando..." : "Criar cliente"}
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading ? (
            <div className="p-6">Carregando...</div>
          ) : (
            <table className="w-full">
              <thead className="border-b bg-zinc-100">
                <tr>
                  <th className="p-4 text-left">Nome</th>
                  <th className="p-4 text-left">E-mail</th>
                  <th className="p-4 text-left">Perfil</th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b">
                    <td className="p-4">{client.name}</td>

                    <td className="p-4">{client.email}</td>

                    <td className="p-4">{getClientBadge()}</td>
                  </tr>
                ))}

                {clients.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-zinc-400">
                      Nenhum cliente cadastrado
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
