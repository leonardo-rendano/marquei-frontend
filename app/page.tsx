import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Marquei</h1>

        <p className="text-zinc-500 mb-8">Plataforma de agendamentos</p>

        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="bg-black text-white h-12 rounded-xl flex items-center justify-center"
          >
            Entrar
          </Link>

          <Link
            href="/register"
            className="border border-zinc-300 h-12 rounded-xl flex items-center justify-center"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}
