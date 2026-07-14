import { useState, useEffect } from "react";
import type { Bloco } from "./features/unidades/types";
import { BlocoCard } from "./features/unidades/components/BlocoCard";
import { BlocoForm } from "./features/unidades/components/BlocoForm";
import { api } from "./services/api";

export function App() {
  const [blocos, setBlocos] = useState<Bloco[]>([]);

  useEffect(() => {
    carregarBlocos();
  }, []);

  async function carregarBlocos() {
    try {
      const response = await api.get("/blocos");
      setBlocos(response.data);
    } catch (error) {
      console.error("Erro ao carregar blocos:", error);
      alert("Não foi possível carregar a lista de blocos do servidor.");
    }
  }

  async function adicionarBloco(nomeDoNovoBloco: string) {
    try {
      const response = await api.post("/blocos", { nome: nomeDoNovoBloco });
      const novoBlocoSalvo = response.data;

      setBlocos([...blocos, novoBlocoSalvo]);
    } catch (error) {
      console.error("Erro ao salvar bloco:", error);
      alert("Não foi possível salvar o bloco no banco de dados.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-gray-800 font-bold mb-8">
          NeoCondo - Gestão de Unidades
        </h1>

        <BlocoForm onSalvar={adicionarBloco} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocos.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-8">
              Nenhum bloco cadastrado ainda.
            </p>
          ) : (
            blocos.map((blocoAtual) => (
              <BlocoCard key={blocoAtual.id} bloco={blocoAtual} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
