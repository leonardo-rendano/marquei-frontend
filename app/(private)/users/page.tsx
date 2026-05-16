'use client';

import {
  useEffect,
  useState,
} from 'react';

import { useAuth } from '@/app/src/hooks/useAuth';

import {
  createUser,
  getUsers,
} from '@/app/src/services/users';

import {
  User,
  UserRole,
} from '@/app/src/types/user';

const roles: UserRole[] = [
  'GESTOR',
  'PROFISSIONAL',
  'CLIENTE',
];

export default function UsersPage() {
  const { user, loading: authLoading } =
    useAuth();

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [role, setRole] =
    useState<UserRole>('CLIENTE');

  async function loadUsers() {
    if (!user) return;

    try {
      const data =
        await getUsers();

      setUsers(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    const createdUser =
      await createUser({
        name,
        email,
        password,
        role,
      });

    setUsers((state) => [
      createdUser,
      ...state,
    ]);

    setName('');
    setEmail('');
    setPassword('');
    setRole('CLIENTE');
  }

  useEffect(() => {
    if (!authLoading && user) {
      loadUsers();
    }
  }, [authLoading, user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Usuários
        </h1>

        <p className="text-zinc-500">
          Gerencie usuários da plataforma
        </p>
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
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="E-mail"
          className="h-12 border rounded-xl px-4"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Senha"
          className="h-12 border rounded-xl px-4"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value,
            )
          }
        />

        <select
          className="h-12 border rounded-xl px-4"
          value={role}
          onChange={(e) =>
            setRole(
              e.target
                .value as UserRole,
            )
          }
        >
          {roles.map((role) => (
            <option
              key={role}
              value={role}
            >
              {role}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="h-12 rounded-xl bg-black text-white font-medium col-span-4"
        >
          Criar usuário
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            Carregando...
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-zinc-100 border-b">
              <tr>
                <th className="text-left p-4">
                  Nome
                </th>

                <th className="text-left p-4">
                  E-mail
                </th>

                <th className="text-left p-4">
                  Perfil
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b"
                >
                  <td className="p-4">
                    {user.name}
                  </td>

                  <td className="p-4">
                    {user.email}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-sm">
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}