'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useAuth } from '../src/hooks/useAth';


export default function LoginPage() {
  const router = useRouter();

  const { signIn } = useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await signIn(email, password);

      router.push('/dashboard');
    } catch {
      alert('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-100">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          Entrar
        </h1>

        <p className="text-zinc-500 mb-8">
          Acesse sua conta
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            className="h-12 rounded-xl border border-zinc-300 px-4"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Senha"
            className="h-12 rounded-xl border border-zinc-300 px-4"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-xl bg-black text-white font-medium"
          >
            {loading
              ? 'Entrando...'
              : 'Entrar'}
          </button>
        </div>
      </form>
    </main>
  );
}