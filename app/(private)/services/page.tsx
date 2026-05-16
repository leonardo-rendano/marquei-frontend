"use client";

import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/app/src/hooks/useAuth";

import { createService, getServices } from "@/app/src/services/services";

import { RoleGuard } from "@/app/src/components/RoleGuard";
import { Service } from "@/app/src/types/service";

export default function ServicesPage() {
  const { user, loading: authLoading } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  async function loadServices() {
    if (!user) return;

    try {
      setLoading(true);

      const data = await getServices();

      setServices(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar serviços.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateService(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !duration || !price) {
      toast.error("Preencha nome, duração e preço.");
      return;
    }

    try {
      setCreating(true);

      const service = await createService({
        name,
        duration: Number(duration),
        price: Number(price),
      });

      setServices((state) => [service, ...state]);

      setName("");
      setDuration("");
      setPrice("");

      toast.success("Serviço criado com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar serviço.");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      startTransition(() => {
        loadServices();
      });
    }
  }, [authLoading, user]);

  return (
    <RoleGuard allowedRoles={["GESTOR"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Serviços</h1>

          <p className="text-zinc-500">Gerencie os serviços do salão</p>
        </div>

        <form
          onSubmit={handleCreateService}
          className="bg-white rounded-2xl p-6 shadow-sm flex gap-4"
        >
          <input
            type="text"
            placeholder="Nome"
            className="h-12 border rounded-xl px-4 flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Duração"
            className="h-12 border rounded-xl px-4 w-40"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <input
            type="number"
            placeholder="Preço"
            className="h-12 border rounded-xl px-4 w-40"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button
            type="submit"
            disabled={creating}
            className="h-12 px-6 rounded-xl bg-black text-white font-medium disabled:opacity-50"
          >
            {creating ? "Criando..." : "Criar"}
          </button>
        </form>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6">Carregando...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-zinc-100 border-b">
                <tr>
                  <th className="text-left p-4">Serviço</th>
                  <th className="text-left p-4">Duração</th>
                  <th className="text-left p-4">Preço</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b">
                    <td className="p-4">{service.name}</td>

                    <td className="p-4">{service.duration} min</td>

                    <td className="p-4">
                      R$ {Number(service.price).toFixed(2)}
                    </td>
                  </tr>
                ))}

                {services.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-zinc-400">
                      Nenhum serviço cadastrado
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
