import { useState, useEffect } from "react";
import type { Bloco, Unidade } from "./features/unidades/types";
import { BlocoCard } from "./features/unidades/components/BlocoCard";
import { BlocoForm } from "./features/unidades/components/BlocoForm";
import { UnidadeCard } from "./features/unidades/components/UnidadeCard";
import { UnidadeForm } from "./features/unidades/components/UnidadeForm";
import { api } from "./services/api";

export function App() {
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  useEffect(() => {
    carregarBlocos();
    carregarUnidades();
  }, []);

  async function carregarBlocos() {
    try {
      const response = await api.get("/blocos");
      setBlocos(response.data);
    } catch (error) {
      console.error("Erro ao carregar blocos:", error);
    }
  }

  async function carregarUnidades() {
    try {
      const response = await api.get("/unidades");
      setUnidades(response.data);
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
    }
  }

  async function adicionarBloco(nomeDoNovoBloco: string) {
    try {
      const response = await api.post("/blocos", { nome: nomeDoNovoBloco });
      setBlocos([...blocos, response.data]);
    } catch (error) {
      console.error("Erro ao salvar bloco:", error);
      alert("Não foi possível salvar o bloco.");
    }
  }

  async function adicionarUnidade(numeroDaUnidade: string, idDoBloco: number) {
    try {
      const payload = {
        numero: numeroDaUnidade,
        bloco: { id: idDoBloco },
      };

      const response = await api.post("/unidades", payload);
      setUnidades([...unidades, response.data]);
    } catch (error) {
      console.error("Erro ao salvar unidade:", error);
      alert("Não foi possível salvar a unidade.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-3xl text-gray-800 font-bold border-b pb-4">
          NeoCondo - Dashboard
        </h1>
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Gestão de Blocos
          </h2>
          <BlocoForm onSalvar={adicionarBloco} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocos.length === 0 ? (
              <p className="text-gray-500 col-span-full">
                Nenhum bloco cadastrado ainda.
              </p>
            ) : (
              blocos.map((blocoAtual) => (
                <BlocoCard key={blocoAtual.id} bloco={blocoAtual} />
              ))
            )}
          </div>
        </section>

        <hr className="border-gray-300" />

        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Gestão de Unidades
          </h2>

          <UnidadeForm blocosDisponiveis={blocos} onSalvar={adicionarUnidade} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {unidades.length === 0 ? (
              <p className="text-gray-500 col-span-full">
                Nenhuma unidade cadastrada ainda.
              </p>
            ) : (
              unidades.map((unidadeAtual) => (
                <UnidadeCard key={unidadeAtual.id} unidade={unidadeAtual} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
