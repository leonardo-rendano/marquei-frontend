"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { RoleGuard } from "@/app/src/components/RoleGuard";
import { useAuth } from "@/app/src/hooks/useAuth";

import { createUser, getUsers } from "@/app/src/services/users";

import { User, UserRole } from "@/app/src/types/user";

const roles: UserRole[] = ["GESTOR", "PROFISSIONAL", "CLIENTE"];

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CLIENTE");

  const loadUsers = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      toast.error("Preencha nome, e-mail, senha e perfil.");
      return;
    }

    try {
      setCreating(true);

      const createdUser = await createUser({
        name,
        email,
        password,
        role,
      });

      setUsers((state) => [createdUser, ...state]);

      setName("");
      setEmail("");
      setPassword("");
      setRole("CLIENTE");

      toast.success("Usuário criado com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar usuário.");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      startTransition(() => {
        loadUsers();
      });
    }
  }, [authLoading, user, loadUsers]);

  function getRoleBadge(role: UserRole) {
    const styles: Record<UserRole, string> = {
      GESTOR: "bg-purple-100 text-purple-700",
      PROFISSIONAL: "bg-blue-100 text-blue-700",
      CLIENTE: "bg-green-100 text-green-700",
    };

    const labels: Record<UserRole, string> = {
      GESTOR: "Gestor",
      PROFISSIONAL: "Profissional",
      CLIENTE: "Cliente",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
          styles[role]
        }`}
      >
        {labels[role]}
      </span>
    );
  }

  return (
    <RoleGuard allowedRoles={["GESTOR"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>

          <p className="text-zinc-500">Gerencie usuários da plataforma</p>
        </div>

        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Nome"
            className="h-12 border rounded-xl px-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="E-mail"
            className="h-12 border rounded-xl px-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="h-12 border rounded-xl px-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="h-12 border rounded-xl px-4"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={creating}
            className="h-12 rounded-xl bg-black text-white font-medium col-span-4 disabled:opacity-50"
          >
            {creating ? "Criando..." : "Criar usuário"}
          </button>
        </form>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6">Carregando...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-zinc-100 border-b">
                <tr>
                  <th className="text-left p-4">Nome</th>
                  <th className="text-left p-4">E-mail</th>
                  <th className="text-left p-4">Perfil</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-4">{user.name}</td>

                    <td className="p-4">{user.email}</td>

                    <td className="p-4">{getRoleBadge(user.role)}</td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-zinc-400">
                      Nenhum usuário cadastrado
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
